import { useState, type CSSProperties } from "react";
import { ByteMeter } from "./Console";
import { Icon, Reveal, type IconName } from "./primitives";
import "./Products.css";

/* ---------------- Illustrations ---------------- */

const team = [
  { initials: "AO", name: "Adaeze Okafor", used: 14.2, limit: 20 },
  { initials: "TB", name: "Tunde Bakare", used: 9.6, limit: 10 },
  { initials: "IN", name: "Ifeoma Nwosu", used: 6.1, limit: 15 },
  { initials: "ZY", name: "Zainab Yusuf", used: 3.4, limit: 10 },
];

function TeamsArt() {
  return (
    <div className="art art--teams" aria-hidden="true">
      <div className="art__card">
        <header>
          <strong>Engineering</strong>
          <span className="num">4 of 38 people</span>
        </header>
        <ul>
          {team.map((person) => (
            <li key={person.name}>
              <i>{person.initials}</i>
              <span>{person.name}</span>
              <ByteMeter ratio={person.used / person.limit} tone={person.used / person.limit > 0.9 ? "amber" : "green"} />
              <em className="num">
                {person.used.toFixed(1)} / {person.limit} GB
              </em>
            </li>
          ))}
        </ul>
      </div>
      <div className="art__chip">
        <Icon name="users" size={15} />
        One pool. One bill.
      </div>
    </div>
  );
}

function RewardsArt() {
  return (
    <div className="art art--rewards" aria-hidden="true">
      <div className="notif notif--back">
        <span className="notif__icon">
          <Icon name="gift" size={16} />
        </span>
        <div>
          <strong>Referral bonus</strong>
          <p>500 MB added for inviting a friend.</p>
        </div>
      </div>
      <div className="notif">
        <span className="notif__icon">
          <Icon name="gift" size={16} />
        </span>
        <div>
          <strong>
            Meridian Pay <em>now</em>
          </strong>
          <p>You've earned 2 GB of internet, on us. Use it anywhere online.</p>
        </div>
      </div>
      <div className="campaign">
        <div>
          <span>Campaign</span>
          <strong>Sign-up reward</strong>
        </div>
        <div>
          <span>Per customer</span>
          <strong className="num">2 GB</strong>
        </div>
        <div>
          <span>Status</span>
          <strong className="campaign__live">
            <i />
            Running
          </strong>
        </div>
      </div>
    </div>
  );
}

function TollFreeArt() {
  return (
    <div className="art art--tollfree" aria-hidden="true">
      <div className="browser">
        <div className="browser__bar">
          <i />
          <i />
          <i />
          <span>app.yourbrand.com</span>
        </div>
        <div className="browser__body">
          <span className="browser__line" style={{ width: "46%" }} />
          <span className="browser__line" style={{ width: "72%" }} />
          <span className="browser__line" style={{ width: "58%" }} />
          <div className="browser__meter">
            <div>
              <span>Charged to your customer</span>
              <strong className="num">0.0 MB</strong>
            </div>
            <span className="tag tag--green">Sponsored</span>
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

  return (
    <div className="art art--white" style={{ "--brand": brand.color } as CSSProperties}>
      <div className="plan" aria-hidden="true">
        <header>
          <span className="plan__logo">{brand.name[0]}</span>
          <strong>{brand.name} Internet</strong>
          <Icon name="signal" size={16} />
        </header>
        <div className="plan__body">
          <span>Data balance</span>
          <strong className="num">
            12.4 <small>GB</small>
          </strong>
          <ByteMeter ratio={0.62} tone="ink" />
        </div>
        <div className="plan__cta">Buy more data</div>
      </div>
      <div className="swatches">
        <span>Your brand</span>
        <div role="radiogroup" aria-label="Preview a brand">
          {brands.map((item, i) => (
            <button
              key={item.name}
              type="button"
              role="radio"
              aria-checked={i === index}
              aria-label={item.name}
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
    <section className="section products" id="products">
      <div className="shell">
        <Reveal className="section-head">
          <h2 className="h2">
            Four ways to say <em>“this one's on us.”</em>
          </h2>
        </Reveal>

        <div className="bento">
          <Reveal as="article" className="bento__card bento__card--teams">
            <div className="bento__copy">
              <span className="bento__label">OneByte Teams</span>
              <h3>For the people who work for you.</h3>
              <p>
                Swap fixed data allowances for a shared pool. Add your team, set their limits, and stop hearing about
                bundles on Monday mornings.
              </p>
            </div>
            <TeamsArt />
          </Reveal>

          <Reveal as="article" className="bento__card bento__card--rewards night" delay={80}>
            <div className="bento__copy">
              <span className="bento__label">OneByte Rewards</span>
              <h3>For the customers who choose you.</h3>
              <p>
                Thank them with something they'll actually use. Sponsor real internet for sign-ups, loyalty and
                referrals. Not one zero-rated link, but the whole web, within the limits you set.
              </p>
            </div>
            <RewardsArt />
          </Reveal>

          <Reveal as="article" className="bento__card bento__card--tollfree">
            <div className="bento__copy">
              <span className="bento__label">OneByte Toll-Free</span>
              <h3>Your app, free to open.</h3>
              <p>Nobody should have to check their balance before opening your app. Cover the data it uses.</p>
              <span className="bento__foot">Available by operator arrangement</span>
            </div>
            <TollFreeArt />
          </Reveal>

          <Reveal as="article" className="bento__card bento__card--white" delay={80}>
            <div className="bento__copy">
              <span className="bento__label">OneByte White Label</span>
              <h3>Internet with your name on it.</h3>
              <p>
                Offer connectivity under your own brand, at your own prices. Sponsor it or resell it. We run everything
                underneath.
              </p>
            </div>
            <WhiteLabelArt />
          </Reveal>
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

export function Control() {
  return (
    <section className="section control">
      <div className="shell">
        <Reveal className="section-head">
          <h2 className="h2">
            You stay in charge. <em>Every byte accounted for.</em>
          </h2>
        </Reveal>

        <ul className="control__grid">
          {controls.map((item, i) => (
            <Reveal as="li" key={item.title} delay={(i % 3) * 70}>
              <span className="control__icon">
                <Icon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
