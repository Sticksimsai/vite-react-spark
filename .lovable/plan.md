# Add the coin cult roster

## What will change
- Add a deterministic example cult-data generator for every coin id, including membership badges, holdings, rewards, PnL, holding duration, and suitable existing mascot avatars.
- Add a “the $SYMBOL cult” section below the chart on example coin pages, with member/all-holder filtering and a clearly visible “example data” label.
- Pin the signed-in holder first with a “you” tag; otherwise show a compact “join the cult” action that opens the existing trading availability modal.
- Add focused styles for the row list, holding bars, avatar treatment, and two-line layout at 390px without changing the surrounding design.

## Technical details
- Read linked wallet addresses from the existing `useMember()` hook and match addresses case-insensitively.
- Keep unknown PnL as “—” and derive all sample values deterministically from the coin id.
- Reuse `.panel`, `.segmented`, `.tag`, `.horizontal-track`, `.positive`, `.negative`, `.button.primary`, and `.pulse-letter` patterns.
- Verify the coin page at desktop and 390px widths, including filtering and modal opening.
