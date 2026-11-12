import { useState, type CSSProperties, type ReactNode } from "react";
import { cx, h2, section, sectionHead, shell, tagGreen } from "../lib/ui";
import { ByteMeter, Icon, Reveal, type IconName } from "./primitives";
import { Avatar } from "./Avatar";

/* ------------------------------------------------------------------
   Product card. Each one is a flat field of colour with copy on top
   and a small illustration anchored to the bottom.
   ------------------------------------------------------------------ */

const cardTone = {
  paper: { card: "bg-paper-2", label: "text-ink-3", body: "text-ink-3" },
  green: { card: "bg-green", label: "text-ink/72", body: "text-ink/72" },
  night: { card: "night bg-night text-on-night", label: "text-green", body: "text-on-night-2" },
};

type CardProps = {
  tone: keyof typeof cardTone;
  wide?: boolean;
  delay?: number;
  label: string;
  title: string;
  body: string;
  foot?: string;
  children: ReactNode;
};

function Card({ tone, wide, delay, label, title, body, foot, children }: CardProps) {
  const t = cardTone[tone];
  return (
    <Reveal
      as="article"
      delay={delay}
      className={cx(
        "relative isolate flex min-h-[540px] flex-col overflow-hidden rounded-4xl max-[980px]:col-span-full max-[980px]:min-h-0 max-[640px]:rounded-[22px]",
        wide ? "col-span-7" : "col-span-5",
        t.card,
      )}
    >
      <div className="grid justify-items-start gap-3 px-[clamp(24px,3vw,40px)] pt-[clamp(24px,3vw,40px)]">
        <span className={cx("text-[15px] font-[560] tracking-[-0.012em]", t.label)}>{label}</span>
        <h3 className="max-w-[460px] font-display text-[clamp(30px,3.3vw,44px)] leading-none font-[680] tracking-[-0.02em] text-balance">
          {title}
        </h3>
        <p className={cx("max-w-[440px] text-[16.5px] leading-normal tracking-[-0.01em] text-pretty", t.body)}>{body}</p>
        {foot && (
          <span className="mt-1.5 inline-flex h-[26px] items-center rounded-full bg-ink px-2.5 text-[12.5px] font-medium text-white">
            {foot}
          </span>
        )}
      </div>
      {children}
    </Reveal>
  );
}

/** Illustration area: fills the rest of the card. */
const art = "relative mt-8 flex flex-1 text-[13px] leading-[1.35] tracking-[-0.006em] [&_em]:not-italic";

/* ---------------- Illustrations ---------------- */

const team = [
  { name: "Adaeze Okafor", used: 14.2, limit: 20 },
  { name: "Tunde Bakare", used: 9.6, limit: 10 },
  { name: "Ifeoma Nwosu", used: 6.1, limit: 15 },
  { name: "Zainab Yusuf", used: 3.4, limit: 10 },
];

