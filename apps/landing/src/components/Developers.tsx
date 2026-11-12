import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../lib/hooks";
import { btn, btnArrow, cx, eyebrow, h2, lede, night, section, shell } from "../lib/ui";
import { Icon, Reveal } from "./primitives";

/* Tiny token helpers so the samples stay readable as JSX. */
const K = ({ children }: { children: ReactNode }) => <span className="text-[#8fb4ff]">{children}</span>;
const S = ({ children }: { children: ReactNode }) => <span className="text-[#5fe39a]">{children}</span>;
const N = ({ children }: { children: ReactNode }) => <span className="text-[#f3c26b]">{children}</span>;
const C = ({ children }: { children: ReactNode }) => <span className="text-[#6f7a73]">{children}</span>;
const P = ({ children }: { children: ReactNode }) => <span className="text-[#f3f5f3]">{children}</span>;

/* Samples are kept to 36 columns so every line fits on a phone without scrolling or wrapping. */
const samples: { id: string; label: string; file: string; lines: ReactNode[] }[] = [
  {
    id: "sponsor",
    label: "Sponsor a user",
    file: "sponsor.ts",
    lines: [
      <>
        <K>import</K> OneByte <K>from</K> <S>"@onebyte/node"</S>;
      </>,
      <></>,
      <>
        <K>const</K> onebyte = <K>new</K> <P>OneByte</P>(apiKey);
      </>,
      <></>,
      <C>// Give a customer 2 GB of internet</C>,
      <>
        <K>await</K> onebyte.sponsorships.<P>create</P>({"{"}
      </>,
      <>
        {"  "}msisdn: <S>"+2348050001234"</S>,
      </>,
      <>
        {"  "}network: <S>"mtn"</S>,
      </>,
      <>
        {"  "}limit: {"{"} amount: <N>2</N>, unit: <S>"GB"</S> {"}"},
      </>,
      <>
        {"  "}reference: <S>"signup-reward"</S>,
      </>,
      <>{"}"});</>,
    ],
  },
  {
    id: "limits",
    label: "Set a limit",
    file: "limits.ts",
    lines: [
      <C>// Cap one person...</C>,
      <>
        <K>await</K> onebyte.users.<P>update</P>(userId, {"{"}
      </>,
      <>
        {"  "}limit: {"{"} amount: <N>20</N>, unit: <S>"GB"</S> {"}"},
      </>,
      <>{"}"});</>,
      <></>,
      <C>// ...and the whole company</C>,
      <>
        <K>await</K> onebyte.budget.<P>set</P>({"{"}
      </>,
      <>
        {"  "}amount: <N>1_500_000</N>,
      </>,
      <>
        {"  "}currency: <S>"NGN"</S>,
      </>,
      <>
        {"  "}period: <S>"month"</S>,
      </>,
      <>{"}"});</>,
    ],
  },
  {
    id: "webhook",
    label: "Usage webhook",
    file: "usage.recorded.json",
    lines: [
      <>{"{"}</>,
      <>
        {"  "}
        <P>"event"</P>: <S>"usage.recorded"</S>,
      </>,
      <>
        {"  "}
        <P>"data"</P>: {"{"}
      </>,
      <>
        {"    "}
        <P>"user"</P>: <S>"usr_8fk2"</S>,
      </>,
      <>
        {"    "}
        <P>"network"</P>: <S>"mtn"</S>,
      </>,
      <>
        {"    "}
        <P>"consumed_gb"</P>: <N>0.2</N>,
      </>,
      <>
        {"    "}
        <P>"charged_ngn"</P>: <N>85.0</N>,
      </>,
      <>
        {"    "}
        <P>"wallet_balance_ngn"</P>: <N>1284415.0</N>
      </>,
      <>
        {"  "}
        {"}"}
      </>,
      <>{"}"}</>,
    ],
  },
];

const capabilities = [
  "Register users",
  "Sponsor access",
  "Spending limits",
  "Usage records",
  "Wallet balances",
  "Billing webhooks",
];

