# CULT FUN — web frontend

The CULT FUN launchpad UI as a standalone **Vite + React 19 + TypeScript + Tailwind v4** app, laid out the way Lovable expects (`src/pages`, `src/components`, `src/lib`, `@/` alias, dev server on port 8080).

It talks to the existing CULT backend (the Next.js app in the `Cult-site` monorepo, which serves `/api/beta/*`) and falls back to labelled example data whenever that backend is unreachable, so the UI always renders.

## Run locally

```sh
npm install
cp .env.example .env      # set VITE_API_BASE to your backend
npm run dev               # http://localhost:8080
npm run build             # production build in dist/
```

## Import into Lovable

1. Push this folder to a GitHub repo.
2. In Lovable, create a project from that repo (GitHub import). Lovable detects the Vite config and runs `npm run dev`.
3. In Lovable's project settings, add the environment variable `VITE_API_BASE` (see below).
4. Iterate in Lovable. The design system lives in `src/index.css`; new components can use those classes or Tailwind utilities.

## Connecting to the backend

Set `VITE_API_BASE` to the origin of the running CULT backend, e.g. `http://127.0.0.1:4317` locally or `https://beta.yourdomain.com` once hosted. Leave it empty to use same-origin (if you proxy the API under the same host).

On the backend, allow this frontend's origin(s):

```sh
CULT_CORS_ORIGINS=http://localhost:8080,https://your-app.lovable.app npm run dev
```

(`apps/web/proxy.ts` and `next.config.ts` in the monorepo handle the CORS headers and preflight.)

### Endpoints used

| Endpoint | Used by | Notes |
|---|---|---|
| `GET /api/beta/state` | Discover board, coin pages, wallet | `?token=` filters to one coin, `?account=` adds `balance`/`credit` per coin. Includes `graduationThreshold`. |
| `GET /api/beta/buys` | Buy ticker | Latest confirmed curve + pool buys. |
| `GET /api/beta/analytics` | Home stats, Numbers page | Totals, per-coin metrics, daily timeline. |
| `GET /api/beta/ledger` | Rounds page | Published payout rounds. |
| `POST /api/beta/quote` | *(not wired yet)* | Launch + trade quotes; requires a wallet transaction the user reviews. |

All amounts are wei strings; format with `eth()` from `src/lib/format.ts`.

## Docs for Lovable

- `docs/LOVABLE_KNOWLEDGE.md` — paste into Lovable › Project Settings › Knowledge.
- `docs/DESIGN_SYSTEM.md` — tokens and component classes.
- `docs/PROMPTS.md` — ready-to-paste prompts for the next features.

## Project map

```
src/
  App.tsx              routes
  index.css            design tokens + every component style (source of truth)
  components/
    Shell.tsx          header, status strip, buy ticker, footer, wallet modal
    BuyTicker.tsx      scrolling live-buys marquee (live or example feed)
    PulseBoard.tsx     three-lane discover board (new / nearly graduated / graduated)
    Chart.tsx          illustrative chart for example coins
    Modal.tsx          minimal dialog
    ui.tsx             CoinArt, FeeSplit, PageHeading, SectionHeading, Stat, EmptyState
  pages/               Home, Discover, Coin, Launch, Rewards, Numbers, Rounds, Docs, Status, Terms, Privacy, NotFound
  lib/
    api.ts             API base, types, useLive() polling hook
    demo.ts            example coins + rounds (with /demo/*.svg mascots)
    format.ts          eth() and shortAddr()
public/
  brand/               wordmark.png, mark.png
  demo/                example-coin mascots (original SVGs)
```

## Design tokens

Defined at the top of `src/index.css` as CSS variables: cream `--bg #fcfcf4`, coral `--accent #fe3b49`, ink text `#231414`, plus the dark "pulse" palette scoped to `.pulse-page`. Fonts: Instrument Sans (body/headlines), IBM Plex Mono (labels/numbers), Fredoka (soft display headings).

## What's intentionally not here yet

- **Submitting launches and trades.** The launch form saves a draft and shows the review; the actual transaction goes through the backend's `/api/beta/quote` and a reviewed wallet signature. The Next app's `app/launch/page.tsx` and `components/beta-workbench.tsx` show the full flow to port when you're ready.
- **Real sparklines and 24h stats for live coins.** The indexer doesn't expose trade history per coin yet; example coins use seeded illustrative series.
- Operator, lab and beta-workbench pages (backend-operator tooling) stay in the Next app.
