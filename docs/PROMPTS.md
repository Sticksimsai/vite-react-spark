# Lovable prompt pack

Paste **LOVABLE_KNOWLEDGE.md** into the project's Knowledge first. Then use these prompts one at a time. Each starts with the same guardrail line so Lovable stays on-system.

> Guardrail (prefix every prompt): *"Follow the project Knowledge. Use the existing classes and CSS variables from `src/index.css`; no hard-coded colours, no re-theming with Tailwind colour utilities, keep the cream/coral site and the dark pulse board distinct, keep all 'example' labels, and keep it working at 390px."*

---

## 0. First run (after import)
```
Follow the project Knowledge. Run the app and confirm every route renders: /, /discover, /coin/cult, /launch, /wallet, /analytics, /rounds, /docs, /status. Don't change any design. Then set the Discover page to open on the "examples" data source by default (flip the initial useState in src/pages/Discover.tsx) so the board is populated while VITE_API_BASE is not configured.
```

## 1. Quick-buy modal on the pulse board
```
<guardrail> On the pulse board, clicking the quick-buy chip (.pulse-quick) should open a compact buy modal instead of navigating. Use the existing Modal component and .modal styles. Contents: coin avatar + name, an amount input with the .input-unit + .amount-presets pattern (0.01 / 0.05 / 0.1 ETH), an "execution quote" row that reads "not available yet", and a primary button "review buy" that, for now, shows a .notice explaining that trades submit through the backend with a reviewed wallet transaction. Keep the row's Link navigation for clicks anywhere else on the row. Do not change PulseBoard's styles; add only what the modal needs.
```

## 2. Wire the launch form to the backend
```
<guardrail> Wire src/pages/Launch.tsx to the backend. On "review launch", POST to api('/api/beta/quote') with { name, symbol, description, firstBuy } and show the returned quote in the review modal (fields: fee, minimum output, gas estimate — read them from the response shape and display any that exist as a .review-list). If the request fails, show the error in .error and keep the draft. Add a "connect wallet" step using window.ethereum.request({ method: 'eth_requestAccounts' }) before submitting; show the short address in the review. Do not implement the transaction send yet — leave a clearly labelled TODO where the wallet signature goes.
```

## 3. Live sparklines on the board
```
<guardrail> The backend will add GET /api/beta/history?token=0x… returning { points: number[] } (recent prices, oldest first). In src/pages/Discover.tsx, for live rows, fetch that per coin with useLive (poll every 15s) and pass the result as `spark` so the existing Sparkline renders. Add a `useCoinHistory(token)` hook in src/lib/api.ts. If the endpoint 404s, leave spark undefined (no sparkline) — don't fall back to the seeded example series for live coins.
```

## 4. Coin page for live coins: trade panel
```
<guardrail> On /coin/:id when id is a 0x address (LiveCoin in src/pages/Coin.tsx), add the same trade aside used by example coins (buy/sell tabs, amount input, presets) using the existing .panel / .trade-tabs / .input-unit classes. The "you receive" row should call api('/api/beta/quote') with { token, side, amount } and display the quote or "not available yet". Keep the existing stats grid and progress section.
```

## 5. Watchlist (local only)
```
<guardrail> Add a star toggle to each .pulse-row (top-right, 14px lucide Star, coral when active) that saves the coin id in localStorage under "cult.watchlist". Add a fourth sort option "watching" to each lane that shows only starred coins. Persist across reloads. No backend calls.
```

## 6. Coin page: holders + recent trades tables
```
<guardrail> On the example coin page (/coin/cult etc.) add two .panel sections below the chart: "Top holders" (table: rank, short address, balance, share %, weighted-time badge) and "Recent trades" (table: time, side buy/sell, amount ETH, wallet). Use src/lib/demo.ts to add deterministic example data for each coin (seed from coin id) and label both tables "example data". Use .data-table inside .panel.table-wrap.
```

## 7. Mobile polish pass
```
<guardrail> Do a mobile-only pass at 390px width. Check: header (wordmark + wallet + menu), preview banner, ticker, home poster, flow bar (segments must still show their %), the pulse board horizontal snap-scroll, coin page stats grid (3 columns), launch form (single column), footer columns (2). Fix any overflow or overlap using media queries in src/index.css. Don't change desktop.
```

## 8. Empty / loading / error states
```
<guardrail> Audit every page for the three states: backend loading, backend error, and empty data. Use .notice for status text, .empty-state for empties (with the mark image), and a subtle skeleton (blush blocks, 1.5px line borders) for loading rows on the pulse board — 3 skeleton rows per lane. Keep the example-data fallback behaviour.
```

## 9. Share cards
```
<guardrail> Add a "share" icon button to the coin page header that copies a link and shows "copied" for 1.5s (use the existing CopyButton pattern: Copy → Check icons). Also add Open Graph meta tags per coin using a small useDocumentMeta hook (title, description, og:image = coin image or /brand/mark.png).
```

## 10. Creator profile pages
```
<guardrail> Add route /creator/:handle. Page heading "@handle" with an eyebrow "creator", a .stats-grid (coins launched, total rewarded to holders, graduated count, creator earnings — example values from demo.ts filtered by creator), and a list of that creator's coins using PulseBoard with the rows filtered to that creator (all three lanes). Link creator handles on the pulse board (.pulse-creator) to this page.
```

---

## Tips for working with Lovable on this codebase
- If Lovable proposes replacing `src/index.css` with Tailwind or shadcn, decline — that CSS is the design.
- Ask for one page or one component per prompt; the board and the shell are the two files most worth protecting.
- When something looks off, say which class it should use (see DESIGN_SYSTEM.md) — Lovable follows class names well.
- Screenshots of the Next.js version live in the design handoff (home, pulse, ticker). Attach one when asking for a visual match.
