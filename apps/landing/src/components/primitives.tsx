import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "../lib/hooks";
import { cx } from "../lib/ui";

/* ------------------------------------------------------------------
   ByteMark — eight bits, one of them on. The whole brand in 8 squares.
   `value` is rendered in binary (MSB first), so the default 1 lights
   only the last cell.
   ------------------------------------------------------------------ */

export function ByteMark({ value = 1, cell = 5, gap = 2 }: { value?: number; cell?: number; gap?: number }) {
  const bits = Array.from({ length: 8 }, (_, i) => ((value >> (7 - i)) & 1) === 1);
  return (
    <span
      className="inline-grid shrink-0 grid-cols-[repeat(4,var(--cell))] gap-(--gap) align-middle"
      style={{ "--cell": `${cell}px`, "--gap": `${gap}px` } as CSSProperties}
      aria-hidden="true"
    >
      {bits.map((on, i) => (
        <i key={i} className={cx("size-(--cell) rounded-[calc(var(--cell)*0.22)]", on ? "bg-green" : "bg-current")} />
      ))}
    </span>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <ByteMark />
      <span className="font-display text-[21px] leading-none font-bold tracking-[-0.025em]">OneByte</span>
    </span>
  );
}

/* ------------------------------------------------------------------
   ByteMeter — eight segments, like the mark. Fills left to right,
   the last lit segment partially. The fill colour comes from `--fill`,
   so a parent can re-brand it.
   ------------------------------------------------------------------ */

const meterTone = {
  green: "[--fill:var(--color-green-deep)]",
  amber: "[--fill:var(--color-amber)]",
  ink: "[--fill:var(--color-ink)]",
  inherit: "",
};

export function ByteMeter({
  ratio,
  tone = "green",
  className,
}: {
  ratio: number;
  tone?: keyof typeof meterTone;
  className?: string;
}) {
  return (
    <span className={cx("grid h-1.5 w-full grid-cols-8 gap-0.5", meterTone[tone], className)} aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, ratio * 8 - i));
        return (
          <i key={i} className="relative overflow-hidden rounded-[1.5px] bg-ink/9">
            <b
              className="absolute inset-0 origin-left bg-(--fill) transition-[transform,background-color] duration-[600ms] ease-out"
              style={{ transform: `scaleX(${fill})` }}
            />
          </i>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------
   Reveal — fades content up the first time it scrolls into view.
   ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
};

export function Reveal({ children, as: Tag = "div", delay = 0, className, style, ...rest }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={cx(
        "transition-[opacity,translate] duration-[900ms] ease-out motion-reduce:translate-none motion-reduce:opacity-100 motion-reduce:transition-none",
        inView ? "opacity-100" : "translate-y-5 opacity-0",
        className,
      )}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------
   Icons — one 20px grid, 1.5px strokes, round joins.
   ------------------------------------------------------------------ */

const paths = {
  arrow: <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" />,
  arrowUpRight: <path d="M6.5 13.5l7-7m-5.5 0h5.5V12" />,
  check: <path d="M4.5 10.5l3.5 3.5 7.5-8" />,
  plus: <path d="M10 4.5v11M4.5 10h11" />,
  chevron: <path d="M5.5 8l4.5 4.5L14.5 8" />,
  wallet: (
    <>
      <path d="M3.5 6.5A2 2 0 015.5 4.5h8a2 2 0 012 2v1" />
      <rect x="3.5" y="6.5" width="13" height="9.5" rx="2" />
      <path d="M13 11.25h1" />
    </>
  ),
  users: (
    <>
      <circle cx="7.5" cy="7.25" r="2.75" />
      <path d="M2.75 16c.5-2.6 2.4-4 4.75-4s4.25 1.4 4.75 4" />
      <path d="M13 4.75a2.75 2.75 0 010 5M15 12.4c1.2.6 2 1.8 2.3 3.6" />
    </>
  ),
  gauge: (
    <>
      <path d="M3.5 13.5a6.5 6.5 0 1113 0" />
      <path d="M10 13.5l3-4.5" />
      <circle cx="10" cy="13.5" r="1" />
    </>
  ),
  chart: <path d="M4 16V9.5M8 16V4.5M12 16v-5M16 16V7.5" />,
  file: (
    <>
      <path d="M5.5 3.5h6l3 3v10h-9z" />
      <path d="M11.5 3.5v3h3M8 10.5h4M8 13.5h4" />
    </>
  ),
  bell: (
    <>
      <path d="M5.5 13.5V9a4.5 4.5 0 019 0v4.5l1.25 1.5H4.25z" />
      <path d="M8.5 17h3" />
    </>
  ),
  toggle: (
    <>
      <rect x="2.5" y="6" width="15" height="8" rx="4" />
      <circle cx="13.5" cy="10" r="2" />
    </>
  ),
  home: <path d="M3.5 9L10 3.5 16.5 9v7.5h-4.25V12h-4.5v4.5H3.5z" />,
  code: <path d="M7 6.5L3.5 10 7 13.5M13 6.5l3.5 3.5-3.5 3.5M11.25 4.5l-2.5 11" />,
  settings: (
    <>
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.05 5.05l1.4 1.4M13.55 13.55l1.4 1.4M5.05 14.95l1.4-1.4M13.55 6.45l1.4-1.4" />
    </>
  ),
  signal: <path d="M4 15.5v-2M8 15.5v-5M12 15.5v-8M16 15.5v-11" />,
  menu: <path d="M3.5 7h13M3.5 13h13" />,
  close: <path d="M5 5l10 10M15 5L5 15" />,
  upload: <path d="M10 13V4.5M6.5 8L10 4.5 13.5 8M4 13v2.5h12V13" />,
  gift: (
    <>
      <rect x="3.5" y="8" width="13" height="8.5" rx="1.5" />
      <path d="M2.75 8h14.5M10 8v8.5M10 8C8 8 6.5 7 6.5 5.5S8.5 3.5 10 8zM10 8c2 0 3.5-1 3.5-2.5S11.5 3.5 10 8z" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className, size = 20 }: { name: IconName; className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
