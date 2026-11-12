import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInterval, usePrefersReducedMotion } from "../lib/hooks";
import { Console } from "./Console";
import { Icon } from "./primitives";
import { cx, shell } from "../lib/ui";
import { WaitlistForm } from "./Waitlist";

/** Width the dashboard is laid out at when shown as a screenshot on phones. Matches `max-[760px]:w-[760px]` below. */
const SHOT_WIDTH = 760;

/* Who the business is keeping online. The headline cycles through them. */
const audiences = ["team", "customers", "agents", "riders"];

/** One line of the headline. Lines rise into place one after the other. */
const line = "block animate-line-in";
const lineDelay = (i: number) => ({ animationDelay: `${0.05 + i * 0.11}s` });

function RotatingWord() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [width, setWidth] = useState<number>();
  const sizer = useRef<HTMLSpanElement>(null);

  useInterval(
    () => {
      setPrevious(index);
      setIndex((index + 1) % audiences.length);
    },
    2400,
    !reduced,
  );

  // The highlight is sized to the current word, so it can glide between widths.
  useLayoutEffect(() => {
    const measure = () => {
      const node = sizer.current?.children[index] as HTMLElement | undefined;
      if (node) setWidth(node.offsetWidth);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  return (
    // The rotating word sits on a flat green block, tilted like a sticker.
    <span
      className="relative my-[0.06em] inline-block animate-sticker-in rounded-[0.14em] bg-green px-[0.14em] pt-[0.02em] pb-[0.1em] [transform:rotate(-2deg)]"
      aria-hidden="true"
    >
      {/* Off-screen measuring copies. Zero-size and clipped so they can never widen the page. */}
      <span
        className="pointer-events-none invisible absolute top-0 left-0 size-0 overflow-hidden whitespace-nowrap [&>span]:inline-block"
        ref={sizer}
      >
        {audiences.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </span>
      <span
        className="relative block h-[1em] overflow-hidden whitespace-nowrap transition-[width] duration-[550ms] ease-out"
        style={{ width }}
      >
        {previous !== null && (
          <span
            className="absolute top-0 left-0 block animate-word-out leading-none"
            key={`out-${index}`}
          >
            {audiences[previous]}
          </span>
        )}
        <span className="block animate-word-in leading-none" key={`in-${index}`}>
          {audiences[index]}
        </span>
      </span>
    </span>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const stage = useRef<HTMLDivElement>(null);

  // The dashboard starts slightly small and settles to full size as it scrolls into view.
  useEffect(() => {
    const node = stage.current;
    if (!node || reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport * 0.6)));
      node.style.setProperty("--grow", String(0.9 + progress * 0.1));
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

  // On phones the dashboard keeps its desktop layout and is scaled to fit the panel exactly,
  // so the whole thing shows like a screenshot.
  useEffect(() => {
    const node = stage.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const fit = () => {
      const style = getComputedStyle(node);
      const inner = node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      node.style.setProperty("--shot-zoom", String(Math.min(1, inner / SHOT_WIDTH)));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    fit();
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pb-[clamp(48px,6vw,88px)] text-center" id="top">
      <div className={cx(shell, "grid grid-cols-1 justify-items-center")}>
        {/* One full screen: headline, lede and form, sized to the viewport so it reads at a glance.
            The dashboard only appears once you scroll. The nav is 68px, so the top padding keeps the
            headline well clear of it. */}
        <div className="flex min-h-svh w-full flex-col items-center justify-center pt-32 pb-11 max-[760px]:pt-[104px] max-[760px]:pb-9">
          <h1
            className="font-display text-[clamp(52px,min(16.4vw,15svh),190px)] leading-[0.94] font-bold tracking-[-0.028em] max-[760px]:leading-[0.96]"
            aria-label="Keep your people online."
          >
            <span className={line} style={lineDelay(0)} aria-hidden="true">
              Keep your
            </span>
            <span className={line} style={lineDelay(1)}>
              <RotatingWord />
            </span>
            <span className={line} style={lineDelay(2)} aria-hidden="true">
              online.
            </span>
          </h1>

          <p className="mt-[clamp(22px,3.4vh,40px)] max-w-[30em] animate-hero-lede text-[clamp(18px,min(1.9vw,3vh),28px)] leading-[1.4] tracking-[-0.018em] text-balance text-ink-2 max-[760px]:text-[19px]">
            OneByte covers mobile data for the people your business depends on. Nobody runs out{" "}
            <span className="whitespace-nowrap">mid-call</span>, and you only pay for what actually gets used.
          </p>

          <div className="mt-[clamp(24px,3.6vh,44px)] grid w-full animate-hero-form justify-items-center">
            <WaitlistForm id="hero-email" size="lg" />
          </div>
        </div>

        <div className="mt-[clamp(16px,3vw,40px)] w-full animate-hero-stage">
          {/* Stage: one flat field of colour. */}
          <div
            className="relative origin-top rounded-4xl bg-green p-[clamp(12px,4.4vw,56px)] text-left will-change-transform [transform:scale(var(--grow,1))] max-[760px]:rounded-[26px] max-[760px]:px-3.5 max-[760px]:pt-3.5 max-[760px]:pb-4 max-[760px]:[transform:none]"
            ref={stage}
          >
            {/* Phones: shown as a screenshot, not re-flowed. It keeps its desktop layout at SHOT_WIDTH
                and is scaled down to fit the panel, so the whole dashboard stays visible. */}
            <div className="max-[760px]:w-[760px] max-[760px]:[zoom:var(--shot-zoom,0.42)]">
              <Console />
            </div>

            {/* The other side of the dashboard: a notification, the way it lands on someone's phone. */}
            <div
              className="absolute top-[348px] left-4 z-3 w-[236px] animate-moment-in rounded-[18px] bg-white px-4 pt-3.5 pb-4 text-[13.5px] leading-[1.35] tracking-[-0.008em] text-ink-3 shadow-[0_0_0_1px_rgb(18_20_17/0.06),0_22px_48px_-18px_rgb(6_60_30/0.55)] max-[760px]:relative max-[760px]:inset-auto max-[760px]:mx-3.5 max-[760px]:mt-[-14px] max-[760px]:w-auto max-[760px]:px-3.5 max-[760px]:pt-3 max-[760px]:pb-3.5 min-[761px]:max-[980px]:hidden"
              aria-hidden="true"
            >
              <div className="mb-2.5 flex items-center gap-2 text-[12.5px] font-[520] text-ink-2">
                <span className="grid size-[22px] place-items-center rounded-md bg-ink text-green">
                  <Icon name="signal" size={14} />
                </span>
                <span>Glo</span>
                <em className="ml-auto font-normal text-ink-4 not-italic">now</em>
              </div>
              <strong className="block text-[17px] leading-[1.2] font-semibold tracking-[-0.03em] text-ink">
                You're online, Adaeze.
              </strong>
              <p className="mt-[3px]">This month's internet is on Meridian Labs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
