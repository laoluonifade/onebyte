# OneByte

**Internet, on your business.**

Interactive product prototype for OneByte — a B2B internet connectivity infrastructure startup launching in Nigeria.

## What is OneByte?

OneByte enables businesses to provide internet access to employees and customers without managing telecom infrastructure.

- Buy mobile data in bulk from operators (MTN, Glo, Airtel, 9mobile)
- Businesses connect users to shared data pools
- Pay only for actual consumption
- **Free setup. Usage-based billing.**

### Products

1. **OneByte Teams** — Sponsor employee internet with shared pools, limits, and dashboards
2. **OneByte Rewards** — Fintechs/brands sponsor internet access for customers
3. **OneByte Toll-Free** — Zero-rate your apps and websites
4. **OneByte White Label** — Launch a branded internet service on OneByte rails

## Repository layout

This is an npm workspaces monorepo.

```
apps/
  landing/        Marketing site (React + TypeScript + Vite + Tailwind CSS v4)
packages/         Shared packages (none yet)
```

```bash
npm install        # once, at the repo root
npm run dev        # landing page dev server
npm run build      # type-check and build to apps/landing/dist
npm run preview    # serve the production build locally
```

To run a script in one app directly: `npm run <script> --workspace @onebyte/landing`.

## Landing page (`apps/landing`)

A static site. The build output in `apps/landing/dist` can be served by any static host.

### Styling

Everything is styled with Tailwind utility classes. There are no component stylesheets.

- `src/styles/index.css` — the only CSS file: Tailwind import, design tokens (`@theme`: colours, fonts, shadows, easing, named animations), the `night:` variant for dark sections, and a few global element defaults (focus ring, reduced motion)
- `src/lib/ui.ts` — class recipes shared by more than one component (container, section rhythm, headings, buttons, tags)
- `index.html` — page-level classes on `<html>` and `<body>` (font, colours, selection, smooth scrolling)

### Components

- `src/components/primitives.tsx` — `ByteMark` logo, `ByteMeter`, `Reveal` scroll animation, icon set
- One file per page section in `src/components/`:
  `Nav`, `Hero` + `Console` (live dashboard mock), `Problem` (the standup story + cost comparison), `HowItWorks`, `Products` (product cards + dashboard features), `Pricing` (estimator), `Developers` (API preview + vision), `Closing` (FAQ, waitlist panel, footer), `Waitlist` (shared email form)

### Notes

- All dashboard figures are illustrative mock data. They are internally consistent (spend = usage × rate).
- There is no sign-in yet: every call to action joins the waitlist. The waitlist form (`Waitlist.tsx`) only confirms in the UI; it is not connected to a backend yet.
- Pricing shown is indicative, and the developer API is presented as a preview.
- Headlines are set in Bricolage Grotesque, body and UI in Geist. Geist has no naira sign, so `₦` alone is loaded from Inter (see the `@font-face` at the top of `index.css`).
- The look is deliberately flat: pure white page, solid colour panels, no gradients.

## Deploying

The landing page is hosted as static files on the Hetzner server, served by Caddy.

```bash
npm run deploy     # builds, then uploads apps/landing/dist to hetzner:/var/www/onebyte
```

This uses the `hetzner` SSH alias from `~/.ssh/config`. Override with `DEPLOY_HOST` and `DEPLOY_DIR` if needed. The upload mirrors the build folder, so files from older builds are removed.

## License

Proprietary — All rights reserved.
