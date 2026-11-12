import { useState, type ReactNode } from "react";
import { gb, int, naira, nairaExact } from "../lib/format";
import { useInView, useInterval, usePrefersReducedMotion } from "../lib/hooks";
import { cx } from "../lib/ui";
import { ByteMeter, Icon, Network, type IconName, type NetworkName } from "./primitives";
import { Avatar } from "./Avatar";

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
  network: NetworkName;
  status: "active" | "near" | "pending";
};

const people: Person[] = [
  { name: "Ayomide Aluko", team: "Engineering", number: "0816 ••• 2390", used: 11.8, limit: 20, network: "MTN", status: "active" },
  { name: "Laolu Onifade", team: "Product", number: "0805 ••• 7714", used: 8.3, limit: 15, network: "Glo", status: "active" },
  { name: "Adaeze Okafor", team: "Engineering", number: "0803 ••• 4412", used: 14.2, limit: 20, network: "MTN", status: "active" },
  { name: "Tunde Bakare", team: "Sales", number: "0807 ••• 9038", used: 9.6, limit: 10, network: "Glo", status: "near" },
  { name: "Ifeoma Nwosu", team: "Design", number: "0706 ••• 2271", used: 6.1, limit: 15, network: "MTN", status: "active" },
  { name: "Zainab Yusuf", team: "Support", number: "0815 ••• 6650", used: 3.4, limit: 10, network: "Glo", status: "active" },
  { name: "Emeka Obi", team: "Operations", number: "0903 ••• 1187", used: null, limit: 10, network: "MTN", status: "pending" },
];

const statusLabel: Record<Person["status"], string> = {
  active: "Active",
  near: "Near limit",
  pending: "Activating",
};

/* ---------------- Class recipes local to the dashboard ---------------- */

const hairline = "border-ink/7"; // the dashboard's own, slightly lighter rule
const panel = "min-w-0 rounded-xl px-4 pt-3.5 inset-ring inset-ring-ink/7";
const panelHead = "flex items-baseline justify-between [&>span]:text-[11.5px] [&>span]:text-ink-3";
const panelTitle = "text-[13px] font-[560] tracking-[-0.02em]";
const headButton = "inline-flex h-7 items-center gap-[5px] rounded-lg px-2.5 font-[520]";
const row =
  "grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_64px_minmax(0,1.45fr)_92px] items-center gap-4 [&>span]:min-w-0 [&>span]:whitespace-nowrap";

