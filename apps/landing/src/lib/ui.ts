/* Shared Tailwind class recipes. Anything used in more than one component lives here. */

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/** Page container: fluid gutters (20–40px a side) up to a 1200px measure. */
export const shell = "mx-auto w-[min(100%-clamp(40px,8vw,80px),1200px)]";

/** Vertical rhythm for a full page section. */
export const section = "py-[clamp(88px,11vw,160px)]";

/** A dark section. The `night` class switches on the `night:` variant for everything inside. */
export const night = "night bg-night text-on-night";

export const eyebrow = "text-[16px] leading-[1.3] font-medium tracking-[-0.012em] text-ink-3 night:text-on-night-2";

/** Section headline without a size, for the few places that set their own. `<em>` is the quieter half. */
export const h2Base =
  "font-display leading-[0.98] font-[680] text-balance [&_em]:not-italic [&_em]:text-ink-4 night:[&_em]:text-on-night-3";

export const h2 = `${h2Base} text-[clamp(38px,5.6vw,76px)] tracking-[-0.022em]`;

export const lede =
  "text-[clamp(17px,1.5vw,20px)] leading-normal tracking-[-0.011em] text-ink-3 text-pretty night:text-on-night-2";

export const sectionHead = "grid gap-5 max-w-[900px]";

/* ---------------- Buttons ---------------- */

const btnBase =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.012em] whitespace-nowrap " +
  "transition-[background-color,color,box-shadow,scale] duration-200 ease-in-out active:scale-[0.98]";

const btnTone = {
  ink: "bg-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(11_12_11/0.2)] hover:bg-[#232624]",
  green: "bg-green text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] hover:bg-[#3be586]",
  /** White on dark, used by the nav while it sits over a night section. */
  paper: "bg-white text-ink",
};

const btnSize = {
  sm: "h-[38px] px-4 text-[14.5px]",
  md: "h-12 px-5.5 text-[15.5px]",
  /** Medium on phones, larger from tablet up. Used by the hero form. */
  hero: "h-12 px-5.5 text-[15.5px] min-[761px]:h-14 min-[761px]:px-7 min-[761px]:text-[17.5px]",
};

export const btn = (tone: keyof typeof btnTone = "ink", size: keyof typeof btnSize = "md") =>
  cx(btnBase, btnTone[tone], btnSize[size]);

/** The arrow inside a button: nudges right when the button is hovered. */
export const btnArrow =
  "size-4 shrink-0 transition-transform duration-[250ms] ease-out group-hover/btn:translate-x-[3px]";

/* ---------------- Small shared pieces ---------------- */

/** Pill label, e.g. "₦0 setup" or the selected pricing tier. */
export const tag =
  "inline-flex items-center gap-[5px] h-6 px-[9px] rounded-full inset-ring inset-ring-line-2 text-[12px] font-[520] text-ink-2 whitespace-nowrap";

export const tagGreen =
  "inline-flex items-center gap-[5px] h-6 px-[9px] rounded-full bg-green-wash text-[12px] font-[520] text-green-ink whitespace-nowrap";

/** Segmented control (track). Buttons inside use `segButton`. */
export const seg = "inline-flex p-[3px] rounded-full bg-ink/7";

export const segButton =
  "h-8 px-3.5 rounded-full text-[13.5px] font-medium tracking-[-0.008em] text-ink-3 transition-[color,background-color,box-shadow] duration-200 ease-in-out " +
  "hover:text-ink aria-selected:bg-white aria-selected:text-ink aria-selected:shadow-[0_0_0_1px_var(--color-line),0_1px_3px_rgb(11_12_11/0.1)]";
