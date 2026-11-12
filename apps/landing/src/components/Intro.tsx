import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../lib/hooks";
import { cx } from "../lib/ui";

/* ------------------------------------------------------------------
   Intro — plays once per page load, over everything.

   1. The eight cells of the mark drop in, one after another.
   2. A green bit scans across them, the way a byte is read, and comes
      to rest on the last cell: one bit on. That is the logo.
   3. The mark flies into its place in the nav while the white curtain
      lifts and the page starts its own entrance.

   While it plays, <html> carries two attributes (set in index.html so
   they are there before first paint):
   - data-intro       pauses the page's own animations and hides the nav
   - data-intro-mark  hides the nav's mark until the flying one lands
   ------------------------------------------------------------------ */

const DROP_STAGGER = 55; // ms between cells dropping in
const SCAN_START = 820; // ms: green bit starts scanning
const SCAN_STEP = 60; // ms per cell
const FLY_START = SCAN_START + 8 * SCAN_STEP + 260;
const FLY_MS = 750; // matches duration-[750ms] on the mark below

export function Intro() {
  const reduced = usePrefersReducedMotion();
  const mark = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(-1);
  const [flight, setFlight] = useState<string>();
  const [phase, setPhase] = useState<"play" | "fly" | "done">("play");

  useEffect(() => {
    const html = document.documentElement;
    const finish = () => {
      html.removeAttribute("data-intro");
      html.removeAttribute("data-intro-mark");
      html.style.overflow = "";
    };

    if (reduced) {
      finish();
      setPhase("done");
      return;
    }

    html.setAttribute("data-intro", "");
    html.setAttribute("data-intro-mark", "");
    html.style.overflow = "hidden";

    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    for (let k = 0; k < 8; k++) at(SCAN_START + k * SCAN_STEP, () => setLit(k));

    at(FLY_START, () => {
      // Fly from the centre of the screen onto the nav's mark, matching its size exactly.
      const from = mark.current?.getBoundingClientRect();
      const to = document.querySelector("header [data-bytemark]")?.getBoundingClientRect();
      if (from && to && to.width > 0) {
        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);
        setFlight(`translate(${dx}px, ${dy}px) scale(${to.width / from.width})`);
      }
      setPhase("fly");
      html.removeAttribute("data-intro");
      html.style.overflow = "";
    });

    at(FLY_START + FLY_MS, () => {
      finish();
      setPhase("done");
    });

    return () => {
      timers.forEach(clearTimeout);
      finish();
    };
  }, [reduced]);

  if (phase === "done") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-100 grid place-items-center" aria-hidden="true">
      <div
        className={cx(
          "absolute inset-0 bg-white transition-opacity duration-500 ease-in-out",
          phase === "fly" && "opacity-0",
        )}
      />
      {/* Same proportions as the nav mark (gap = 0.4 × cell, radius = 0.22 × cell), so the landing is seamless. */}
      <div
        ref={mark}
        className="relative grid grid-cols-4 gap-[13px] text-ink duration-[750ms] ease-out [transition-property:transform] max-sm:gap-[10px]"
        style={{ transform: flight }}
      >
        {Array.from({ length: 8 }, (_, k) => (
          <i
            key={k}
            className={cx(
              "size-8 animate-bit-drop rounded-[7px] transition-colors duration-150 ease-in-out max-sm:size-6 max-sm:rounded-[5px]",
              k === lit ? "bg-green" : "bg-current",
            )}
            style={{ animationDelay: `${k * DROP_STAGGER}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
