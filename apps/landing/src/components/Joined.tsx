import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { JoinResult } from "../lib/waitlist";
import { btn, cx } from "../lib/ui";

/* ------------------------------------------------------------------
   Joined — the full-screen moment after someone joins the waitlist.

   Brand green floods out from the button they pressed. The mark builds
   itself cell by cell, with the last bit lit white (they're the one bit
   that just came on). Bits drift up in the background. Closes with
   Escape, the button, or a click anywhere, and drains back the way it came.
   ------------------------------------------------------------------ */

/* Background bits: fixed positions so the layout is the same every time. [left %, size px, seconds, delay s] */
const drift: [number, number, number, number][] = [
  [4, 10, 9, 0], [11, 18, 12, 2.5], [19, 8, 8, 1.2], [27, 14, 11, 4], [34, 6, 7, 0.6],
  [42, 22, 13, 3.1], [51, 9, 9, 5.2], [58, 16, 12, 1.8], [66, 7, 8, 3.8], [73, 20, 14, 0.3],
  [81, 11, 10, 2.2], [88, 15, 11, 4.6], [95, 8, 9, 1.4], [15, 12, 10, 6], [62, 10, 9, 6.5],
];

type Props = { email: string; result: JoinResult; origin: { x: number; y: number }; onClose: () => void };

export function Joined({ email, result, origin, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const done = useRef<HTMLButtonElement>(null);
  const close = () => setClosing(true);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setClosing(true);
    window.addEventListener("keydown", onKey);
    const focus = window.setTimeout(() => done.current?.focus({ preventScroll: true }), 900);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focus);
    };
  }, []);

  return createPortal(
    <div
      className={cx(
        "fixed inset-0 z-90 grid cursor-pointer place-items-center overflow-hidden bg-green px-6 text-center text-ink",
        closing ? "animate-curtain-out" : "animate-curtain-in",
      )}
      style={{ "--x": `${origin.x}px`, "--y": `${origin.y}px` } as CSSProperties}
      role="dialog"
      aria-modal="true"
      aria-labelledby="joined-title"
      onClick={close}
      onAnimationEnd={(event) => closing && event.target === event.currentTarget && onClose()}
    >
      {/* Drifting bits */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {drift.map(([left, size, seconds, delay], i) => (
          <i
            key={i}
            className={cx("absolute bottom-0 animate-drift rounded-[22%]", i % 4 === 0 ? "bg-white/45" : "bg-ink/10")}
            style={{ left: `${left}%`, width: size, height: size, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      <div className="relative grid justify-items-center">
        {/* The mark builds itself; the last bit comes on in white. */}
        <div className="grid grid-cols-4 gap-[clamp(10px,1.6vw,16px)]" aria-hidden="true">
          {Array.from({ length: 8 }, (_, k) => (
            <i
              key={k}
              className={cx(
                "size-[clamp(26px,4vw,40px)] rounded-[22%]",
                k === 7 ? "animate-bit-on bg-white" : "animate-bit-drop bg-ink",
              )}
              style={{ animationDelay: k === 7 ? "0.95s" : `${0.35 + k * 0.06}s` }}
            />
          ))}
        </div>

        <h2
          id="joined-title"
          className="mt-[clamp(32px,5vh,56px)] animate-line-in font-display text-[clamp(48px,10vw,148px)] leading-[0.9] font-bold tracking-[-0.03em] text-balance [animation-delay:1.1s]"
        >
          {result.existing ? "You're already in." : "You're on the list."}
        </h2>
        {result.position && (
          <p className="mt-5 animate-line-in rounded-full bg-ink px-5 py-2 text-[clamp(15px,1.6vw,19px)] font-semibold tracking-[-0.01em] text-green tabular-nums [animation-delay:1.2s]">
            #{result.position.toLocaleString("en-NG")} on the waitlist
          </p>
        )}
        <p className="mt-6 max-w-[34em] animate-line-in text-[clamp(17px,1.8vw,22px)] leading-[1.45] tracking-[-0.014em] text-pretty text-ink/75 [animation-delay:1.25s]">
          We'll write to <strong className="font-semibold break-all text-ink">{email}</strong> the moment your spot
          opens. Until then, nobody's data runs out on our watch.
        </p>
        <button
          ref={done}
          type="button"
          className={cx(btn("ink"), "mt-10 animate-line-in [animation-delay:1.4s]")}
          onClick={(event) => {
            event.stopPropagation();
            close();
          }}
        >
          Back to the page
        </button>
      </div>
    </div>,
    document.body,
  );
}
