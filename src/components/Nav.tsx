import { useEffect, useState } from "react";
import { Icon, Logo } from "./primitives";
import "./Nav.css";

const links = [
  { href: "#products", label: "Products" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#developers", label: "Developers" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Sections flagged `data-nav-dark` flip the bar to its night theme while they sit beneath it.
    const darkSections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-dark]"));
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setDark(
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

  return (
    <header className="nav" data-scrolled={scrolled || open || undefined} data-theme={dark && !open ? "dark" : undefined}>
      <div className="shell nav__bar">
        <a href="#top" className="nav__logo" aria-label="OneByte home" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a href="#waitlist" className="btn btn--ink btn--sm">
            Join the waitlist
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="nav-sheet"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      <div id="nav-sheet" className="nav__sheet" data-open={open || undefined} hidden={!open}>
        <nav className="shell" aria-label="Mobile">
          {links.map((link, i) => (
            <a key={link.href} href={link.href} style={{ animationDelay: `${40 + i * 35}ms` }} onClick={() => setOpen(false)}>
              {link.label}
              <Icon name="arrowUpRight" />
            </a>
          ))}
          <div className="nav__sheet-actions">
            <a href="#waitlist" className="btn btn--ink" onClick={() => setOpen(false)}>
              Join the waitlist
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
