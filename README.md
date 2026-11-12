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

## Landing page

The marketing site is a React + TypeScript app built with Vite.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check and build to dist/
```

### Structure

- `src/styles/base.css` — design tokens (colour, type, radii, motion), reset, buttons and shared primitives
- `src/components/primitives.tsx` — `ByteMark` logo, `Reveal` scroll animation, icon set
- `src/components/` — one file per page section, each with its own stylesheet:
  `Nav`, `Hero` + `Console` (live dashboard mock), `Problem` (the standup story + cost comparison), `HowItWorks`, `Products` (product cards + dashboard features), `Pricing` (estimator), `Developers` (API preview + vision), `Closing` (FAQ, waitlist panel, footer), `Waitlist` (shared email form)

### Notes

- All dashboard figures are illustrative mock data. They are internally consistent (spend = usage × rate).
- There is no sign-in yet: every call to action joins the waitlist. The waitlist form (`Waitlist.tsx`) only confirms in the UI; it is not connected to a backend yet.
- Pricing shown is indicative, and the developer API is presented as a preview.
- Headlines are set in Bricolage Grotesque, body and UI in Geist. Geist has no naira sign, so `₦` alone is loaded from Inter (see the `@font-face` at the top of `base.css`).
- The look is deliberately flat: pure white page, solid colour panels, no gradients.

## License

Proprietary — All rights reserved.
