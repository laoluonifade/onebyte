import { useEffect, useState } from "react";
import { btn, cx, shell } from "../lib/ui";
import { Icon, Logo } from "./primitives";

const links = [
  { href: "#products", label: "Products" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#developers", label: "Developers" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Sections flagged `data-nav-dark` flip the bar to its night theme while they sit beneath it.
    const darkSections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-dark]"));
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setOnDark(
        darkSections.some((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= 34 && rect.bottom >= 34;
        }),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Lock the page behind the mobile sheet and let Escape dismiss it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dark = onDark && !open;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color,opacity] duration-300 ease-in-out intro:opacity-0",
        dark
          ? "bg-night/80 text-on-night shadow-[0_1px_0_var(--color-night-line)] backdrop-blur-[20px] backdrop-saturate-[1.8]"
          : "text-ink",
        !dark && (scrolled || open) && "bg-white/82 shadow-[0_1px_0_var(--color-line)] backdrop-blur-[20px] backdrop-saturate-[1.8]",
      )}
      data-theme={dark ? "dark" : undefined}
    >
      <div className={cx(shell, "grid h-[68px] grid-cols-[1fr_auto_1fr] items-center max-[900px]:h-[60px] max-[900px]:grid-cols-[1fr_auto]")}>
        <a
          href="#top"
          className="inline-flex justify-self-start rounded-lg"
          aria-label="OneByte home"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </a>

        <nav className="flex gap-1 max-[900px]:hidden" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cx(
                "rounded-full px-3.5 py-2 text-[14.5px] font-[450] tracking-[-0.008em] transition-colors duration-200 ease-in-out",
                dark ? "text-on-night-2 hover:bg-white/8 hover:text-on-night" : "text-ink-2 hover:bg-ink/5 hover:text-ink",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 justify-self-end">
          {/* Hidden whenever the menu button shows; the menu sheet carries its own waitlist button. */}
          <a href="#waitlist" className={cx(btn(dark ? "paper" : "ink", "sm"), "max-[900px]:hidden")}>
            Join the waitlist
          </a>
          <button
            type="button"
            className="-mr-2 ml-0.5 hidden size-[38px] place-items-center rounded-full max-[900px]:grid"
            aria-expanded={open}
            aria-controls="nav-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      <div
        id="nav-sheet"
        className="hidden h-[calc(100dvh-60px)] overflow-y-auto border-t border-line bg-white pt-3 pb-8 max-[900px]:block"
        hidden={!open}
      >
        <nav className={shell} aria-label="Mobile">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="flex animate-sheet-in items-center justify-between border-b border-line py-4.5 text-[26px] font-[540] tracking-[-0.035em]"
              style={{ animationDelay: `${40 + i * 35}ms` }}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <Icon name="arrowUpRight" className="text-ink-4" />
            </a>
          ))}
          <div className="mt-7 grid animate-sheet-in-late gap-2.5">
            <a href="#waitlist" className={btn("ink")} onClick={() => setOpen(false)}>
              Join the waitlist
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
