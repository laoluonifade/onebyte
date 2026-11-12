import { useState, type CSSProperties } from "react";
import { gb, int, naira, nairaExact } from "../lib/format";
import { useInView, useInterval, usePrefersReducedMotion } from "../lib/hooks";
import { Icon, type IconName } from "./primitives";
import "./Console.css";

/* ------------------------------------------------------------------
   Console — a working miniature of the business dashboard. All figures
   are illustrative but internally consistent: spend is always
   usage × rate, and the wallet is whatever was funded minus spend.
   ------------------------------------------------------------------ */

const RATE = 425; // ₦ per GB
const FUNDED = 2_067_605;
const BUDGET = 1_500_000;
const AXIS_MAX = 200;

/** Daily GB for 1–11 Nov 2026. Day 12 is "today" and keeps growing. */
const HISTORY = [109, 162, 171, 178, 186, 169, 121, 113, 174, 181, 178];
const HISTORY_TOTAL = HISTORY.reduce((sum, value) => sum + value, 0);
const TODAY_START = 100.6;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // 1 Nov 2026 is a Sunday

const sideNav: { icon: IconName; label: string; active?: boolean; count?: string }[] = [
  { icon: "home", label: "Overview", active: true },
  { icon: "users", label: "People", count: "260" },
  { icon: "wallet", label: "Wallet" },
  { icon: "gauge", label: "Limits" },
  { icon: "file", label: "Reports" },
  { icon: "bell", label: "Alerts" },
];

type Person = {
  name: string;
  team: string;
  number: string;
  used: number | null;
  limit: number;
  status: "active" | "near" | "pending";
};

const people: Person[] = [
  { name: "Adaeze Okafor", team: "Engineering", number: "0805 ••• 4412", used: 14.2, limit: 20, status: "active" },
  { name: "Tunde Bakare", team: "Sales", number: "0807 ••• 9038", used: 9.6, limit: 10, status: "near" },
  { name: "Ifeoma Nwosu", team: "Design", number: "0705 ••• 2271", used: 6.1, limit: 15, status: "active" },
  { name: "Zainab Yusuf", team: "Support", number: "0815 ••• 6650", used: 3.4, limit: 10, status: "active" },
  { name: "Emeka Obi", team: "Operations", number: "0905 ••• 1187", used: null, limit: 10, status: "pending" },
];

const statusLabel: Record<Person["status"], string> = {
  active: "Active",
  near: "Near limit",
  pending: "Activating",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

/** Eight segments, like the mark. Fills left to right, last one partially. */
export function ByteMeter({ ratio, tone = "green" }: { ratio: number; tone?: "green" | "amber" | "ink" }) {
  return (
    <span className="bytemeter" data-tone={tone} aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, ratio * 8 - i));
        return (
          <i key={i}>
            <b style={{ transform: `scaleX(${fill})` }} />
          </i>
        );
      })}
    </span>
  );
}

