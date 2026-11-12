import { useState } from "react";
import { useInView } from "../lib/hooks";
import { cx, h2Base, lede, sectionHead, seg, segButton, shell } from "../lib/ui";
import { Reveal } from "./primitives";

/* A Monday morning most Nigerian teams will recognise. */
const thread = [
  {
    initials: "TB",
    name: "Tunde",
    time: "9:58",
    text: "My data just finished. Give me ten minutes, I need to buy a bundle.",
  },
  {
    initials: "IN",
    name: "Ifeoma",
    time: "9:59",
    text: "Mine expired on Friday. I hadn't even used half of it.",
  },
  {
    initials: "ZY",
    name: "Zainab",
    time: "10:02",
    text: "Okay. Starting without you both.",
  },
];

const truths = [
  {
    title: "Allowances ignore real life",
    body: "Everyone gets the same fixed bundle, whether they use a tenth of it or run dry in a week.",
  },
  {
    title: "Unused data just disappears",
    body: "Whatever isn't used before the validity date is gone. The business paid for all of it anyway.",
  },
  {
    title: "Nobody can see anything",
    body: "Once a bundle is sent, there's no view of who is using what, or where the budget went.",
  },
  {
    title: "Every network is another chore",
    body: "Different portals, bundles and top-ups for each operator, repeated every single month.",
  },
];

/* Illustrative month: eight people, each on a 10 GB bundle. */
const BUNDLE = 10;
const usage = [9.2, 3.1, 6.4, 1.8, 10, 4.6, 7.5, 4.4];
const usedTotal = usage.reduce((sum, value) => sum + value, 0);
const paidFixed = usage.length * BUNDLE;
const expired = paidFixed - usedTotal;

type Mode = "fixed" | "pool";

const card = "rounded-4xl p-[clamp(20px,2.6vw,32px)] max-[900px]:rounded-[22px]";

/** Messages arrive one after another, like the real thing. `i` staggers them. */
const arrive = (shown: boolean) =>
  cx(
    "origin-bottom-left [transition:opacity_0.5s_cubic-bezier(0.4,0,0.2,1),transform_0.7s_var(--ease-out)] motion-reduce:[transition:none]",
    !shown && "opacity-0 [transform:translateY(14px)_scale(0.97)] motion-reduce:opacity-100 motion-reduce:[transform:none]",
  );
const arriveDelay = (i: number) => ({ transitionDelay: `${0.15 + i * 0.55}s` });

const barSegment =
  "shrink-0 origin-bottom [transition:transform_0.8s_var(--ease-out),opacity_0.5s_cubic-bezier(0.4,0,0.2,1),background-color_0.4s_cubic-bezier(0.4,0,0.2,1)]";

