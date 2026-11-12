import { useState, type CSSProperties } from "react";
import { int, naira } from "../lib/format";
import { btn, btnArrow, cx, h2, lede, section, sectionHead, shell, tag } from "../lib/ui";
import { Icon, Reveal } from "./primitives";

const tiers = [
  { id: "small", name: "Small businesses", note: "For small teams getting started", rate: 450 },
  { id: "growing", name: "Growing businesses", note: "For scaling teams with rising usage", rate: 425 },
  { id: "enterprise", name: "Enterprise", note: "For large employers and high volumes", rate: 400 },
  { id: "partner", name: "Strategic partners", note: "White-label and platform partnerships", rate: null },
] as const;

type TierId = (typeof tiers)[number]["id"];

const unit = "text-[13.5px] font-[450] tracking-[-0.006em] text-ink-3";

/* Range input. Track and thumb are vendor pseudo-elements, so each needs its own WebKit and Firefox
   variant. `--p` (set inline) is the filled share of the track: a hard two-tone stop, not a fade. */
const range = cx(
  "h-6 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none",
  // track
  "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-xs",
  "[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-ink)_var(--p),rgb(11_12_11/0.12)_var(--p))]",
  "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-xs",
  "[&::-moz-range-track]:bg-[linear-gradient(to_right,var(--color-ink)_var(--p),rgb(11_12_11/0.12)_var(--p))]",
  // thumb
  "[&::-webkit-slider-thumb]:-mt-[9px] [&::-webkit-slider-thumb]:size-[22px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
  "[&::-webkit-slider-thumb]:[box-shadow:0_0_0_1px_rgb(11_12_11/0.14),0_2px_6px_rgb(11_12_11/0.2)]",
  "[&::-webkit-slider-thumb]:[transition:transform_0.15s_cubic-bezier(0.4,0,0.2,1),box-shadow_0.15s_cubic-bezier(0.4,0,0.2,1)]",
  "[&::-moz-range-thumb]:size-[22px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
  "[&::-moz-range-thumb]:[box-shadow:0_0_0_1px_rgb(11_12_11/0.14),0_2px_6px_rgb(11_12_11/0.2)]",
  // thumb states
  "hover:[&::-webkit-slider-thumb]:[transform:scale(1.1)] active:[&::-webkit-slider-thumb]:[transform:scale(1.1)]",
  "hover:[&::-webkit-slider-thumb]:[box-shadow:0_0_0_1px_rgb(11_12_11/0.2),0_3px_10px_rgb(11_12_11/0.26)]",
  "focus-visible:[&::-webkit-slider-thumb]:[box-shadow:0_0_0_2px_var(--color-white),0_0_0_4px_var(--color-ink)]",
);

