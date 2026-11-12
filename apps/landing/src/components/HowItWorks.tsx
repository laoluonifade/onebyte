import { useState, type ReactNode } from "react";
import { useInView, useInterval, usePrefersReducedMotion } from "../lib/hooks";
import { cx, eyebrow, h2, section, sectionHead, shell, tag, tagGreen } from "../lib/ui";
import { Icon, Network, Reveal } from "./primitives";
import { Avatar } from "./Avatar";

/** How long each step shows before advancing. The progress bar's `5.2s` below must match. */
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

/* ---------------- Scene building blocks ---------------- */

const hairlineRing = "inset-ring inset-ring-line-2";
const fieldLabel = "text-[12.5px] text-ink-3";
const tile = "grid gap-0.5 rounded-xl bg-paper-2";

function Scene({ title, badge, children }: { title: string; badge: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-3.5 rounded-[18px] bg-white p-5.5 text-[13.5px] leading-[1.35] tracking-[-0.006em] text-ink shadow-[0_30px_60px_-24px_rgb(0_0_0/0.55)] [&_em]:not-italic">
      <header className="mb-1 flex items-center justify-between">
        <h4 className="text-[17px] font-[560] tracking-[-0.03em]">{title}</h4>
        {badge}
      </header>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className={fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

function Choice({ options, selected, className }: { options: string[]; selected: string; className?: string }) {
  return (
    <div className={cx("grid auto-cols-[1fr] grid-flow-col gap-1.5", className)}>
      {options.map((option) => (
        <span
          key={option}
          className={cx(
            "grid h-9 place-items-center rounded-[10px] font-medium",
            option === selected ? "bg-ink text-white" : cx("text-ink-2", hairlineRing),
          )}
        >
          {option}
        </span>
      ))}
    </div>
  );
}

const SceneButton = ({ children }: { children: ReactNode }) => (
  <div className="mt-1 grid h-[42px] place-items-center rounded-full bg-green text-[14px] font-[560] tracking-[-0.012em]">
    {children}
  </div>
);

/* ---------------- Scenes ---------------- */

function SceneAccount() {
  return (
    <Scene title="Create your workspace" badge={<span className={tagGreen}>₦0 setup</span>}>
      <Field label="Business name">
        <div className={cx("flex h-10 items-center rounded-[10px] px-3 font-[480]", hairlineRing)}>Meridian Labs</div>
      </Field>
      <Field label="Work email">
        <div className={cx("flex h-10 items-center rounded-[10px] px-3 font-[480]", hairlineRing)}>
          adaeze@example.com
          <i className="ml-0.5 h-4 w-[1.5px] animate-caret bg-ink" />
        </div>
      </Field>
      <Field label="What will you use OneByte for?">
        <Choice options={["Employees", "Customers", "Both"]} selected="Employees" />
      </Field>
      <SceneButton>Create account</SceneButton>
    </Scene>
  );
}

function SceneWallet() {
  return (
    <Scene title="Fund wallet" badge={<span className={tag}>Meridian Labs</span>}>
      <div className={cx(tile, "px-4 py-3.5")}>
        <span className={fieldLabel}>Amount</span>
        <strong className="text-[34px] leading-[1.1] font-[560] tracking-[-0.045em] tabular-nums">₦500,000</strong>
      </div>
      <Choice options={["₦100,000", "₦500,000", "₦1,000,000"]} selected="₦500,000" className="text-[13px] tabular-nums" />
      <ul className="grid">
        {[
          ["Rate", "₦425 per GB"],
          ["Covers about", "1,176 GB"],
          ["Setup fee", "₦0"],
        ].map(([label, value]) => (
          <li key={label} className="flex justify-between border-t border-line py-[9px] text-ink-3">
            <span>{label}</span>
            <em className="font-[520] text-ink tabular-nums">{value}</em>
          </li>
        ))}
      </ul>
      <SceneButton>Add ₦500,000</SceneButton>
    </Scene>
  );
}

const limitRows = [
  { name: "Adaeze Okafor", number: "0803 ••• 4412", limit: 20 },
  { name: "Tunde Bakare", number: "0807 ••• 9038", limit: 10 },
  { name: "Ifeoma Nwosu", number: "0706 ••• 2271", limit: 15 },
];

function SceneLimits() {
  const stepperKnob = "grid size-[22px] place-items-center rounded-full bg-paper-2 font-medium text-ink-2";
  return (
    <Scene
      title="People &amp; limits"
      badge={
        <span className={tag}>
          <Icon name="upload" size={12} />
          Import CSV
        </span>
      }
    >
      <ul className="grid">
        {limitRows.map((row) => (
          <li key={row.name} className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-2.5 border-t border-line py-2.5">
            <Avatar name={row.name} className="size-[30px]" />
            <span className="grid min-w-0">
              <strong className="font-[520]">{row.name}</strong>
              <em className="font-mono text-[11.5px] text-ink-3 tabular-nums">{row.number}</em>
            </span>
            <span
              className={cx(
                "inline-flex h-[30px] items-center gap-2.5 rounded-full px-1 font-[540] whitespace-nowrap tabular-nums",
                hairlineRing,
              )}
            >
              <b className={stepperKnob}>−</b>
              {row.limit} GB
              <b className={stepperKnob}>+</b>
            </span>
          </li>
        ))}
      </ul>
      <div className="grid gap-2.5 rounded-xl bg-paper-2 px-3.5 pt-3 pb-3.5">
        <div className="flex items-baseline justify-between">
          <span className="text-ink-3">Company budget</span>
          <strong className="font-[560] tabular-nums">₦1,500,000 / month</strong>
        </div>
      </div>
      <SceneButton>Save and activate</SceneButton>
    </Scene>
  );
}

const activations = [
  { number: "0803 ••• 4412", name: "Adaeze", network: "MTN" as const },
  { number: "0807 ••• 9038", name: "Tunde", network: "Glo" as const },
  { number: "0706 ••• 2271", name: "Ifeoma", network: "MTN" as const },
  { number: "0815 ••• 6650", name: "Zainab", network: "Glo" as const },
];

function SceneLive() {
  return (
    <Scene
      title="Activation"
      badge={
        <span className="flex gap-1">
          <Network name="MTN" size="sm" />
          <Network name="Glo" size="sm" />
        </span>
      }
    >
      <ul className="grid">
        {activations.map((row, i) => (
          <li
            key={row.number}
            className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] items-center gap-2.5 border-t border-line py-[11px]"
          >
            <span className="font-mono text-[12.5px] tabular-nums">{row.number}</span>
            <span className="text-ink-3">
              <span className="mr-1.5">{row.name}</span>
              <Network name={row.network} />
            </span>
            {/* Chips pop in one by one each time this scene becomes the active one. */}
            <em
              className="inline-flex h-6 items-center gap-1 rounded-full bg-green-wash px-2.5 text-[12px] font-[540] text-green-ink group-data-[active]/scene:animate-activate"
              style={{ animationDelay: `${0.5 + i * 0.28}s` }}
            >
              Active
            </em>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-2">
        <div className={cx(tile, "px-3.5 py-3")}>
          <span className={fieldLabel}>Used today</span>
          <strong className="text-[24px] leading-[1.15] font-[560] tracking-[-0.04em] tabular-nums">
            12.4 <small className="text-[13px] font-medium tracking-[-0.01em] text-ink-3">GB</small>
          </strong>
        </div>
        <div className={cx(tile, "px-3.5 py-3")}>
          <span className={fieldLabel}>Billed to wallet</span>
          <strong className="text-[24px] leading-[1.15] font-[560] tracking-[-0.04em] tabular-nums">₦5,270</strong>
        </div>
      </div>
    </Scene>
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
    <section className={section} id="how">
      <div className={shell}>
        <Reveal className={sectionHead}>
          <span className={eyebrow}>How it works</span>
          <h2 className={h2}>
            Set it up once. <em>Then nobody thinks about data again.</em>
          </h2>
        </Reveal>

        <Reveal className="mt-[clamp(40px,5.5vw,80px)]" delay={100}>
          <div
            className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-stretch gap-[clamp(32px,5vw,80px)] max-[900px]:grid-cols-1"
            ref={ref}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <ol className="flex flex-col justify-center">
              {steps.map((step, i) => {
                const isActive = active === i;
                return (
                  <li key={step.title} className="relative border-t border-line-2 last:border-b">
                    <button
                      type="button"
                      className={cx(
                        "grid w-full grid-cols-[44px_minmax(0,1fr)] py-5.5 text-left transition-colors duration-300 ease-in-out hover:text-ink",
                        isActive ? "text-ink" : "text-ink-3",
                      )}
                      aria-current={isActive ? "step" : undefined}
                      onClick={() => setActive(i)}
                    >
                      <span
                        className={cx(
                          "pt-1.5 font-mono text-[12px] tabular-nums transition-colors duration-300 ease-in-out",
                          isActive ? "text-green-deep" : "text-ink-4",
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span>
                        <strong className="block text-[clamp(20px,2vw,24px)] leading-[1.25] font-[540] tracking-[-0.032em]">
                          {step.title}
                        </strong>
                        {/* Height animates with the grid-rows trick: no magic numbers. */}
                        <span
                          className={cx(
                            "grid [transition:grid-template-rows_0.5s_var(--ease-out),opacity_0.4s_cubic-bezier(0.4,0,0.2,1)]",
                            isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <span
                            className={cx(
                              "max-w-[400px] overflow-hidden text-[16px] leading-normal tracking-[-0.008em] text-ink-3",
                              isActive && "pt-2",
                            )}
                          >
                            {step.body}
                          </span>
                        </span>
                      </span>
                    </button>
                    {/* Progress along the top rule. Re-keyed so the animation restarts with each step. */}
                    <i
                      className={cx(
                        "absolute -top-px left-0 h-[1.5px] w-full origin-left bg-ink",
                        !isActive && "[transform:scaleX(0)]",
                        isActive && playing && "animate-how-progress",
                      )}
                      key={`${active}-${playing}`}
                    />
                  </li>
                );
              })}
            </ol>

            <div
              className="relative grid min-h-[560px] place-items-center overflow-hidden rounded-4xl bg-forest p-[clamp(20px,4vw,56px)] max-[900px]:min-h-[500px] max-[900px]:rounded-[22px]"
              aria-hidden="true"
            >
              {scenes.map((SceneComponent, i) => (
                <div
                  className={cx(
                    "group/scene pointer-events-none col-start-1 row-start-1 w-[min(100%,380px)] [transition:opacity_0.45s_cubic-bezier(0.4,0,0.2,1),transform_0.7s_var(--ease-out)]",
                    active === i ? "delay-[120ms]" : "opacity-0 [transform:translateY(16px)_scale(0.98)]",
                  )}
                  key={i}
                  data-active={active === i || undefined}
                >
                  <SceneComponent />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
