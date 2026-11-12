import { useState, type CSSProperties } from "react";
import { useInView, useInterval, usePrefersReducedMotion } from "../lib/hooks";
import { Icon, Reveal } from "./primitives";
import "./HowItWorks.css";

const STEP_MS = 5200;

const steps = [
  {
    title: "Create your account",
    body: "Sign up and set up your workspace in minutes. It's free, with no setup fee.",
  },
  {
    title: "Fund your wallet",
    body: "Add money once. It only moves when data is actually used.",
  },
  {
    title: "Add people, set limits",
    body: "Register employees or customers by phone number, then set individual limits and a company-wide budget.",
  },
  {
    title: "They're online",
    body: "We activate their existing SIMs on the network. Usage draws from your shared pool and is billed per GB.",
  },
];

/* ---------------- Scenes ---------------- */

function SceneAccount() {
  return (
    <div className="scene scene--account">
      <header>
        <h4>Create your workspace</h4>
        <span className="tag tag--green">₦0 setup</span>
      </header>
      <label>
        <span>Business name</span>
        <div className="field">Meridian Labs</div>
      </label>
      <label>
        <span>Work email</span>
        <div className="field">
          adaeze@example.com
          <i className="caret" />
        </div>
      </label>
      <label>
        <span>What will you use OneByte for?</span>
        <div className="choice">
          <span data-on>Employees</span>
          <span>Customers</span>
          <span>Both</span>
        </div>
      </label>
      <div className="scene__btn">Create account</div>
    </div>
  );
}

function SceneWallet() {
  return (
    <div className="scene scene--wallet">
      <header>
        <h4>Fund wallet</h4>
        <span className="tag">Meridian Labs</span>
      </header>
      <div className="wallet__balance">
        <span>Amount</span>
        <strong className="num">₦500,000</strong>
      </div>
      <div className="choice choice--amounts num">
        <span>₦100,000</span>
        <span data-on>₦500,000</span>
        <span>₦1,000,000</span>
      </div>
      <ul className="scene__rows">
        <li>
          <span>Rate</span>
          <em className="num">₦425 per GB</em>
        </li>
        <li>
          <span>Covers about</span>
          <em className="num">1,176 GB</em>
        </li>
        <li>
          <span>Setup fee</span>
          <em className="num">₦0</em>
        </li>
      </ul>
      <div className="scene__btn">Add ₦500,000</div>
    </div>
  );
}

const limitRows = [
  { initials: "AO", name: "Adaeze Okafor", number: "0805 ••• 4412", limit: 20 },
  { initials: "TB", name: "Tunde Bakare", number: "0807 ••• 9038", limit: 10 },
  { initials: "IN", name: "Ifeoma Nwosu", number: "0705 ••• 2271", limit: 15 },
];

function SceneLimits() {
  return (
    <div className="scene scene--limits">
      <header>
        <h4>People &amp; limits</h4>
        <span className="tag">
          <Icon name="upload" size={12} />
          Import CSV
        </span>
      </header>
      <ul className="limit-list">
        {limitRows.map((row) => (
          <li key={row.name}>
            <i>{row.initials}</i>
            <span>
              <strong>{row.name}</strong>
              <em className="mono num">{row.number}</em>
            </span>
            <span className="stepper num">
              <b>−</b>
              {row.limit} GB
              <b>+</b>
            </span>
          </li>
        ))}
      </ul>
      <div className="budget-row">
        <div>
          <span>Company budget</span>
          <strong className="num">₦1,500,000 / month</strong>
        </div>
      </div>
      <div className="scene__btn">Save and activate</div>
    </div>
  );
}

const activations = [
  { number: "0805 ••• 4412", name: "Adaeze" },
  { number: "0807 ••• 9038", name: "Tunde" },
  { number: "0705 ••• 2271", name: "Ifeoma" },
  { number: "0815 ••• 6650", name: "Zainab" },
];

function SceneLive() {
  return (
    <div className="scene scene--live">
      <header>
        <h4>Activation</h4>
        <span className="tag tag--green">
          <i className="dot" />
          Glo
        </span>
      </header>
      <ul className="activation">
        {activations.map((row, i) => (
          <li key={row.number} style={{ "--i": i } as CSSProperties}>
            <span className="mono num">{row.number}</span>
            <span>{row.name}</span>
            <em>Active</em>
          </li>
        ))}
      </ul>
      <div className="live-total">
        <div>
          <span>Used today</span>
          <strong className="num">
            12.4 <small>GB</small>
          </strong>
        </div>
        <div>
          <span>Billed to wallet</span>
          <strong className="num">₦5,270</strong>
        </div>
      </div>
    </div>
  );
}

const scenes = [SceneAccount, SceneWallet, SceneLimits, SceneLive];

/* ---------------- Section ---------------- */

export function HowItWorks() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ once: false, margin: "0px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && !reduced;

  useInterval(() => setActive((value) => (value + 1) % steps.length), STEP_MS, playing);

  return (
    <section className="section how" id="how">
      <div className="shell">
        <Reveal className="section-head">
          <span className="eyebrow">How it works</span>
          <h2 className="h2">
            Set it up once. <em>Then nobody thinks about data again.</em>
          </h2>
        </Reveal>

        <Reveal className="how__body" delay={100}>
          <div
            className="how__grid"
            ref={ref}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <ol className="how__steps">
              {steps.map((step, i) => (
                <li key={step.title} data-active={active === i || undefined} data-done={i < active || undefined}>
                  <button type="button" aria-current={active === i ? "step" : undefined} onClick={() => setActive(i)}>
                    <span className="how__num mono num">0{i + 1}</span>
                    <span className="how__text">
                      <strong>{step.title}</strong>
                      <span className="how__desc">
                        <span>{step.body}</span>
                      </span>
                    </span>
                  </button>
                  <i
                    className="how__progress"
                    key={`${active}-${playing}`}
                    data-playing={(active === i && playing) || undefined}
                    style={{ "--ms": `${STEP_MS}ms` } as CSSProperties}
                  />
                </li>
              ))}
            </ol>

            <div className="how__stage" aria-hidden="true">
              {scenes.map((Scene, i) => (
                <div className="how__scene" key={i} data-active={active === i || undefined}>
                  <Scene />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
