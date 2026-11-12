import { useState, type FormEvent } from "react";
import { btn, btnArrow, cx } from "../lib/ui";
import { Icon } from "./primitives";

type Props = {
  id: string;
  /** `green` drops the hairline, for use on the green closing panel. */
  tone?: "paper" | "green";
  /** `lg` grows the field and button from tablet up. Used in the hero. */
  size?: "md" | "lg";
};

/**
 * Email capture for the waitlist.
 * No backend yet: this only confirms in the UI. Point `onSubmit` at the real endpoint before launch.
 */
export function WaitlistForm({ id, tone = "paper", size = "md" }: Props) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const lg = size === "lg";

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (email.trim()) setJoined(true);
  };

  const frame = cx(
    "bg-white",
    lg ? "w-[min(100%,480px)] min-[761px]:w-[min(100%,540px)]" : "w-[min(100%,480px)]",
    tone === "green" ? "shadow-[0_1px_2px_rgb(18_20_17/0.12)]" : "inset-ring inset-ring-line-2 shadow-sm",
  );

  if (joined) {
    return (
      <p
        className={cx(
          frame,
          "min-h-[60px] rounded-[30px] px-[26px] py-4.5 text-left text-[15.5px] leading-[1.4] tracking-[-0.008em] text-ink",
          "animate-waitlist-in",
        )}
        role="status"
      >
        <strong className="font-[620]">You're on the list.</strong> We'll write to {email} when your spot opens.
      </p>
    );
  }

  return (
    <form
      className={cx(
        frame,
        "flex gap-1.5 rounded-full p-1.5 max-[520px]:flex-col max-[520px]:rounded-[28px] max-[520px]:p-2",
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
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit" className={btn("ink", lg ? "hero" : "md")}>
        Join the waitlist
        <Icon name="arrow" className={btnArrow} />
      </button>
    </form>
  );
}