export function Problem() {
  const [mode, setMode] = useState<Mode>("fixed");
  const [plotRef, plotInView] = useInView<HTMLDivElement>({ margin: "0px 0px -20% 0px" });
  const [threadRef, threadInView] = useInView<HTMLDivElement>({ margin: "0px 0px -25% 0px" });
  const pool = mode === "pool";

  const totals = [
    { label: "You pay for", value: pool ? usedTotal.toFixed(0) : String(paidFixed) },
    { label: "People use", value: usedTotal.toFixed(0) },
    { label: "Wasted", value: pool ? "0" : expired.toFixed(0), good: pool },
  ];

  return (
    <section className="pt-[clamp(64px,8vw,120px)] pb-[clamp(88px,11vw,160px)]">
      <div className={shell}>
        <Reveal className={sectionHead}>
          <h2 className={cx(h2Base, "text-[clamp(44px,7.4vw,104px)] tracking-[-0.026em]")}>“Sorry, my data finished.”</h2>
          <p className={cx(lede, "max-w-[600px]")}>
            Every team in Nigeria knows the line. Bundles run out at the worst moment, or expire with half still
            unused. Either way, the business has already paid.
          </p>
        </Reveal>

        <div className="mt-[clamp(40px,5.5vw,80px)] grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-stretch gap-[clamp(16px,2vw,24px)] max-[900px]:grid-cols-1 max-[520px]:gap-3">
          {/* ---------------- Story: the standup ---------------- */}
          <Reveal className={cx(card, "flex flex-col bg-ink text-white")}>
            <header className="flex items-baseline justify-between gap-3 text-[14px] tracking-[-0.008em] text-on-night-2">
              <strong className="text-[18px] font-semibold tracking-[-0.028em] text-white">Monday standup</strong>
              <span>3 of 5 joined</span>
            </header>
            <p className="mt-5 font-display text-[clamp(72px,9vw,128px)] leading-[0.9] font-bold tracking-[-0.03em] tabular-nums">
              9:58 <small className="text-[0.34em] tracking-[-0.01em]">am</small>
            </p>
            <div className="mt-9 flex flex-1 flex-col justify-end gap-3 max-[520px]:mt-7" ref={threadRef}>
              {thread.map((message, i) => (
                <div
                  className={cx(
                    "grid max-w-[440px] grid-cols-[36px_minmax(0,1fr)] items-end gap-2.5",
                    i === 1 && "ml-[clamp(0px,3vw,40px)]",
                    arrive(threadInView),
                  )}
                  style={arriveDelay(i)}
                  key={message.name}
                >
                  <i className="grid size-9 place-items-center rounded-full bg-green text-[12px] font-semibold text-ink not-italic">
                    {message.initials}
                  </i>
                  <div className="rounded-[20px_20px_20px_6px] bg-white px-4 pt-3 pb-3.5 text-ink">
                    <span className="flex items-baseline gap-2 text-[13.5px] font-semibold tracking-[-0.01em]">
                      {message.name} <em className="font-normal text-ink-4 not-italic tabular-nums">{message.time}</em>
                    </span>
                    <p className="mt-0.5 text-[clamp(16px,1.45vw,19px)] leading-[1.35] tracking-[-0.018em]">{message.text}</p>
                  </div>
                </div>
              ))}
              <p
                className={cx(
                  "mt-2 self-center rounded-full bg-white/12 px-3.5 py-1.5 text-[13.5px] font-medium tracking-[-0.008em] text-on-night-2",
                  arrive(threadInView),
                )}
                style={arriveDelay(thread.length)}
              >
                Tunde left the call
              </p>
            </div>
          </Reveal>

          {/* ---------------- The same month, on the invoice ---------------- */}
          <Reveal className={cx(card, "bg-paper-2")} delay={120}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-[18px] font-[560] tracking-[-0.028em]">Meanwhile, on the invoice</h3>
                <p className="mt-0.5 text-[14px] text-ink-3">8 people, one month, 10 GB each</p>
              </div>
              <div className={seg} role="tablist" aria-label="Compare billing models">
                <button
                  type="button"
                  role="tab"
                  className={cx(segButton, "max-[520px]:px-3")}
                  aria-selected={!pool}
                  onClick={() => setMode("fixed")}
                >
                  Fixed bundles
                </button>
                <button
                  type="button"
                  role="tab"
                  className={cx(segButton, "max-[520px]:px-3")}
                  aria-selected={pool}
                  onClick={() => setMode("pool")}
                >
                  OneByte pool
                </button>
              </div>
            </div>

            <div
              className="relative mt-9 grid h-[248px] grid-cols-8 gap-[clamp(6px,1.2vw,14px)] pb-[26px] pl-12 max-[520px]:h-[200px] max-[520px]:pl-10"
              ref={plotRef}
            >
              <div
                className="absolute inset-x-0 top-0 bottom-[26px] flex flex-col justify-between text-[11px] text-ink-4"
                aria-hidden="true"
              >
                {["10 GB", "5", "0"].map((tick) => (
                  <span
                    key={tick}
                    className={cx(
                      "relative h-0 leading-[0] tabular-nums after:absolute after:right-0 after:left-12 after:border-t after:content-[''] max-[520px]:after:left-10",
                      tick === "0" ? "after:border-line-2" : "after:border-line",
                    )}
                  >
                    {tick}
                  </span>
                ))}
              </div>
              {usage.map((value, i) => (
                <div className="relative z-1 flex justify-center" key={i}>
                  <div className="flex h-full w-[min(100%,40px)] flex-col justify-end gap-0.5">
                    {/* Paid for, then expired. Hatched: texture, not just colour. */}
                    <i
                      className={cx(
                        barSegment,
                        "rounded-t bg-[repeating-linear-gradient(135deg,rgb(11_12_11/0.26)_0_1.5px,rgb(11_12_11/0.05)_1.5px_6px)]",
                        !plotInView && "opacity-0",
                        pool && "opacity-0 [transform:scaleY(0.6)]",
                      )}
                      style={{ height: `${((BUNDLE - value) / BUNDLE) * 100}%`, transitionDelay: `${i * 40}ms` }}
                    />
                    {/* Data actually used. */}
                    <i
                      className={cx(
                        barSegment,
                        pool ? "rounded-t bg-green-deep" : "rounded-t-xs bg-ink",
                        !plotInView && "[transform:scaleY(0)]",
                      )}
                      style={{ height: `${(value / BUNDLE) * 100}%`, transitionDelay: `${i * 40}ms` }}
                    />
                  </div>
                  <span className="absolute top-[calc(100%+8px)] text-[11.5px] text-ink-3 tabular-nums max-[520px]:text-[10.5px]">
                    {value.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 pl-12 text-[13.5px] text-ink-2 max-[520px]:pl-0">
              <li className="inline-flex items-center gap-2">
                <i
                  className={cx(
                    "size-3 rounded-[3px] transition-colors duration-[400ms] ease-in-out",
                    pool ? "bg-green-deep" : "bg-ink",
                  )}
                />
                Data used
              </li>
              <li
                className={cx(
                  "inline-flex items-center gap-2 transition-opacity duration-300 ease-in-out",
                  pool && "line-through opacity-35",
                )}
              >
                <i className="size-3 rounded-[3px] bg-[repeating-linear-gradient(135deg,rgb(11_12_11/0.3)_0_1.5px,rgb(11_12_11/0.06)_1.5px_5px)]" />
                Paid for, then expired
              </li>
            </ul>

            <dl className="mt-6 grid grid-cols-3 border-t border-line-2">
              {totals.map((total, i) => (
                <div key={total.label} className={cx("pt-4.5", i > 0 && "border-l border-line pl-[clamp(12px,2vw,24px)]")}>
                  <dt className="text-[13.5px] text-ink-3">{total.label}</dt>
                  <dd
                    className={cx(
                      "mt-0.5 text-[clamp(30px,3.4vw,44px)] leading-[1.1] font-[560] tracking-[-0.045em] tabular-nums transition-colors duration-300 ease-in-out",
                      total.good && "text-green-deep",
                    )}
                  >
                    {total.value} <small className="text-[0.42em] font-medium tracking-[-0.01em] text-ink-3">GB</small>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4.5 text-[12.5px] text-ink-4">Illustrative example. Actual usage varies by team.</p>
          </Reveal>
        </div>

        {/* On phones the four points become one grouped card. */}
        <ul className="mt-[clamp(48px,6vw,88px)] grid grid-cols-4 gap-x-[clamp(20px,3vw,40px)] gap-y-8 max-[900px]:grid-cols-2 max-[520px]:mt-3 max-[520px]:grid-cols-1 max-[520px]:gap-0 max-[520px]:rounded-[22px] max-[520px]:bg-paper-2 max-[520px]:px-[22px] max-[520px]:py-1.5">
          {truths.map((truth, i) => (
            <Reveal
              as="li"
              key={truth.title}
              delay={i * 70}
              className="border-t-[1.5px] border-ink pt-5 max-[520px]:border-t max-[520px]:border-line-2 max-[520px]:py-5 max-[520px]:first:border-t-0"
            >
              <h3 className="text-[20px] leading-[1.25] font-semibold tracking-[-0.03em] max-[520px]:text-[18.5px]">
                {truth.title}
              </h3>
              <p className="mt-2 text-[16px] leading-normal tracking-[-0.008em] text-ink-3 max-[520px]:mt-1 max-[520px]:text-[15.5px]">
                {truth.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
