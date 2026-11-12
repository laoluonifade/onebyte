import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../lib/hooks";
import { Icon, Reveal } from "./primitives";
import "./Developers.css";

/* Tiny token helpers so the samples stay readable as JSX. */
const K = ({ children }: { children: ReactNode }) => <span className="t-k">{children}</span>;
const S = ({ children }: { children: ReactNode }) => <span className="t-s">{children}</span>;
const N = ({ children }: { children: ReactNode }) => <span className="t-n">{children}</span>;
const C = ({ children }: { children: ReactNode }) => <span className="t-c">{children}</span>;
const P = ({ children }: { children: ReactNode }) => <span className="t-p">{children}</span>;

/* Samples are kept to 36 columns so every line fits on a phone without scrolling or wrapping. */
const samples: { id: string; label: string; file: string; lines: ReactNode[] }[] = [
  {
    id: "sponsor",
    label: "Sponsor a user",
    file: "sponsor.ts",
    lines: [
      <>
        <K>import</K> OneByte <K>from</K> <S>"@onebyte/node"</S>;
      </>,
      <></>,
      <>
        <K>const</K> onebyte = <K>new</K> <P>OneByte</P>(apiKey);
      </>,
      <></>,
      <C>// Give a customer 2 GB of internet</C>,
      <>
        <K>await</K> onebyte.sponsorships.<P>create</P>({"{"}
      </>,
      <>
        {"  "}msisdn: <S>"+2348050001234"</S>,
      </>,
      <>
        {"  "}network: <S>"glo"</S>,
      </>,
      <>
        {"  "}limit: {"{"} amount: <N>2</N>, unit: <S>"GB"</S> {"}"},
      </>,
      <>
        {"  "}reference: <S>"signup-reward"</S>,
      </>,
      <>{"}"});</>,
    ],
  },
  {
    id: "limits",
    label: "Set a limit",
    file: "limits.ts",
    lines: [
      <C>// Cap one person...</C>,
      <>
        <K>await</K> onebyte.users.<P>update</P>(userId, {"{"}
      </>,
      <>
        {"  "}limit: {"{"} amount: <N>20</N>, unit: <S>"GB"</S> {"}"},
      </>,
      <>{"}"});</>,
      <></>,
      <C>// ...and the whole company</C>,
      <>
        <K>await</K> onebyte.budget.<P>set</P>({"{"}
      </>,
      <>
        {"  "}amount: <N>1_500_000</N>,
      </>,
      <>
        {"  "}currency: <S>"NGN"</S>,
      </>,
      <>
        {"  "}period: <S>"month"</S>,
      </>,
      <>{"}"});</>,
    ],
  },
  {
    id: "webhook",
    label: "Usage webhook",
    file: "usage.recorded.json",
    lines: [
      <>{"{"}</>,
      <>
        {"  "}
        <P>"event"</P>: <S>"usage.recorded"</S>,
      </>,
      <>
        {"  "}
        <P>"data"</P>: {"{"}
      </>,
      <>
        {"    "}
        <P>"user"</P>: <S>"usr_8fk2"</S>,
      </>,
      <>
        {"    "}
        <P>"network"</P>: <S>"glo"</S>,
      </>,
      <>
        {"    "}
        <P>"consumed_gb"</P>: <N>0.2</N>,
      </>,
      <>
        {"    "}
        <P>"charged_ngn"</P>: <N>85.0</N>,
      </>,
      <>
        {"    "}
        <P>"wallet_balance_ngn"</P>: <N>1284415.0</N>
      </>,
      <>
        {"  "}
        {"}"}
      </>,
      <>{"}"}</>,
    ],
  },
];

const capabilities = [
  "Register users",
  "Sponsor access",
  "Spending limits",
  "Usage records",
  "Wallet balances",
  "Billing webhooks",
];

export function Developers() {
  const [active, setActive] = useState(0);
  const sample = samples[active];

  return (
    <section className="section developers night" id="developers" data-nav-dark>
      <div className="shell developers__grid">
        <Reveal className="developers__copy">
          <span className="eyebrow">For developers, coming soon</span>
          <h2 className="h2">
            Internet, <em>as an API.</em>
          </h2>
          <p className="lede">
            Soon you'll be able to register users, sponsor access and track consumption straight from your own product.
            The OneByte API is in development, and early access is open.
          </p>
          <ul className="developers__caps">
            {capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a href="#waitlist" className="btn btn--green">
            Request early access
            <Icon name="arrow" className="arrow" />
          </a>
        </Reveal>

        <Reveal className="code" delay={120}>
          <div className="code__tabs" role="tablist" aria-label="API examples">
            {samples.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`code-tab-${item.id}`}
                aria-selected={i === active}
                aria-controls="code-panel"
                onClick={() => setActive(i)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="code__file">
            <span className="mono">{sample.file}</span>
            <span className="code__badge">Preview · subject to change</span>
          </div>
          <pre className="code__body" id="code-panel" role="tabpanel" aria-labelledby={`code-tab-${sample.id}`} key={sample.id}>
            <code>
              {sample.lines.map((line, i) => (
                <span className="code__line" key={i} style={{ animationDelay: `${i * 22}ms` }}>
                  <i className="num">{i + 1}</i>
                  <span>{line}</span>
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
        </Reveal>
      </div>

      <Vision />
    </section>
  );
}

/* ------------------------------------------------------------------
   Vision — the statement lights up word by word as it scrolls past.
   ------------------------------------------------------------------ */

const statement =
  "Payment platforms made it simple for any company to move money. OneByte does the same for the internet. Any business should be able to provide it to anyone, without becoming a telecom company.";
const words = statement.split(" ");

const roadmap = [
  {
    phase: "Now",
    title: "Launch on Glo",
    body: "Teams and Rewards with the dashboard, wallet, limits and usage reporting.",
  },
  {
    phase: "Next",
    title: "More networks, more automation",
    body: "Additional mobile networks, automated activation and the developer API.",
  },
  {
    phase: "Then",
    title: "Connectivity as a platform",
    body: "White-label internet services and multi-network connectivity management.",
  },
];

function Vision() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (reduced) {
      setLit(words.length);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 45%.
      const start = viewport * 0.85;
      const end = viewport * 0.45 - rect.height;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setLit(Math.round(progress * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div className="shell vision">
      <span className="eyebrow">Where this is going</span>
      <p className="vision__statement" ref={ref} aria-label={statement}>
        {words.map((word, i) => (
          <span key={i} data-lit={i < lit || undefined} aria-hidden="true">
            {word}{" "}
          </span>
        ))}
      </p>

      <ol className="roadmap">
        {roadmap.map((item, i) => (
          <Reveal as="li" key={item.phase} delay={i * 80}>
            <span className="roadmap__phase" data-now={i === 0 || undefined}>
              {item.phase}
            </span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
