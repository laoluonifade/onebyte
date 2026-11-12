import { useState } from "react";
import { Logo, Reveal } from "./primitives";
import { WaitlistForm } from "./Waitlist";
import "./Closing.css";

/* ---------------- FAQ ---------------- */

const faqs = [
  {
    q: "When can my business start?",
    a: "We're bringing businesses on from the waitlist in small batches, starting in Nigeria. Join the list and we'll write to you as soon as your spot opens.",
  },
  {
    q: "Which networks do you support?",
    a: "We're launching on Glo. More Nigerian networks will follow as each integration goes live, and they'll all be managed from the same dashboard.",
  },
  {
    q: "Do my people need a new SIM or an app?",
    a: "No. They keep the eligible SIM they already have. Once a number is activated on your pool, they simply use the internet as normal.",
  },
  {
    q: "What will it cost?",
    a: "Setting up is free. You fund a wallet, and charges are deducted per gigabyte as data is actually consumed. Nothing is billed for data nobody used.",
  },
  {
    q: "How do spending limits work?",
    a: "You can set a limit for each person and a budget for the whole company, and we alert you as either one gets close. How strictly a limit cuts off at network level depends on the operator, and we'll confirm exactly how it behaves for you during onboarding.",
  },
  {
    q: "How is Rewards different from zero-rating?",
    a: "Zero-rating only covers a specific app or website. With Rewards, the people you sponsor can browse the wider internet within the limit you've set. If you do want free access to just your own app, that's what Toll-Free is for, and it needs a separate operator arrangement.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section faq" id="faq">
      <div className="shell faq__grid">
        <Reveal className="section-head">
          <h2 className="h2">You're probably wondering.</h2>
        </Reveal>

        <Reveal as="ul" className="faq__list" delay={80}>
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} data-open={isOpen || undefined}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span className="faq__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div className="faq__answer" id={`faq-${i}`} role="region">
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Closing: the waitlist ---------------- */

export function Cta() {
  return (
    <section className="cta" id="waitlist">
      <div className="shell">
        <Reveal className="cta__panel">
          <h2 className="cta__title">Put your people online.</h2>
          <p className="cta__lede">
            Join the waitlist. We're bringing Nigerian businesses on in small batches, and we'd love yours to be one of
            the first.
          </p>
          <WaitlistForm id="cta-email" tone="green" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__row">
        <a href="#top" aria-label="OneByte home">
          <Logo />
        </a>
        <span>© {new Date().getFullYear()} OneByte</span>
      </div>
    </footer>
  );
}
