import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Repeat2, Zap, Flame, Rocket, Crown, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { CoinArt } from './ui';
import type { Coin } from '@/lib/demo';
import { compact } from '@/lib/demo';

/** One normalised row for the board, whether it came from demo data or the live indexer. */
export type PulseRow = {
  id: string;
  href: string;
  name: string;
  symbol: string;
  art?: Coin;            // demo art; live coins render a lettermark instead
  age: string;
  fresh?: boolean;       // launched very recently → glows in the New lane
  creator?: string;
  holders?: number;
  txs?: number;
  volume?: number;
  cap?: number;
  change?: number;
  spark?: number[];      // optional tiny price/activity series for the sparkline
  rewarded: string;      // formatted, e.g. "$1.2K" or "0.42 ETH"
  reward: string;        // asset paid to holders
  progress: number;      // 0–100 bonding progress
  graduated: boolean;
  rounds?: number;       // published payout rounds (graduated lane)
  route?: string;        // live route label (curve / pending-pool / pool)
  tag?: string;
  order: number;         // newest-first sort key
};

type LaneKey = 'new' | 'nearly' | 'graduated';
type Lane = { key: LaneKey; title: string; blurb: string; icon: typeof Flame; filter: (r: PulseRow) => boolean; sorts: [string, string][] };

const lanes: Lane[] = [
  { key: 'new', title: 'New cults', blurb: 'fresh on the curve · under 50%', icon: Flame, filter: r => !r.graduated && r.progress < 50, sorts: [['new', 'new'], ['cap', 'mcap'], ['hot', 'holders']] },
  { key: 'nearly', title: 'Nearly graduated', blurb: '50%+ bonded · closing on the pool', icon: Rocket, filter: r => !r.graduated && r.progress >= 50, sorts: [['prog', 'closest'], ['cap', 'mcap'], ['new', 'new']] },
  { key: 'graduated', title: 'Graduated', blurb: 'on the pool · paying holders', icon: Crown, filter: r => r.graduated, sorts: [['cap', 'mcap'], ['paid', 'rewarded'], ['new', 'new']] },
];

function sortRows(rows: PulseRow[], key: string) {
  const s = [...rows];
  const num = (v: string) => parseFloat(v.replace(/[^0-9.]/g, '')) * (v.includes('K') ? 1e3 : v.includes('M') ? 1e6 : 1);
  switch (key) {
    case 'cap': return s.sort((a, b) => (b.cap ?? 0) - (a.cap ?? 0));
    case 'hot': return s.sort((a, b) => (b.holders ?? 0) - (a.holders ?? 0));
    case 'prog': return s.sort((a, b) => b.progress - a.progress);
    case 'paid': return s.sort((a, b) => num(b.rewarded) - num(a.rewarded));
    default: return s.sort((a, b) => b.order - a.order);
  }
}