function Slider(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  const { id, label, value, min, max, step, suffix, onChange } = props;
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[14.5px] tracking-[-0.006em] text-ink-3">
          {label}
        </label>
        <output htmlFor={id} className="text-[19px] font-[560] tracking-[-0.03em] whitespace-nowrap tabular-nums">
          {int(value)} <small className={unit}>{suffix}</small>
        </output>
      </div>
      <input
        id={id}
        type="range"
        className={range}
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--p": `${progress}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function Pricing() {
  const [tierId, setTierId] = useState<TierId>("growing");
  const [people, setPeople] = useState(50);
  const [perPerson, setPerPerson] = useState(8);

  const tier = tiers.find((item) => item.id === tierId)!;
  const totalGb = people * perPerson;

  const rows = [
    ["Data consumed", `${int(totalGb)} GB${tier.rate ? ` × ₦${tier.rate}` : ""}`],
    ["Setup fee", "₦0"],
    ["Data nobody used", "Not billed"],
  ];

  return (
    <section className={cx(section, "bg-paper-2")} id="pricing">
      <div className={cx(shell, "grid grid-cols-[minmax(0,6fr)_minmax(0,5fr)] items-start gap-[clamp(40px,6vw,96px)] max-[900px]:grid-cols-1")}>
        <div>
          <Reveal className={sectionHead}>
            <h2 className={h2}>
              Free setup. <em>Pay for what you use.</em>
            </h2>
            <p className={cx(lede, "max-w-[600px]")}>
              One price per gigabyte, deducted from your wallet as data is consumed. Nothing is billed for data nobody
              used.
            </p>
          </Reveal>

          <Reveal
            className="mt-[clamp(36px,4.5vw,56px)] grid border-t border-line-2"
            role="radiogroup"
            aria-label="Customer segment"
            delay={80}
          >
            {tiers.map((item) => {
              const checked = item.id === tierId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  className="group grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-4 border-b border-line-2 py-5 text-left max-[420px]:gap-3"
                  onClick={() => setTierId(item.id)}
                >
                  {/* Radio: fills with ink and lights the green bit when chosen. */}
                  <span
                    className={cx(
                      "relative size-5 rounded-full transition-shadow duration-200 ease-in-out",
                      "after:absolute after:inset-1.5 after:rounded-xs after:bg-green after:transition-transform after:duration-300 after:ease-out after:content-['']",
                      checked
                        ? "shadow-[inset_0_0_0_10px_var(--color-ink)]"
                        : "shadow-[inset_0_0_0_1.5px_var(--color-ink-4)] group-hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)] after:scale-0",
                    )}
                  />
                  <span className="grid gap-0.5">
                    <strong className="text-[19px] leading-[1.3] font-[540] tracking-[-0.028em]">{item.name}</strong>
                    <span className="text-[15px] tracking-[-0.006em] text-ink-3 max-[420px]:text-[14px]">{item.note}</span>
                  </span>
                  <span
                    className={cx(
                      "text-[clamp(24px,2.5vw,30px)] leading-none font-[560] tracking-[-0.04em] whitespace-nowrap tabular-nums transition-colors duration-200 ease-in-out",
                      checked ? "text-ink" : "text-ink-4 group-hover:text-ink",
                    )}
                  >
                    {item.rate ? (
                      <>
                        ₦{item.rate}
                        <small className={cx(unit, "ml-[5px]")}>/ GB</small>
                      </>
                    ) : (
                      "Custom"
                    )}
                  </span>
                </button>
              );
            })}
          </Reveal>
        </div>

        <Reveal
          className="sticky top-24 grid gap-[26px] rounded-4xl bg-white p-[clamp(24px,3vw,36px)] shadow-[0_0_0_1px_var(--color-line),var(--shadow-lg)] max-[900px]:static max-[900px]:rounded-[22px]"
          delay={140}
        >
          <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <h3 className="text-[18px] font-[560] tracking-[-0.028em]">Estimate your monthly cost</h3>
            <span className={tag}>{tier.name}</span>
          </header>

          <Slider
            id="est-people"
            label="People on your pool"
            value={people}
            min={5}
            max={1000}
            step={5}
            suffix="people"
            onChange={setPeople}
          />
          <Slider
            id="est-gb"
            label="Average data per person, per month"
            value={perPerson}
            min={1}
            max={40}
            step={1}
            suffix="GB"
            onChange={setPerPerson}
          />

          <div className="grid gap-1 border-t border-line-2 pt-6" aria-live="polite">
            <span className="text-[14.5px] text-ink-3">Estimated monthly spend</span>
            <strong className="text-[clamp(44px,5vw,64px)] leading-[1.02] font-[560] tracking-[-0.052em] tabular-nums">
              {tier.rate ? naira(totalGb * tier.rate) : "Let's talk"}
            </strong>
          </div>

          <ul className="-mt-2 grid text-[14.5px]">
            {rows.map(([label, value]) => (
              <li key={label} className="flex justify-between gap-3 border-t border-line py-2.5 text-ink-3">
                <span>{label}</span>
                <em className="font-medium text-ink not-italic tabular-nums">{value}</em>
              </li>
            ))}
          </ul>

          <a href="#waitlist" className={cx(btn("ink"), "w-full")}>
            Join the waitlist
            <Icon name="arrow" className={btnArrow} />
          </a>
          <p className="-mt-2.5 text-[12.5px] leading-normal text-pretty text-ink-3">
            Pricing is indicative and may change with operator costs. Your estimate assumes every gigabyte is consumed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
