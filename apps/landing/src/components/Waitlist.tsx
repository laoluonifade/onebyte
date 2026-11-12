import { useEffect, useState, type FormEvent } from "react";
import { joinWaitlist, type JoinResult } from "../lib/waitlist";
import { btn, btnArrow, cx } from "../lib/ui";
import { Joined } from "./Joined";
import { Icon } from "./primitives";

type Props = {
  id: string;
  /** Recorded with the sign-up, so the sheet shows which form people used. */
  source: string;
  /** `green` drops the hairline, for use on the green closing panel. */
  tone?: "paper" | "green";
  /** `lg` grows the field and button from tablet up. Used in the hero. */
  size?: "md" | "lg";
};

/** Email capture for the waitlist. Sign-ups are saved to a Google Sheet (see lib/waitlist.ts). */
export function WaitlistForm({ id, source, tone = "paper", size = "md" }: Props) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [result, setResult] = useState<JoinResult | null>(null);
  const [celebrate, setCelebrate] = useState<{ x: number; y: number } | null>(null);
  const lg = size === "lg";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || status === "sending") return;
    // The green floods out from the button that was pressed.
    const button = event.currentTarget.querySelector("button")?.getBoundingClientRect();
    const origin = button
      ? { x: button.left + button.width / 2, y: button.top + button.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    setStatus("sending");
    try {
      const joined = await joinWaitlist(email.trim(), source, website);
      setResult(joined);
      setCelebrate(origin);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const frame = lg ? "w-[min(100%,480px)] min-[761px]:w-[min(100%,540px)]" : "w-[min(100%,480px)]";

  if (result) {
    return (
      <>
        {celebrate && (
          <Joined email={email} result={result} origin={celebrate} onClose={() => setCelebrate(null)} />
        )}
        <JoinedCard email={email} result={result} className={frame} />
      </>
    );
  }

  return (
    <div className={cx("grid justify-items-center gap-2.5", frame)}>
      <form
        className={cx(
          "flex w-full gap-1.5 rounded-full bg-white p-1.5 max-[520px]:flex-col max-[520px]:rounded-[28px] max-[520px]:p-2",
          tone === "green" ? "shadow-[0_1px_2px_rgb(18_20_17/0.12)]" : "inset-ring inset-ring-line-2 shadow-sm",
          lg && "min-[761px]:p-[7px]",
        )}
        onSubmit={onSubmit}
      >
        <label htmlFor={id} className="sr-only">
          Work email
        </label>
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          placeholder="Your work email"
          className={cx(
            "h-12 min-w-0 flex-1 py-px pr-2 pl-[18px] text-[16px] tracking-[-0.01em] text-ink outline-none placeholder:text-ink-4",
            "max-[520px]:px-3.5 max-[520px]:text-center",
            lg && "min-[761px]:h-14 min-[761px]:pl-5.5 min-[761px]:text-[18px]",
          )}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
        />
        {/* Honeypot: hidden from people and screen readers; bots tend to fill every field. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] size-px opacity-0"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={cx(btn("ink", lg ? "hero" : "md"), "disabled:cursor-progress disabled:opacity-80")}
        >
          {status === "sending" ? "Joining…" : "Join the waitlist"}
          {status !== "sending" && <Icon name="arrow" className={btnArrow} />}
        </button>
      </form>
      {status === "error" && (
        <p className="text-[14px] text-ink-2" role="alert">
          That didn't go through. Check the email and try again.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   What the form becomes once someone has joined: a dark card with the
   mark quietly counting, their place on the list, and a way to share.
   ------------------------------------------------------------------ */

function JoinedCard({ email, result, className }: { email: string; result: JoinResult; className?: string }) {
  const [tick, setTick] = useState(0);
  const [shared, setShared] = useState(false);

  // The mark's lit bit walks across the cells, like the byte is busy.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTick((value) => (value + 1) % 8), 420);
    return () => window.clearInterval(id);
  }, []);

  const share = async () => {
    const url = "https://onebytehq.com";
    const text = "OneByte lets businesses cover mobile data for their people. I just joined the waitlist.";
    try {
      if (navigator.share) {
        await navigator.share({ title: "OneByte", text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      /* closed the share sheet */
    }
  };

  const headline = result.existing
    ? "You're already on the list"
    : result.position
      ? `You're #${result.position.toLocaleString("en-NG")} on the list`
      : "You're on the list";

  return (
    <div
      className={cx(
        "flex animate-waitlist-in items-center gap-4 rounded-[26px] bg-ink py-3.5 pr-3.5 pl-5 text-left text-white shadow-[0_18px_40px_-18px_rgb(11_12_11/0.6)]",
        "max-[520px]:flex-col max-[520px]:items-stretch max-[520px]:gap-3.5 max-[520px]:p-4",
        className,
      )}
      role="status"
    >
      <span className="grid shrink-0 grid-cols-4 gap-[3px] max-[520px]:hidden" aria-hidden="true">
        {Array.from({ length: 8 }, (_, k) => (
          <i
            key={k}
            className={cx(
              "size-2 rounded-[2px] transition-colors duration-300 ease-in-out",
              k === tick ? "bg-green" : k === 7 ? "bg-green/40" : "bg-white/22",
            )}
          />
        ))}
      </span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <strong className="text-[16.5px] leading-tight font-semibold tracking-[-0.02em]">{headline}</strong>
        <span className="truncate text-[13.5px] text-white/60">We'll write to {email}</span>
      </span>
      <button
        type="button"
        onClick={share}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-green px-4 text-[14px] font-semibold text-ink transition-colors duration-200 ease-in-out hover:bg-[#3be586]"
      >
        {shared ? "Link copied" : "Tell a friend"}
        {!shared && <Icon name="arrowUpRight" size={15} />}
      </button>
    </div>
  );
}