export function Console() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ once: false, margin: "0px" });
  const [today, setToday] = useState(TODAY_START);
  const [lastTick, setLastTick] = useState(0.42);
  const [hovered, setHovered] = useState<number | null>(null);

  // A small trickle of usage so the wallet visibly drains per gigabyte.
  useInterval(
    () => {
      const tick = Math.round((0.02 + Math.random() * 0.1) * 100) / 100;
      setLastTick(tick);
      setToday((value) => Math.round((value + tick) * 100) / 100);
    },
    1600,
    inView && !reduced,
  );

  const used = HISTORY_TOTAL + today;
  const spent = used * RATE;
  const wallet = FUNDED - spent;
  const days = [...HISTORY, today];

  return (
    <div className="console" ref={ref}>
      <aside className="console__side">
        <div className="console__org">
          <span className="console__org-mark">M</span>
          <span className="console__org-name">Meridian Labs</span>
          <Icon name="chevron" size={14} />
        </div>

        <ul className="console__nav">
          {sideNav.map((item) => (
            <li key={item.label} data-active={item.active || undefined}>
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
              {item.count && <em className="num">{item.count}</em>}
            </li>
          ))}
        </ul>

        <div className="console__pool">
          <div className="console__pool-top">
            <span>Shared pool</span>
            <span className="console__live">
              <i />
              Live
            </span>
          </div>
          <strong>Glo Nigeria</strong>
          <span>248 numbers connected</span>
        </div>
      </aside>

      <div className="console__main">
        <header className="console__head">
          <div>
            <h3>Overview</h3>
            <span className="console__range num">1 – 12 Nov 2026</span>
          </div>
          <div className="console__head-actions">
            <span className="console__btn">
              <Icon name="upload" size={14} />
              Export
            </span>
            <span className="console__btn console__btn--ink">
              <Icon name="plus" size={14} />
              Fund wallet
            </span>
          </div>
        </header>

        <dl className="console__kpis">
          <div>
            <dt>Wallet balance</dt>
            <dd className="num">{nairaExact(wallet)}</dd>
            <span>Billed as data is used</span>
          </div>
          <div>
            <dt>Spent this month</dt>
            <dd className="num">{naira(spent)}</dd>
            <span className="num">at ₦{RATE} per GB</span>
          </div>
          <div>
            <dt>Data used</dt>
            <dd className="num">
              {gb(used)} <small>GB</small>
            </dd>
            <span className="num">{gb(today)} GB today</span>
          </div>
          <div>
            <dt>Active people</dt>
            <dd className="num">248</dd>
            <span className="num">of 260 added</span>
          </div>
        </dl>

        <div className="console__split">
          <section className="console__panel">
            <header>
              <h4>Daily consumption</h4>
              <span>GB per day</span>
            </header>
            <div className="bars" onMouseLeave={() => setHovered(null)}>
              <div className="bars__grid" aria-hidden="true">
                {[AXIS_MAX, AXIS_MAX / 2, 0].map((tick) => (
                  <span key={tick} className="num">
                    {tick}
                  </span>
                ))}
              </div>
              <div className="bars__plot">
                {days.map((value, i) => {
                  const isToday = i === days.length - 1;
                  const label = `${WEEKDAYS[i % 7]} ${i + 1} Nov`;
                  return (
                    <div
                      key={i}
                      className="bars__col"
                      data-today={isToday || undefined}
                      data-hover={hovered === i || undefined}
                      style={{ "--n": i } as CSSProperties}
                      onMouseEnter={() => setHovered(i)}
                    >
                      <i style={{ height: `${(value / AXIS_MAX) * 100}%` }} />
                      <span className="num">{i + 1}</span>
                      {hovered === i && (
                        <div className="bars__tip" data-edge={i < 2 ? "start" : i > 9 ? "end" : undefined}>
                          <em>{isToday ? `${label} · so far` : label}</em>
                          <strong className="num">{gb(value)} GB</strong>
                          <span className="num">{naira(value * RATE)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="console__panel console__budget">
            <header>
              <h4>Company budget</h4>
              <span>November</span>
            </header>
            <p className="num">
              <strong>{naira(spent)}</strong> of {naira(BUDGET)}
            </p>
            <ByteMeter ratio={spent / BUDGET} />
            <ul>
              <li>
                <span>Low-balance alert</span>
                <em className="num">below ₦250,000</em>
              </li>
              <li>
                <span>Limit alert</span>
                <em className="num">at 80% used</em>
              </li>
              <li>
                <span>Default limit</span>
                <em className="num">10 GB / person</em>
              </li>
            </ul>
          </section>
        </div>

        <section className="console__panel console__people">
          <header>
            <h4>People</h4>
            <span className="num">{int(260)} total</span>
          </header>
          <div className="people" role="table" aria-label="People on the shared pool">
            <div className="people__row people__row--head" role="row">
              <span role="columnheader">Name</span>
              <span role="columnheader">Number</span>
              <span role="columnheader">Network</span>
              <span role="columnheader">Usage this month</span>
              <span role="columnheader">Status</span>
            </div>
            {people.map((person) => {
              const ratio = person.used === null ? 0 : person.used / person.limit;
              return (
                <div className="people__row" role="row" key={person.name}>
                  <span role="cell" className="people__name">
                    <i>{initials(person.name)}</i>
                    <span>
                      <strong>{person.name}</strong>
                      <em>{person.team}</em>
                    </span>
                  </span>
                  <span role="cell" className="num mono">
                    {person.number}
                  </span>
                  <span role="cell">
                    <span className="people__net">Glo</span>
                  </span>
                  <span role="cell" className="people__usage">
                    <ByteMeter ratio={ratio} tone={person.status === "near" ? "amber" : "green"} />
                    <span className="num">
                      {person.used === null ? "—" : gb(person.used)} / {person.limit} GB
                    </span>
                  </span>
                  <span role="cell">
                    <span className="status" data-status={person.status}>
                      <i />
                      {statusLabel[person.status]}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Floating detail: every tick of usage is billed to the wallet. */}
      <div className="console__toast" aria-hidden="true">
        <span className="console__toast-icon">
          <Icon name="wallet" size={14} />
        </span>
        <span>
          <strong>Usage billed</strong>
          <em className="num" key={today}>
            {lastTick.toFixed(2)} GB · −{nairaExact(lastTick * RATE)}
          </em>
        </span>
      </div>
    </div>
  );
}
