import { useId, useState } from 'react';

/** Illustrative chart used on example coin pages. Replace with real series when the indexer exposes trade history. */
export function Chart({ label = 'rewards distributed', kind = 'rewards', wallet = false }: { label?: string; kind?: 'rewards' | 'price'; wallet?: boolean }) {
  const [period, setPeriod] = useState('7D');
  const id = useId().replaceAll(':', '');
  const points = Array.from({ length: 49 }, (_, i) => { const base = kind === 'rewards' ? 185 - i * 2.8 : 140 - i * 1.8; const wave = Math.sin(i * (period === '1D' ? .6 : period === '7D' ? .9 : 1.3)) * 13 + Math.cos(i * .7) * 9; return [i * 12.5, Math.max(15, kind === 'rewards' ? 185 - i * 2.8 + Math.sin(i * .4) * 2 : base + wave)]; });
  const path = points.map(([x, y], i) => `${i ? 'L' : 'M'} ${x} ${y}`).join(' ');
  return <div className="chart-panel">
    <div className="chart-top"><span className="eyebrow">{label}</span><div className="segmented" aria-label="Chart time period">{['1D', '7D', 'ALL'].map(p => <button key={p} className={period === p ? 'selected' : ''} aria-pressed={period === p} onClick={() => setPeriod(p)}>{p}</button>)}</div></div>
    <p className="chart-value">{kind === 'price' ? '$0.0001284' : wallet ? (period === '1D' ? '$12.84' : period === '7D' ? '$64.21' : '$128.42') : period === '1D' ? '$1,428' : period === '7D' ? '$8,420' : '$17,884'}</p>
    <p className="fine">{kind === 'price' ? 'Illustrative price in USD' : 'Illustrative cumulative rewards · USD'}</p>
    <svg className="chart-svg" viewBox="0 0 600 230" role="img" aria-label={`${period} illustrative ${label} chart. This is sample data, not market activity.`} preserveAspectRatio="none">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fe3b49" stopOpacity=".22"/><stop offset="100%" stopColor="#fe3b49" stopOpacity="0"/></linearGradient></defs>
      {[40, 90, 140, 190].map(y => <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f1dcd6" strokeDasharray="3 5"/>)}
      <path d={`${path} L 600 230 L 0 230 Z`} fill={`url(#${id})`}/>
      <path d={path} fill="none" stroke="#fe3b49" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
    </svg>
    <div className="chart-axis"><span>{period === '1D' ? '00:00' : period === '7D' ? 'SEP 10' : 'LAUNCH'}</span><span>{period === '1D' ? '06:00' : 'SEP 12'}</span><span>{period === '1D' ? '12:00' : 'SEP 14'}</span><span>{period === '1D' ? '18:00' : 'SEP 16'}</span></div>
    <p className="chart-caption">Sample chart · live indexing comes in Phase 2</p>
  </div>;
}