function Sparkline({ points, up }: { points: number[]; up: boolean }) {
  const w = 72, h = 26;
  const min = Math.min(...points), max = Math.max(...points), span = max - min || 1;
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${(i / (points.length - 1)) * w},${h - 2 - ((p - min) / span) * (h - 4)}`).join(' ');
  return <svg className={`spark ${up ? 'up' : 'down'}`} viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
    <path d={`${d} L${w},${h} L0,${h} Z`} className="spark-fill"/>
    <path d={d} className="spark-line" vectorEffect="non-scaling-stroke"/>
  </svg>;
}

function LaneColumn({ lane, rows, quick }: { lane: Lane; rows: PulseRow[]; quick: string }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState(lane.sorts[0][0]);
  const shown = useMemo(() => sortRows(rows.filter(r => (r.name + ' ' + r.symbol + ' ' + r.id).toLowerCase().includes(q.toLowerCase())), sort), [rows, q, sort]);
  const Icon = lane.icon;
  return <section className={`lane lane-${lane.key}`} aria-label={lane.title}>
    <header className="lane-head">
      <div className="lane-title">
        <span className="lane-icon"><Icon size={13}/></span>
        <h2>{lane.title}</h2>
        {lane.key === 'new' && <span className="lane-live"><i/>live</span>}
        <span className="lane-count">{shown.length}</span>
      </div>
      <p className="lane-blurb">{lane.blurb}</p>
      <div className="lane-tools">
        <label className="lane-search"><Search size={12}/><input aria-label={`Search ${lane.title}`} placeholder="ticker / name" value={q} onChange={e => setQ(e.target.value)}/></label>
        <div className="lane-sort" role="group" aria-label={`Sort ${lane.title}`}>{lane.sorts.map(([k, l]) => <button key={k} className={sort === k ? 'selected' : ''} aria-pressed={sort === k} onClick={() => setSort(k)}>{l}</button>)}</div>
      </div>
    </header>
    <div className="lane-list">
      {shown.length ? shown.map((r, i) => <PulseRowView key={r.id} row={r} lane={lane.key} quick={quick} index={i}/>) : <p className="lane-empty">nothing here yet</p>}
    </div>
  </section>;
}

function PulseRowView({ row, lane, quick, index }: { row: PulseRow; lane: LaneKey; quick: string; index: number }) {
  const up = (row.change ?? 0) >= 0;
  return <Link className={`pulse-row ${row.fresh && lane === 'new' ? 'is-fresh' : ''}`} to={row.href} style={{ animationDelay: `${index * 40}ms` }}>
    <div className="pulse-avatar">
      {row.art ? <CoinArt coin={row.art} small/> : <span className="pulse-letter" aria-hidden="true">{row.symbol.slice(0, 3)}</span>}
      {!row.graduated && <i className="pulse-ring" style={{ ['--p' as string]: row.progress + '%' }} aria-hidden="true"/>}
      {row.graduated && <span className="pulse-check" aria-hidden="true"><CheckCircle2 size={14}/></span>}
    </div>
    <div className="pulse-body">
      <div className="pulse-name"><strong>{row.symbol}</strong><span>{row.name}</span>{row.tag && <em className="pulse-tag">{row.tag}</em>}</div>
      <div className="pulse-meta">
        <span className="pulse-age">{row.age}</span>
        {row.creator && <span className="pulse-creator">{row.creator}</span>}
        {row.holders !== undefined && <span><Users size={11}/>{row.holders.toLocaleString()}</span>}
        {row.txs !== undefined && <span><Repeat2 size={11}/>{row.txs.toLocaleString()}</span>}
        {row.route && <span className="pulse-route">{row.route}</span>}
      </div>
      <div className="pulse-flags">
        <span className="pulse-pays">pays {row.reward}</span>
        <span className="pulse-paid"><b>{row.rewarded}</b> to holders</span>
        {lane === 'graduated' && row.rounds !== undefined && <span className="pulse-rounds">{row.rounds} rounds</span>}
      </div>
      {lane !== 'graduated' && <div className="pulse-progress" aria-label={`${row.progress}% bonded`}><i style={{ width: row.progress + '%' }}/><b>{row.progress}%</b><small>{lane === 'nearly' ? 'to pool' : 'bonded'}</small></div>}
    </div>
    <div className="pulse-nums">
      {row.spark && <Sparkline points={row.spark} up={up}/>}
      {row.cap !== undefined && <span className="pulse-mc">{compact(row.cap)}<small>mc</small></span>}
      {row.change !== undefined && <span className={`pulse-change ${up ? 'positive' : 'negative'}`}>{up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}{Math.abs(row.change)}%</span>}
      {row.volume !== undefined && <span className="pulse-v">{compact(row.volume)}<small>vol</small></span>}
    </div>
    <span className="pulse-quick"><Zap size={11}/>{quick}</span>
  </Link>;
}

export function PulseBoard({ rows, quick = '0.01 ETH' }: { rows: PulseRow[]; quick?: string }) {
  return <div className="pulse-board">
    {lanes.map(l => <LaneColumn key={l.key} lane={l} rows={rows.filter(l.filter)} quick={quick}/>)}
  </div>;
}
