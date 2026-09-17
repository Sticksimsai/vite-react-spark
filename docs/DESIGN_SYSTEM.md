# CULT FUN design system

All tokens and component classes are defined in `src/index.css`. This is the reference for using them.

## Tokens (`:root`)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#fcfcf4` | page background (cream) |
| `--paper` | `#fffef9` | cards, inputs |
| `--blush` / `--blush-strong` | `#ffeceb` / `#ffdcd9` | tinted fills, hover states |
| `--line` / `--line-strong` | `#f1dcd6` / `#e8c5bd` | hairlines, borders |
| `--text` / `--text-soft` / `--muted` / `--faint` | `#231414` … `#b59a96` | text hierarchy |
| `--accent` / `--accent-deep` / `--accent-ink` | `#fe3b49` / `#e2293a` / `#b81f2c` | coral CTA, hover, coral text on cream |
| `--on-accent` | `#fffaf2` | text on coral |
| `--positive` / `--negative` | `#1f9a5a` / `#c73a2b` | gains / losses (light surfaces) |
| `--radius` / `--radius-sm` / `--radius-pill` | 14px / 9px / 999px | corners |
| `--halftone` | radial-gradient dots | texture via `background-image` |

Dark "ink" palette, scoped to `.pulse-page` (and reused by `.ticker`): `--ink #120e0e`, `--ink-2`, `--ink-3`, `--ink-line #2a2121`, `--ink-text #f6f1e8`, `--ink-muted`, `--ink-faint`, `--up #7dff9f`, `--down #ff7b6f`, `--amber #ffb347`.

## Type
- `--sans` Instrument Sans: body, hero headline (700, tight tracking), board tickers (700 uppercase).
- `--mono` IBM Plex Mono: nav, buttons, labels, numbers, table cells. Micro-labels are 9–11px uppercase with `.06–.14em` tracking.
- `--display` Fredoka: soft headings (`h1–h3` default). The pulse page overrides its `h1` to sans uppercase.

## Layout
`main` is max 1344px with 48px side padding (30px ≤1200, 20px ≤760). Header 84px sticky. Breakpoints: 1500 / 1200 / 980 / 760 / 390.

## Components (class → what it is)
- **Buttons:** `.button` (outline pill) · `.button.primary` (coral) · `.button.subtle` (blush) · `.button.text-button` · `.button.large` · `.button.full` · `.icon-button`
- **Text:** `.eyebrow` (mono micro-label) · `.fine` (mono 11px muted) · `.muted` · `.positive` · `.negative` · `.tag` (pill chip)
- **Surfaces:** `.panel` + `.panel-heading` + `.panel-body` · `.notice` (blush info box) · `.empty-state` · `.stats-grid` + `.stat` · `.data-table` inside `.panel.table-wrap` · `.modal` + `.modal-overlay`
- **Forms:** `input, textarea, select` styled globally · `.field-label` · `.form-row` · `.input-unit` · `.amount-presets` · `.segmented` (pill toggle, `.selected`) · `.search-input` · `.upload-box`
- **Page scaffolding:** `.page-heading` (eyebrow + h1 + description + right slot) · `.section-heading` · `.two-columns` · `.detail-layout` · `.launch-layout` + `.launch-aside`
- **Home:** `.poster` (hero) + `.sticker` · `.flow` + `.flow-bar` + `.seg-a…d` · `.ledger-strip` · `.steps` + `.step-num` · `.cta-band`
- **Coins:** `.coin-art` (+ colour class + `.art-small` + `.has-image`) · `.fee-split` + `.fee-row`
- **Pulse board:** `.pulse-page` › `.pulse-top` · `.pulse-status` · `.pulse-board` › `.lane.lane-{new|nearly|graduated}` › `.lane-head`, `.lane-list` › `.pulse-row` (`.is-fresh`) with `.pulse-avatar` + `.pulse-ring`, `.pulse-body`, `.pulse-progress`, `.pulse-nums`, `.spark`, `.pulse-quick`
- **Ticker:** `.ticker.is-live|is-demo` › `.ticker-label`, `.ticker-viewport`, `.ticker-track` › `.ticker-item`
- **Shell:** `.header`, `.desktop-nav`, `.mobile-nav`, `.preview-banner`, `.footer` (+ `.footer-top`, `.footer-columns`, `.footer-bottom`)

## Patterns
- Live vs example: components take `live` from `useLive()`; when false, render example data and label it ("example buys", "example figures").
- Lane colours: new = coral, nearly graduated = amber, graduated = green — carried by `--lane-glow` on each `.lane`.
- Gains/losses on dark surfaces use `--up`/`--down`, on cream use `--positive`/`--negative`.
- Hover reveals actions (`.pulse-quick`) rather than cluttering rows.