export function Developers() {
  const [active, setActive] = useState(0);
  const sample = samples[active];

  return (
    <section className={cx(section, night, "relative")} id="developers" data-nav-dark>
      <div className={cx(shell, "grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-center gap-[clamp(40px,6vw,96px)] max-[900px]:grid-cols-1")}>
        <Reveal className="grid justify-items-start gap-6 max-[640px]:gap-5">
          <span className={eyebrow}>For developers, coming soon</span>
          <h2 className={h2}>
            Internet, <em>as an API.</em>
          </h2>
          <p className={lede}>
            Soon you'll be able to register users, sponsor access and track consumption straight from your own product.
            The OneByte API is in development, and early access is open.
          </p>
          {/* A ruled two-column list on desktop; compact pills on phones. */}
          <ul className="mt-1 mb-3 grid w-full grid-cols-2 gap-x-8 text-[16px] tracking-[-0.01em] text-on-night max-[640px]:mt-0 max-[640px]:mb-2 max-[640px]:flex max-[640px]:flex-wrap max-[640px]:gap-2 max-[640px]:text-[14.5px]">
            {capabilities.map((item) => (
              <li
                key={item}
                className="border-t border-night-line-2 py-[13px] max-[640px]:rounded-full max-[640px]:border-0 max-[640px]:px-3.5 max-[640px]:py-2 max-[640px]:inset-ring max-[640px]:inset-ring-night-line-2"
              >
                {item}
              </li>
            ))}
          </ul>
          <a href="#waitlist" className={btn("green")}>
            Request early access
            <Icon name="arrow" className={btnArrow} />
          </a>
        </Reveal>

        {/* Code window. On phones all three tabs share the row and the code scales with the screen,
            so no line is ever cut off. */}
        <Reveal
          className="overflow-hidden rounded-[22px] bg-night-2 inset-ring inset-ring-night-line-2 max-[640px]:rounded-[18px]"
          delay={120}
        >
          <div
            className="flex gap-0.5 overflow-x-auto border-b border-night-line p-2 [scrollbar-width:none] max-[640px]:gap-1 max-[640px]:p-1.5 [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="API examples"
          >
            {samples.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`code-tab-${item.id}`}
                className="h-[34px] rounded-[10px] px-3.5 text-[14px] font-[480] tracking-[-0.008em] whitespace-nowrap text-on-night-2 transition-colors duration-200 ease-in-out hover:text-on-night aria-selected:bg-white/9 aria-selected:text-on-night max-[640px]:h-9 max-[640px]:min-w-0 max-[640px]:flex-1 max-[640px]:rounded-xl max-[640px]:px-1 max-[640px]:text-[clamp(11.5px,3.3vw,13.5px)] max-[640px]:tracking-[-0.012em]"
                aria-selected={i === active}
                aria-controls="code-panel"
                onClick={() => setActive(i)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 px-5 pt-3.5 text-[12px] text-on-night-3 max-[640px]:px-3.5 max-[640px]:pt-3">
            <span className="font-mono">{sample.file}</span>
            <span className="inline-flex h-[22px] items-center rounded-full px-2 text-[11.5px] whitespace-nowrap text-on-night-2 inset-ring inset-ring-night-line-2 max-[640px]:hidden">
              Preview · subject to change
            </span>
          </div>
          {/* min-height fits the tallest sample (11 lines), so switching tabs doesn't resize the window. */}
          <pre
            className="min-h-[calc(11*1.8em+36px)] overflow-x-auto pt-3.5 pr-5 pb-[22px] font-mono text-[13.5px] leading-[1.75] text-[#dfe5e0] [tab-size:2] max-[640px]:pt-2.5 max-[640px]:pr-3.5 max-[640px]:pb-4.5 max-[640px]:text-[clamp(10.5px,3.1vw,13.5px)] max-[640px]:leading-[1.8]"
            id="code-panel"
            role="tabpanel"
            aria-labelledby={`code-tab-${sample.id}`}
            key={sample.id}
          >
            <code>
              {sample.lines.map((line, i) => (
                <span
                  className="block animate-code-in whitespace-pre"
                  key={i}
                  style={{ animationDelay: `${i * 22}ms` }}
                >
                  <i className="inline-block w-12 pr-4.5 text-right text-[12px] text-white/22 not-italic tabular-nums select-none max-[640px]:w-[30px] max-[640px]:pr-2.5 max-[640px]:text-[0.85em]">
                    {i + 1}
                  </i>
                  <span>{line}</span>
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
        </Reveal>
      </div>

      <Vision />
    </section>
  );
}

/* ------------------------------------------------------------------
   Vision — the statement lights up word by word as it scrolls past.
   ------------------------------------------------------------------ */

const statement =
  "Payment platforms made it simple for any company to move money. OneByte does the same for the internet. Any business should be able to provide it to anyone, without becoming a telecom company.";
const words = statement.split(" ");

const roadmap = [
  {
    phase: "Now",
    title: "Launch on MTN and Glo",
    body: "Teams and Rewards with the dashboard, wallet, limits and usage reporting.",
  },
  {
    phase: "Next",
    title: "More networks, more automation",
    body: "Additional mobile networks, automated activation and the developer API.",
  },
  {
    phase: "Then",
    title: "Connectivity as a platform",
    body: "White-label internet services and multi-network connectivity management.",
  },
];

function Vision() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (reduced) {
      setLit(words.length);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 45%.
      const start = viewport * 0.85;
      const end = viewport * 0.45 - rect.height;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setLit(Math.round(progress * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div className={cx(shell, "mt-[clamp(112px,15vw,220px)]")}>
      <span className={eyebrow}>Where this is going</span>
      <p
        className="mt-6 max-w-[1120px] font-display text-[clamp(32px,5.2vw,72px)] leading-[1.02] font-[660] tracking-[-0.022em]"
        ref={ref}
        aria-label={statement}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className={cx("transition-colors duration-[350ms] ease-in-out", i < lit ? "text-on-night" : "text-white/20")}
            aria-hidden="true"
          >
            {word}{" "}
          </span>
        ))}
      </p>

      {/* Three columns with rules between them on desktop; a stacked, ruled list below 900px. */}
      <ol className="mt-[clamp(64px,9vw,128px)] grid grid-cols-3 border-t border-night-line-2 max-[900px]:grid-cols-1 max-[900px]:border-t-0">
        {roadmap.map((item, i) => (
          <Reveal
            as="li"
            key={item.phase}
            delay={i * 80}
            className={cx(
              "max-[900px]:border-t max-[900px]:border-night-line-2 max-[900px]:py-6 max-[900px]:last:pb-0 min-[901px]:pt-7 min-[901px]:pr-[clamp(20px,3vw,36px)]",
              i > 0 && "min-[901px]:border-l min-[901px]:border-night-line min-[901px]:pl-[clamp(20px,3vw,36px)]",
            )}
          >
            <span className={cx("text-[15px] font-[560] tracking-[-0.012em]", i === 0 ? "text-green" : "text-on-night-3")}>
              {item.phase}
            </span>
            <h3 className="mt-4.5 text-[21px] leading-[1.25] font-[540] tracking-[-0.03em]">{item.title}</h3>
            <p className="mt-2 max-w-[320px] text-[16px] leading-normal tracking-[-0.008em] text-on-night-2">{item.body}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
