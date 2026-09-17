import { useMemo, useState } from 'react';
import { Link } from '@/lib/nav';
import { Plus, Radio } from 'lucide-react';
import { PulseBoard, type PulseRow } from '@/components/PulseBoard';
import { useLive, type StateResponse } from '@/lib/api';
import { eth } from '@/lib/format';
import { coins as demoCoins, compact } from '@/lib/demo';

function liveRows(c: StateResponse): PulseRow[] {
  const tip = c.health.checkpoint;
  return c.coins.map(coin => {
    const threshold = coin.graduationThreshold ? BigInt(coin.graduationThreshold) : 0n;
    const reserve = BigInt(coin.reserve);
    const progress = coin.graduated ? 100 : threshold > 0n ? Math.min(99, Number(reserve * 100n / threshold)) : 0;
    const blocks = Math.max(0, tip - coin.blockNumber);
    return { id: coin.token, href: `/coin/${coin.token}`, name: coin.name, symbol: coin.symbol, age: blocks === 0 ? 'now' : blocks + ' blk', fresh: blocks < 30, rewarded: eth(coin.paid) + ' ETH', reward: 'ETH', progress, graduated: coin.graduated, route: coin.route, order: coin.blockNumber };
  });
}

// Deterministic illustrative sparkline seeded from the coin id, trending with its 24h change.
function spark(id: string, change: number, n = 18) { let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; const out: number[] = []; let v = 50; for (let i = 0; i < n; i++) { h = (h * 1103515245 + 12345) >>> 0; v += ((h >>> 16) % 21 - 10) * 0.9 + change * 0.06; out.push(v); } return out; }
const isFresh = (age: string) => /m$/.test(age) || (/h$/.test(age) && parseInt(age) < 2);
const demoRows: PulseRow[] = demoCoins.map((c, i) => ({ id: c.id, href: `/coin/${c.id}`, name: c.name, symbol: c.symbol, art: c, age: c.age, fresh: isFresh(c.age), creator: c.creator, holders: c.holders, txs: c.txs, volume: c.volume, cap: c.cap, change: c.change, spark: spark(c.id, c.change), rewarded: compact(c.paid), reward: c.reward, progress: c.progress, graduated: c.progress === 100, rounds: c.progress === 100 ? Math.max(1, Math.round(c.paid / 900)) : undefined, tag: c.tag, order: demoCoins.length - i }));

export default function Discover() {
  const { data, error, live } = useLive<StateResponse>('/api/beta/state', 5000);
  const [examples, setExamples] = useState(false);
  const rows = useMemo(() => examples ? demoRows : live && data ? liveRows(data) : [], [examples, live, data]);
  const status = examples ? 'Example coins for design review. Nothing here is deployed.' : error ? 'Backend unavailable. ' + error : data ? data.health.stale ? 'Indexer is catching up. Trading stays disabled until it is current.' : `Live session ${data.sessionId.slice(0, 8)} · block ${data.health.checkpoint}` : 'Connecting to the indexer…';
  return <div className="pulse-page">
    <div className="pulse-top">
      <div><p className="eyebrow">the pulse · local chain</p><h1>Every cult, live.</h1></div>
      <div className="pulse-top-tools">
        <div className="segmented" aria-label="Data source"><button className={!examples ? 'selected' : ''} aria-pressed={!examples} onClick={() => setExamples(false)}>live coins</button><button className={examples ? 'selected' : ''} aria-pressed={examples} onClick={() => setExamples(true)}>examples</button></div>
        <Link to="/launch" className="button primary"><Plus size={14}/> start a coin</Link>
      </div>
    </div>
    <p className={`pulse-status ${error && !examples ? 'is-off' : ''}`} role="status"><Radio size={12}/>{status} <span>· test ETH only, no mainnet trading</span></p>
    <PulseBoard rows={rows}/>
    {!examples && !live && <p className="fine" style={{ marginTop: 14 }}>No backend reachable at <code>{import.meta.env.VITE_API_BASE || 'same origin'}</code>. Switch to <button className="link-button" onClick={() => setExamples(true)}>examples</button> to preview the board.</p>}
  </div>;
}
