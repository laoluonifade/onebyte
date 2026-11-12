import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useInterval, usePrefersReducedMotion } from "../lib/hooks";
import { Console } from "./Console";
import { Icon } from "./primitives";
import { WaitlistForm } from "./Waitlist";
import "./Hero.css";

/** Width the dashboard is laid out at when shown as a screenshot on phones. Keep in sync with Hero.css. */
const SHOT_WIDTH = 760;

/* Who the business is keeping online. The headline cycles through them. */
const audiences = ["team", "customers", "agents", "riders"];

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
    <span className="rotator" aria-hidden="true">
      <span className="rotator__sizer" ref={sizer}>
        {audiences.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </span>
      <span className="rotator__window" style={{ width }}>
        {previous !== null && (
          <span className="rotator__word rotator__word--out" key={`out-${index}`}>
            {audiences[previous]}
          </span>
        )}
        <span className="rotator__word rotator__word--in" key={`in-${index}`}>
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
    <section className="hero" id="top">
      <div className="shell">
        {/* Fills the first screen on its own; the dashboard starts just below the fold. */}
        <div className="hero__head">
        <h1 className="hero__title" aria-label="Keep your people online.">
          <span className="hero__line" style={{ "--i": 0 } as CSSProperties} aria-hidden="true">
            Keep your
          </span>
          <span className="hero__line" style={{ "--i": 1 } as CSSProperties}>
            <RotatingWord />
          </span>
          <span className="hero__line" style={{ "--i": 2 } as CSSProperties} aria-hidden="true">
            online.
          </span>
        </h1>

        <p className="hero__lede">
          OneByte covers mobile data for the people your business depends on, from one shared pool. Nobody runs out{" "}
          <span className="hero__nowrap">mid-call</span>, and you only pay for what actually gets used.
        </p>

        <div className="hero__action">
          <WaitlistForm id="hero-email" />
        </div>
        </div>

        <div className="hero__stage">
          <div className="stage" ref={stage}>
            <div className="stage__shot">
              <Console />
            </div>

            {/* The other side of the dashboard: what it feels like for the person holding the phone. */}
            <div className="moment" aria-hidden="true">
              <div className="moment__top">
                <span className="moment__icon">
                  <Icon name="signal" size={14} />
                </span>
                <span>Glo</span>
                <em>now</em>
              </div>
              <strong>You're online, Adaeze.</strong>
              <p>This month's internet is on Meridian Labs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
