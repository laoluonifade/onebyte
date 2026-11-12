import { useState, type CSSProperties } from "react";
import { int, naira } from "../lib/format";
import { Icon, Reveal } from "./primitives";
import "./Pricing.css";

const tiers = [
  { id: "small", name: "Small businesses", note: "For small teams getting started", rate: 450 },
  { id: "growing", name: "Growing businesses", note: "For scaling teams with rising usage", rate: 425 },
  { id: "enterprise", name: "Enterprise", note: "For large employers and high volumes", rate: 400 },
  { id: "partner", name: "Strategic partners", note: "White-label and platform partnerships", rate: null },
] as const;

type TierId = (typeof tiers)[number]["id"];

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
    <div className="slider">
      <div className="slider__top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="num">
          {int(value)} <small>{suffix}</small>
        </output>
      </div>
      <input
        id={id}
        type="range"
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

  return (
    <section className="section pricing" id="pricing">
      <div className="shell pricing__grid">
        <div className="pricing__left">
          <Reveal className="section-head">
            <h2 className="h2">
              Free setup. <em>Pay for what you use.</em>
            </h2>
            <p className="lede">
              One price per gigabyte, deducted from your wallet as data is consumed. Nothing is billed for data nobody
              used.
            </p>
          </Reveal>

          <Reveal className="tiers" role="radiogroup" aria-label="Customer segment" delay={80}>
            {tiers.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={item.id === tierId}
                className="tier"
                onClick={() => setTierId(item.id)}
              >
                <span className="tier__radio" />
                <span className="tier__name">
                  <strong>{item.name}</strong>
                  <span>{item.note}</span>
                </span>
                <span className="tier__price num">
                  {item.rate ? (
                    <>
                      ₦{item.rate}
                      <small>/ GB</small>
                    </>
                  ) : (
                    "Custom"
                  )}
                </span>
              </button>
            ))}
          </Reveal>
        </div>

        <Reveal className="estimate" delay={140}>
          <header>
            <h3>Estimate your monthly cost</h3>
            <span className="tag">{tier.name}</span>
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

          <div className="estimate__result" aria-live="polite">
            <span>Estimated monthly spend</span>
            {tier.rate ? (
              <strong className="num">{naira(totalGb * tier.rate)}</strong>
            ) : (
              <strong>Let's talk</strong>
            )}
          </div>

          <ul className="estimate__rows">
            <li>
              <span>Data consumed</span>
              <em className="num">
                {int(totalGb)} GB{tier.rate ? ` × ₦${tier.rate}` : ""}
              </em>
            </li>
            <li>
              <span>Setup fee</span>
              <em className="num">₦0</em>
            </li>
            <li>
              <span>Data nobody used</span>
              <em>Not billed</em>
            </li>
          </ul>

          <a href="#waitlist" className="btn btn--ink">
            Join the waitlist
            <Icon name="arrow" className="arrow" />
          </a>
          <p className="estimate__note">
            Pricing is indicative and may change with operator costs. Your estimate assumes every gigabyte is consumed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
