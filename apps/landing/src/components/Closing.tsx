import { useState } from "react";
import { cx, h2, section, sectionHead, shell } from "../lib/ui";
import { Logo, Reveal } from "./primitives";
import { WaitlistForm } from "./Waitlist";

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
    <section className={section} id="faq">
      <div className={cx(shell, "grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-[clamp(40px,6vw,96px)] max-[900px]:grid-cols-1")}>
        <Reveal className={sectionHead}>
          <h2 className={h2}>You're probably wondering.</h2>
        </Reveal>

        <Reveal as="ul" className="border-t border-line-2" delay={80}>
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-line-2">
                <h3>
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[clamp(18px,1.7vw,21px)] leading-[1.3] font-[520] tracking-[-0.028em]"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    {/* Plus sign made of two bars; the vertical one (`after`) rotates flat to make a minus. */}
                    <span
                      className={cx(
                        "relative size-7 shrink-0 rounded-full transition-[background-color,box-shadow,color] duration-[250ms] ease-in-out",
                        "before:absolute before:top-1/2 before:left-1/2 before:-mt-[0.75px] before:-ml-[5px] before:h-[1.5px] before:w-2.5 before:rounded-[1px] before:bg-current before:content-['']",
                        "after:absolute after:top-1/2 after:left-1/2 after:-mt-[0.75px] after:-ml-[5px] after:h-[1.5px] after:w-2.5 after:rounded-[1px] after:bg-current after:content-['']",
                        "after:transition-transform after:duration-[350ms] after:ease-out",
                        isOpen
                          ? "bg-ink text-white after:rotate-0"
                          : "inset-ring inset-ring-line-2 group-hover:inset-ring-ink after:rotate-90",
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                {/* Height animates with the grid-rows trick; `invisible` keeps closed answers out of the tab order. */}
                <div
                  className={cx(
                    "grid [transition:grid-template-rows_0.45s_var(--ease-out)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                  id={`faq-${i}`}
                  role="region"
                >
                  <div className={cx("overflow-hidden [transition:visibility_0.45s]", isOpen ? "visible" : "invisible")}>
                    <p className="max-w-[600px] pb-7 text-[16.5px] leading-[1.55] tracking-[-0.008em] text-pretty text-ink-3">
                      {item.a}
                    </p>
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
    <section className="pb-[clamp(16px,2vw,24px)]" id="waitlist">
      <div className={shell}>
        <Reveal className="grid justify-items-center gap-6 rounded-4xl bg-green px-[clamp(20px,4vw,48px)] pt-[clamp(64px,9vw,128px)] pb-[clamp(56px,8vw,112px)] text-center text-ink max-[520px]:rounded-[22px]">
          <h2 className="max-w-[1000px] font-display text-[clamp(48px,9.4vw,136px)] leading-[0.9] font-bold tracking-[-0.028em] text-balance">
            Put your people online.
          </h2>
          <p className="mb-2 max-w-[520px] text-[clamp(17px,1.6vw,21px)] leading-[1.45] tracking-[-0.014em] text-pretty text-ink/78">
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
    <footer className="pt-7 pb-9">
      <div className={cx(shell, "flex items-center justify-between gap-4 text-[14px] tracking-[-0.006em] text-ink-3")}>
        <a href="#top" className="inline-flex rounded-lg text-ink" aria-label="OneByte home">
          <Logo />
        </a>
        <span>© {new Date().getFullYear()} OneByte</span>
      </div>
    </footer>
  );
}
