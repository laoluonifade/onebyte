import { useState, type CSSProperties } from "react";
import { useInView } from "../lib/hooks";
import { Reveal } from "./primitives";
import "./Problem.css";

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

export function Problem() {
  const [mode, setMode] = useState<Mode>("fixed");
  const [plotRef, plotInView] = useInView<HTMLDivElement>({ margin: "0px 0px -20% 0px" });
  const [threadRef, threadInView] = useInView<HTMLDivElement>({ margin: "0px 0px -25% 0px" });
  const pool = mode === "pool";

  return (
    <section className="section problem">
      <div className="shell">
        <Reveal className="section-head">
          <h2 className="h2 problem__quote">“Sorry, my data finished.”</h2>
          <p className="lede">
            Every team in Nigeria knows the line. Bundles run out at the worst moment, or expire with half still
            unused. Either way, the business has already paid.
          </p>
        </Reveal>

        <div className="problem__grid">
          <Reveal className="story">
            <header>
              <strong>Monday standup</strong>
              <span>3 of 5 joined</span>
            </header>
            <p className="story__clock num">
              9:58 <small>am</small>
            </p>
            <div className="story__thread" ref={threadRef} data-in={threadInView || undefined}>
              {thread.map((message, i) => (
                <div className="bubble" key={message.name} style={{ "--i": i } as CSSProperties}>
                  <i>{message.initials}</i>
                  <div>
                    <span>
                      {message.name} <em className="num">{message.time}</em>
                    </span>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
              <p className="story__left" style={{ "--i": thread.length } as CSSProperties}>
                Tunde left the call
              </p>
            </div>
          </Reveal>

          <Reveal className="waste" delay={120} data-mode={mode}>
            <div className="waste__head">
              <div>
                <h3>Meanwhile, on the invoice</h3>
                <p>8 people, one month, 10 GB each</p>
              </div>
              <div className="seg" role="tablist" aria-label="Compare billing models">
                <button type="button" role="tab" aria-selected={!pool} onClick={() => setMode("fixed")}>
                  Fixed bundles
                </button>
                <button type="button" role="tab" aria-selected={pool} onClick={() => setMode("pool")}>
                  OneByte pool
                </button>
              </div>
            </div>

            <div className="waste__plot" ref={plotRef} data-mode={mode} data-in={plotInView || undefined}>
              <div className="waste__axis" aria-hidden="true">
                <span className="num">10 GB</span>
                <span className="num">5</span>
                <span className="num">0</span>
              </div>
              {usage.map((value, i) => (
                <div className="waste__col" key={i} style={{ "--i": i } as CSSProperties}>
                  <div className="waste__bar">
                    <i className="waste__unused" style={{ height: `${((BUNDLE - value) / BUNDLE) * 100}%` }} />
                    <i className="waste__used" style={{ height: `${(value / BUNDLE) * 100}%` }} />
                  </div>
                  <span className="num">{value.toFixed(1)}</span>
                </div>
              ))}
            </div>

            <ul className="waste__legend">
              <li>
                <i className="waste__key waste__key--used" />
                Data used
              </li>
              <li data-off={pool || undefined}>
                <i className="waste__key waste__key--unused" />
                Paid for, then expired
              </li>
            </ul>

            <dl className="waste__totals">
              <div>
                <dt>You pay for</dt>
                <dd className="num">
                  {pool ? usedTotal.toFixed(0) : paidFixed} <small>GB</small>
                </dd>
              </div>
              <div>
                <dt>People use</dt>
                <dd className="num">
                  {usedTotal.toFixed(0)} <small>GB</small>
                </dd>
              </div>
              <div data-good={pool || undefined}>
                <dt>Wasted</dt>
                <dd className="num">
                  {pool ? 0 : expired.toFixed(0)} <small>GB</small>
                </dd>
              </div>
            </dl>
            <p className="waste__note">Illustrative example. Actual usage varies by team.</p>
          </Reveal>
        </div>

        <ul className="problem__truths">
          {truths.map((truth, i) => (
            <Reveal as="li" key={truth.title} delay={i * 70}>
              <h3>{truth.title}</h3>
              <p>{truth.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