function TeamsArt() {
  return (
    <div
      className={cx(
        art,
        "items-end justify-end pl-[clamp(24px,3vw,40px)] max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:gap-3.5 max-[640px]:px-6 max-[640px]:pb-6",
      )}
      aria-hidden="true"
    >
      <div className="w-[min(100%,500px)] rounded-tl-[18px] bg-white px-5 pt-4.5 pb-1.5 shadow-[0_0_0_1px_var(--color-line),0_24px_56px_-20px_rgb(11_12_11/0.24)] max-[640px]:w-full max-[640px]:rounded-[18px] max-[640px]:px-4">
        <header className="mb-2 flex items-baseline justify-between">
          <strong className="text-[15px] font-[560] tracking-[-0.025em]">Engineering</strong>
          <span className="text-[12px] text-ink-3 tabular-nums">4 of 38 people</span>
        </header>
        <ul>
          {team.map((person) => (
            <li
              key={person.name}
              className="grid h-[50px] grid-cols-[28px_minmax(0,1.1fr)_minmax(0,1fr)_88px] items-center gap-3 border-t border-line max-[640px]:grid-cols-[28px_minmax(0,1fr)_84px]"
            >
              <Avatar name={person.name} className="size-7" />
              <span className="truncate font-[520]">{person.name}</span>
              <ByteMeter
                ratio={person.used / person.limit}
                tone={person.used / person.limit > 0.9 ? "amber" : "green"}
                className="max-[640px]:hidden"
              />
              <em className="text-right text-[12px] whitespace-nowrap text-ink-2 tabular-nums">
                {person.used.toFixed(1)} / {person.limit} GB
              </em>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-7 left-[clamp(24px,3vw,40px)] inline-flex h-9 max-[640px]:static max-[640px]:self-start items-center gap-2 rounded-full bg-ink pr-4 pl-3.5 font-[520] text-white shadow-[0_12px_28px_-10px_rgb(11_12_11/0.5)]">
        <Icon name="users" size={15} className="text-green" />
        One pool. One bill.
      </div>
    </div>
  );
}

const notification = "grid grid-cols-[34px_minmax(0,1fr)] gap-3 rounded-[18px] bg-night-3 pt-3.5 pr-4 pl-3.5 inset-ring inset-ring-night-line-2";
const notificationIcon = "grid size-[34px] place-items-center rounded-[10px] bg-green text-ink";
const notificationTitle = "flex items-baseline justify-between text-[13.5px] font-[560]";

function RewardsArt() {
  return (
    <div
      className={cx(art, "flex-col justify-end gap-2.5 px-[clamp(24px,3vw,40px)] pb-[clamp(24px,3vw,40px)] text-on-night")}
      aria-hidden="true"
    >
      {/* An earlier notification, tucked behind the new one. */}
      <div className={cx(notification, "mx-4 -mb-10 pb-9 opacity-50")}>
        <span className={notificationIcon}>
          <Icon name="gift" size={16} />
        </span>
        <div>
          <strong className={notificationTitle}>Referral bonus</strong>
        </div>
      </div>
      <div className={cx(notification, "relative z-1 pb-3.5")}>
        <span className={notificationIcon}>
          <Icon name="gift" size={16} />
        </span>
        <div>
          <strong className={notificationTitle}>
            Meridian Pay <em className="text-[12px] font-normal text-on-night-3">now</em>
          </strong>
          <p className="mt-0.5 text-[13.5px] leading-[1.4] text-on-night-2">
            You've earned 2 GB of internet, on us. Use it anywhere online.
          </p>
        </div>
      </div>
      <div className="mt-1.5 grid grid-cols-[1.4fr_1fr_1fr] gap-3 rounded-[14px] px-4 py-3.5 max-[640px]:grid-cols-[auto_auto_auto] max-[640px]:justify-between max-[640px]:gap-2 max-[640px]:px-3.5 [&_span]:whitespace-nowrap inset-ring inset-ring-night-line [&>div]:grid [&>div]:gap-0.5 [&_span]:text-[11.5px] [&_span]:text-on-night-3 [&_strong]:font-[540] [&_strong]:whitespace-nowrap">
        <div>
          <span>Campaign</span>
          <strong>Sign-up reward</strong>
        </div>
        <div>
          <span>Per customer</span>
          <strong className="tabular-nums">2 GB</strong>
        </div>
        <div>
          <span>Status</span>
          <strong className="inline-flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-green" />
            Running
          </strong>
        </div>
      </div>
    </div>
  );
}

function TollFreeArt() {
  return (
    <div className={cx(art, "items-end px-[clamp(24px,3vw,40px)]")} aria-hidden="true">
      <div className="w-full rounded-t-2xl bg-white shadow-[0_-8px_40px_-16px_rgb(11_12_11/0.3)]">
        <div className="flex h-10 items-center gap-1.5 border-b border-line px-3.5">
          <i className="size-2 rounded-full bg-paper-3" />
          <i className="size-2 rounded-full bg-paper-3" />
          <i className="size-2 rounded-full bg-paper-3" />
          <span className="ml-2 h-6 flex-1 rounded-[7px] bg-paper-2 px-2.5 font-mono text-[11.5px] leading-6 text-ink-3">
            app.yourbrand.com
          </span>
        </div>
        <div className="grid gap-2.5 px-4.5 pt-5 pb-5.5">
          <span className="h-4 w-[46%] rounded-[5px] bg-ink/14" />
          <span className="h-2.5 w-[72%] rounded-[5px] bg-paper-3" />
          <span className="h-2.5 w-[58%] rounded-[5px] bg-paper-3" />
          <div className="mt-2.5 flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 inset-ring inset-ring-line-2">
            <div className="grid gap-px">
              <span className="text-[12px] text-ink-3">Charged to your customer</span>
              <strong className="text-[22px] leading-[1.2] font-[560] tracking-[-0.035em] tabular-nums">0.0 MB</strong>
            </div>
            <span className={tagGreen}>Sponsored</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const brands = [
  { name: "Kite", color: "#5b4bff" },
  { name: "Lumo", color: "#d9480f" },
  { name: "Orbit", color: "#0a6cff" },
  { name: "Sable", color: "#0b0c0b" },
];

function WhiteLabelArt() {
  const [index, setIndex] = useState(0);
  const brand = brands[index];
  const brandFill = "bg-(--brand) text-white transition-colors duration-[400ms] ease-in-out";

  return (
    <div
      className={cx(
        art,
        "items-end justify-end gap-[clamp(16px,3vw,40px)] px-[clamp(24px,3vw,40px)] max-[640px]:flex-col max-[640px]:items-stretch",
      )}
      style={{ "--brand": brand.color } as CSSProperties}
    >
      <div
        className="order-2 w-[min(100%,300px)] overflow-hidden rounded-t-[20px] bg-white shadow-[0_0_0_1px_var(--color-line),0_24px_56px_-20px_rgb(11_12_11/0.26)] max-[640px]:w-full"
        aria-hidden="true"
      >
        <header className={cx("flex items-center gap-2.5 px-4 py-3.5", brandFill)}>
          <span className="grid size-6 place-items-center rounded-[7px] bg-white/22 text-[12px] font-bold">{brand.name[0]}</span>
          <strong className="flex-1 text-[14.5px] font-[560] tracking-[-0.02em]">{brand.name} Internet</strong>
          <Icon name="signal" size={16} />
        </header>
        <div className="grid gap-1 px-4 pt-4.5 pb-4">
          <span className="text-[12px] text-ink-3">Data balance</span>
          <strong className="mb-2 text-[34px] leading-[1.1] font-[560] tracking-[-0.045em] tabular-nums">
            12.4 <small className="text-[15px] font-medium tracking-[-0.01em] text-ink-3">GB</small>
          </strong>
          <ByteMeter ratio={0.62} tone="inherit" className="[--fill:var(--brand)]" />
        </div>
        <div className={cx("mx-4 mb-4.5 grid h-10 place-items-center rounded-full text-[13.5px] font-[560]", brandFill)}>
          Buy more data
        </div>
      </div>
      <div className="order-1 mr-auto grid gap-2.5 pb-[clamp(24px,3vw,40px)] max-[640px]:pb-0">
        <span className="text-[12.5px] text-ink-3">Your brand</span>
        <div className="flex gap-2" role="radiogroup" aria-label="Preview a brand">
          {brands.map((item, i) => (
            <button
              key={item.name}
              type="button"
              role="radio"
              aria-checked={i === index}
              aria-label={item.name}
              className={cx(
                "relative size-7 rounded-full bg-(--swatch) transition-transform duration-200 ease-out hover:scale-108",
                "after:absolute after:-inset-1 after:rounded-full after:shadow-[0_0_0_1.5px_var(--swatch)] after:content-[''] after:[transition:opacity_0.2s_cubic-bezier(0.4,0,0.2,1),transform_0.3s_var(--ease-out)]",
                i !== index && "after:opacity-0 after:[transform:scale(0.8)]",
              )}
              style={{ "--swatch": item.color } as CSSProperties}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Section ---------------- */

export function Products() {
  return (
    <section className={section} id="products">
      <div className={shell}>
        <Reveal className={sectionHead}>
          <h2 className={h2}>
            Four ways to say <em>“this one's on us.”</em>
          </h2>
        </Reveal>

        <div className="mt-[clamp(40px,5.5vw,80px)] grid grid-cols-12 gap-[clamp(12px,1.6vw,20px)]">
          <Card
            tone="paper"
            wide
            label="OneByte Teams"
            title="For the people who work for you."
            body="Swap fixed data allowances for a shared pool. Add your team, set their limits, and stop hearing about bundles on Monday mornings."
          >
            <TeamsArt />
          </Card>

          <Card
            tone="night"
            delay={80}
            label="OneByte Rewards"
            title="For the customers who choose you."
            body="Thank them with something they'll actually use. Sponsor real internet for sign-ups, loyalty and referrals. Not one zero-rated link, but the whole web, within the limits you set."
          >
            <RewardsArt />
          </Card>

          <Card
            tone="green"
            label="OneByte Toll-Free"
            title="Your app, free to open."
            body="Nobody should have to check their balance before opening your app. Cover the data it uses."
            foot="Available by operator arrangement"
          >
            <TollFreeArt />
          </Card>

          <Card
            tone="paper"
            wide
            delay={80}
            label="OneByte White Label"
            title="Internet with your name on it."
            body="Offer connectivity under your own brand, at your own prices. Sponsor it or resell it. We run everything underneath."
          >
            <WhiteLabelArt />
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Control grid ---------------- */

const controls: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "wallet",
    title: "Wallet and spend",
    body: "See your balance and total spending at a glance, and top up whenever you need to.",
  },
  {
    icon: "gauge",
    title: "Limits at every level",
    body: "Set a limit for each person and a budget for the whole company.",
  },
  {
    icon: "chart",
    title: "Usage, broken down",
    body: "Track consumption by employee, by customer and by network.",
  },
  {
    icon: "file",
    title: "Reports on demand",
    body: "Download transaction and usage reports for finance whenever they ask.",
  },
  {
    icon: "bell",
    title: "Alerts before surprises",
    body: "Get notified when your balance runs low or a limit is close.",
  },
  {
    icon: "toggle",
    title: "Access you control",
    body: "Add, edit, suspend or remove people the moment things change.",
  },
];

/* A vertical rule sits to the left of every cell that isn't first in its row:
   three columns on desktop, two on tablet, one (no rules) on phones. */
const ruleDesktop = "min-[981px]:border-l min-[981px]:border-l-line min-[981px]:pl-[clamp(20px,3vw,36px)]";
const ruleTablet =
  "min-[641px]:max-[980px]:border-l min-[641px]:max-[980px]:border-l-line min-[641px]:max-[980px]:pl-[clamp(20px,3vw,36px)]";

export function Control() {
  return (
    <section className="pb-[clamp(88px,11vw,160px)]">
      <div className={shell}>
        <Reveal className={sectionHead}>
          <h2 className={h2}>
            You stay in charge. <em>Every byte accounted for.</em>
          </h2>
        </Reveal>

        <ul className="mt-[clamp(40px,5.5vw,72px)] grid grid-cols-3 border-t border-line-2 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {controls.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={(i % 3) * 70}
              className={cx(
                "border-b border-b-line-2 pt-[clamp(24px,3vw,36px)] pr-[clamp(20px,3vw,36px)] pb-[clamp(28px,3.4vw,44px)]",
                i % 3 !== 0 && ruleDesktop,
                i % 2 === 1 && ruleTablet,
              )}
            >
              <span className="grid size-10 place-items-center rounded-[11px] bg-ink text-white">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-5 text-[19px] leading-[1.3] font-[540] tracking-[-0.028em]">{item.title}</h3>
              <p className="mt-1.5 max-w-[320px] text-[16px] leading-normal tracking-[-0.008em] text-ink-3">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