const statusDot: Record<Person["status"], string> = {
  active: "rounded-full bg-green-deep",
  near: "rotate-45 rounded-[1px] bg-amber",
  pending: "rounded-full shadow-[inset_0_0_0_1.5px_var(--color-ink-4)]",
};

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

  const kpis: { label: string; value: ReactNode; note: string }[] = [
    { label: "Wallet balance", value: nairaExact(wallet), note: "Billed as data is used" },
    { label: "Spent this month", value: naira(spent), note: `at ₦${RATE} per GB` },
    {
      label: "Data used",
      value: (
        <>
          {gb(used)} <small className="text-[13px] font-medium tracking-[-0.01em] text-ink-3">GB</small>
        </>
      ),
      note: `${gb(today)} GB today`,
    },
    { label: "Active people", value: "248", note: "of 260 added" },
  ];

  return (
    <div
      className="relative grid grid-cols-[204px_minmax(0,1fr)] rounded-[18px] bg-white text-left text-[12.5px] leading-[1.35] tracking-[-0.006em] text-ink shadow-[0_1px_2px_rgb(6_60_30/0.12),0_28px_60px_-24px_rgb(6_60_30/0.5)] max-[980px]:grid-cols-1 [&_em]:not-italic"
      ref={ref}
    >
      {/* ---------------- Sidebar ---------------- */}
      <aside className={cx("flex flex-col gap-4.5 rounded-l-[18px] border-r bg-paper-2 px-3 pt-4 pb-3 max-[980px]:hidden", hairline)}>
        <div className="flex items-center gap-[9px] px-1.5 py-1 font-[560] tracking-[-0.02em]">
          <span className="grid size-[22px] place-items-center rounded-md bg-ink text-[11px] font-semibold text-white">M</span>
          <span className="flex-1">Meridian Labs</span>
          <Icon name="chevron" size={14} className="text-ink-4" />
        </div>

        <ul className="grid gap-px">
          {sideNav.map((item) => (
            <li
              key={item.label}
              className={cx(
                "flex h-[30px] items-center gap-[9px] rounded-[7px] px-2",
                item.active
                  ? "bg-white font-[520] text-ink shadow-[0_0_0_1px_rgb(11_12_11/0.07),0_1px_2px_rgb(11_12_11/0.04)]"
                  : "font-[450] text-ink-3",
              )}
            >
              <Icon name={item.icon} size={16} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.count && <em className="text-[11px] text-ink-4 tabular-nums">{item.count}</em>}
            </li>
          ))}
        </ul>

        <div className="mt-auto grid gap-[3px] rounded-[10px] bg-white p-3 text-[11.5px] text-ink-3 ring-1 ring-ink/7">
          <div className="mb-1 flex items-center justify-between">
            <span>Shared pools</span>
            <span className="inline-flex items-center gap-[5px] font-[520] text-green-ink">
              <i className="size-1.5 animate-live-pulse rounded-full bg-green shadow-[0_0_0_0_rgb(23_219_112/0.5)]" />
              Live
            </span>
          </div>
          <span className="mt-0.5 mb-1 flex gap-1">
            <Network name="MTN" />
            <Network name="Glo" />
          </span>
          <span>248 numbers connected</span>
        </div>
      </aside>

      {/* ---------------- Main ---------------- */}
      <div className="grid min-w-0 gap-3.5 px-5 pt-4.5 pb-5">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <h3 className="text-[17px] font-[560] tracking-[-0.03em]">Overview</h3>
            <span className="text-ink-3 tabular-nums">1 – 12 Nov 2026</span>
          </div>
          <div className="flex gap-1.5">
            <span className={cx(headButton, "inset-ring inset-ring-line-2")}>
              <Icon name="upload" size={14} />
              Export
            </span>
            <span className={cx(headButton, "bg-ink text-white")}>
              <Icon name="plus" size={14} />
              Fund wallet
            </span>
          </div>
        </header>

        {/* KPI row: one bordered strip, hairline dividers */}
        <dl className="grid grid-cols-[1.25fr_1fr_1fr_0.85fr] rounded-xl inset-ring inset-ring-ink/7">
          {kpis.map((kpi, i) => (
            <div key={kpi.label} className={cx("grid min-w-0 gap-1 px-4 py-3.5", i > 0 && "border-l", i > 0 && hairline)}>
              <dt className="text-ink-3">{kpi.label}</dt>
              <dd className="text-[22px] leading-[1.15] font-[560] tracking-[-0.035em] whitespace-nowrap tabular-nums">
                {kpi.value}
              </dd>
              <span className="truncate text-[11.5px] text-ink-3 tabular-nums">{kpi.note}</span>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] gap-3.5">
          <section className={cx(panel, "pb-4")}>
            <header className={cx(panelHead, "mb-3")}>
              <h4 className={panelTitle}>Daily consumption</h4>
              <span>GB per day</span>
            </header>

            {/* Bar chart. The bottom padding leaves room for the x labels. */}
            <div
              className="group/bars relative grid h-[148px] grid-cols-[22px_minmax(0,1fr)] gap-2 pb-4.5"
              onMouseLeave={() => setHovered(null)}
            >
              <div className="col-span-full row-start-1 flex flex-col justify-between text-[10px] text-ink-4" aria-hidden="true">
                {[AXIS_MAX, AXIS_MAX / 2, 0].map((tick) => (
                  <span
                    key={tick}
                    className={cx(
                      "relative h-0 leading-[0] tabular-nums after:absolute after:top-0 after:right-0 after:left-[30px] after:border-t after:content-['']",
                      tick === 0 ? "after:border-line-2" : "after:border-ink/7",
                    )}
                  >
                    {tick}
                  </span>
                ))}
              </div>
              <div className="z-1 col-start-2 row-start-1 grid h-full auto-cols-fr grid-flow-col items-end">
                {days.map((value, i) => {
                  const isToday = i === days.length - 1;
                  const isHovered = hovered === i;
                  const label = `${WEEKDAYS[i % 7]} ${i + 1} Nov`;
                  return (
                    <div
                      key={i}
                      className="relative flex h-full items-end justify-center"
                      data-today={isToday || undefined}
                      onMouseEnter={() => setHovered(i)}
                    >
                      <i
                        className={cx(
                          "min-h-0.5 w-[min(60%,22px)] origin-bottom animate-bar-grow rounded-t",
                          "[transition:height_0.6s_var(--ease-out),background-color_0.15s_cubic-bezier(0.4,0,0.2,1)]",
                          isToday ? "bg-green-deep" : "bg-ink",
                          !isHovered && "group-hover/bars:opacity-32",
                        )}
                        style={{ height: `${(value / AXIS_MAX) * 100}%`, animationDelay: `${1.3 + i * 0.045}s` }}
                      />
                      <span
                        className={cx(
                          "absolute top-[calc(100%+6px)] text-[10px] tabular-nums",
                          isToday ? "font-semibold text-ink" : "text-ink-4",
                        )}
                      >
                        {i + 1}
                      </span>
                      {isHovered && (
                        <div
                          className={cx(
                            "pointer-events-none absolute bottom-[calc(100%-20px)] z-5 grid animate-tip-in gap-px rounded-[9px] bg-ink px-2.5 py-2 whitespace-nowrap text-white shadow-md",
                            i < 2 ? "left-0" : i > 9 ? "right-0" : "left-1/2 [transform:translateX(-50%)]",
                          )}
                        >
                          <em className="text-[10.5px] text-white/62">{isToday ? `${label} · so far` : label}</em>
                          <strong className="text-[13px] font-[560] tabular-nums">{gb(value)} GB</strong>
                          <span className="text-[11px] text-white/62 tabular-nums">{naira(value * RATE)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={cx(panel, "pb-4")}>
            <header className={cx(panelHead, "mb-3")}>
              <h4 className={panelTitle}>Company budget</h4>
              <span>November</span>
            </header>
            <p className="mb-2.5 text-ink-3 tabular-nums">
              <strong className="text-[15px] font-[560] tracking-[-0.025em] text-ink">{naira(spent)}</strong> of{" "}
              {naira(BUDGET)}
            </p>
            <ByteMeter ratio={spent / BUDGET} />
            <ul className="mt-3.5 grid">
              {[
                ["Low-balance alert", "below ₦250,000"],
                ["Limit alert", "at 80% used"],
                ["Default limit", "10 GB / person"],
              ].map(([label, value]) => (
                <li
                  key={label}
                  className={cx("flex justify-between gap-2 border-t py-[7px] whitespace-nowrap text-ink-3 last:pb-0", hairline)}
                >
                  <span>{label}</span>
                  <em className="font-medium text-ink tabular-nums">{value}</em>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className={cx(panel, "pb-1.5")}>
          <header className={cx(panelHead, "mb-1.5")}>
            <h4 className={panelTitle}>People</h4>
            <span className="tabular-nums">{int(260)} total</span>
          </header>
          <div role="table" aria-label="People on the shared pool">
            <div className={cx(row, "h-[30px] text-[11.5px] text-ink-3")} role="row">
              <span role="columnheader">Name</span>
              <span role="columnheader">Number</span>
              <span role="columnheader">Network</span>
              <span role="columnheader">Usage this month</span>
              <span role="columnheader">Status</span>
            </div>
            {people.map((person) => {
              const ratio = person.used === null ? 0 : person.used / person.limit;
              return (
                <div className={cx(row, "h-11 border-t", hairline)} role="row" key={person.name}>
                  <span role="cell" className="flex items-center gap-2.5">
                    <Avatar name={person.name} className="size-[26px]" />
                    <span className="grid min-w-0">
                      <strong className="truncate font-[520]">{person.name}</strong>
                      <em className="text-[11px] text-ink-3">{person.team}</em>
                    </span>
                  </span>
                  <span role="cell" className="font-mono text-[11.5px] text-ink-2 tabular-nums">
                    {person.number}
                  </span>
                  <span role="cell">
                    <Network name={person.network} />
                  </span>
                  <span role="cell" className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <ByteMeter ratio={ratio} tone={person.status === "near" ? "amber" : "green"} />
                    <span className="min-w-[78px] text-right text-ink-2 tabular-nums">
                      {person.used === null ? "—" : gb(person.used)} / {person.limit} GB
                    </span>
                  </span>
                  <span role="cell">
                    <span className={cx("inline-flex items-center gap-1.5 font-medium", person.status === "pending" && "text-ink-3")}>
                      <i className={cx("size-1.5", statusDot[person.status])} />
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
      <div
        className="absolute -top-10 right-[22px] z-3 flex animate-toast-in items-center gap-2.5 rounded-[14px] bg-ink/92 py-2.5 pr-3.5 pl-2.5 text-white shadow-[0_16px_40px_-12px_rgb(11_12_11/0.45)] backdrop-blur-md max-[760px]:hidden"
        aria-hidden="true"
      >
        <span className="grid size-[26px] place-items-center rounded-full bg-green text-ink">
          <Icon name="wallet" size={14} />
        </span>
        <span className="grid gap-px">
          <strong className="font-[560]">Usage billed</strong>
          <em className="animate-toast-tick text-[11.5px] text-white/66 tabular-nums" key={today}>
            {lastTick.toFixed(2)} GB · −{nairaExact(lastTick * RATE)}
          </em>
        </span>
      </div>
    </div>
  );
}
