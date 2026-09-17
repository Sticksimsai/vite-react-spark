# CULT FUN — project knowledge (paste into Lovable › Project Settings › Knowledge)

## What this is
CULT FUN is a memecoin launchpad on Robinhood Chain where **holding is the point**: 50% of every coin's vault fees are paid back to holders in ETH, 20% to the creator, 20% to the platform, 10% to the $CULT community. The split is fixed at launch. Coins start on a bonding curve, graduate to a pool at a threshold, and holders are paid in published "rounds" on a public ledger. Currently a **local beta** (chain 31337, test ETH only, no mainnet).

## Stack
Vite + React 19 + TypeScript + Tailwind v4 + react-router-dom v7 + lucide-react + viem. No shadcn. No Next.js in this repo (the backend is a separate Next app).

## Non-negotiable rules
1. **`src/index.css` is the design system.** Colours, type, radii, every component style lives there as plain CSS classes with CSS variables. Reuse those classes for new UI. Tailwind utilities are fine for layout tweaks, but do not re-theme with Tailwind colour classes (`bg-red-500`, `text-gray-…`) — use the tokens.
2. **Never hard-code hex colours in components.** Use `var(--accent)`, `var(--text)`, etc. (see DESIGN_SYSTEM.md).
3. **Keep the two palettes distinct:** the site is cream + coral; the pulse board (`.pulse-page`) and the buy ticker are dark "ink". Don't make the rest of the site dark, and don't make the board light.
4. **Do not invent data.** Live numbers come from the backend via `useLive()` in `src/lib/api.ts`. If the backend is down, show the labelled example data (`src/lib/demo.ts`) — never fake "live".
5. **Amounts are wei strings.** Format with `eth()` from `src/lib/format.ts`; never `parseFloat` a wei string.
6. **Routing is react-router.** Use `<Link to>` / `useNavigate`, never `<a href>` for internal links, never `next/link`.
7. **Honest labelling.** Anything illustrative is labelled ("example", "illustrative", "sample"). Keep those labels.
8. Keep copy lowercase-casual for labels/nav ("start a coin", "my rewards"), sentence case for headlines, mono uppercase for micro-labels on the board.
9. No emojis in UI copy. Lucide icons only.
10. Mobile matters: every new section must work at 390px. The pulse board becomes a horizontal snap-scroll on phones.

## Brand
- Wordmark: `/brand/wordmark.png` (bubbly coral "CULT FUN"). Mark: `/brand/mark.png` (halftone C). Use as `<img>`; never re-draw the logo in CSS/SVG.
- Voice: playful, direct, a bit cheeky ("Got a cult in you?"), never corporate. Short sentences.
- Motion: subtle. Row entrance fade (rowin), pulsing live dots, marquee ticker, float on the hero mark. Respect `prefers-reduced-motion`.

## Data layer
- `VITE_API_BASE` env var = backend origin. `api(path)` builds URLs. `useLive<T>(path, ms)` polls and returns `{ data, error, live }`.
- Endpoints: `GET /api/beta/state` (coins; `?token=`, `?account=`), `GET /api/beta/buys`, `GET /api/beta/analytics`, `GET /api/beta/ledger`. `POST /api/beta/quote` exists for launches/trades but is not wired yet.
- Types live in `src/lib/api.ts`. Extend them there, don't redefine locally.

## Pages
`/` Home · `/discover` the pulse (three-lane board) · `/coin/:id` coin (example id or 0x address) · `/launch` start a coin · `/wallet` + `/wallet/:address` rewards · `/analytics` numbers · `/rounds` ledger · `/docs` how it works · `/status` roadmap · `/terms` · `/privacy`.

## Things that are intentionally unfinished
- Launch/trade submission (needs backend quote + wallet signature).
- Live sparklines / 24h change for live coins (indexer has no trade history endpoint yet).
- Operator tooling stays in the Next app.
