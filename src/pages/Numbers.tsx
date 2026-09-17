import { Link } from 'react-router-dom';
import { PageHeading, SectionHeading, Stat, EmptyState } from '@/components/ui';
import { useLive, type AnalyticsResponse } from '@/lib/api';
import { eth } from '@/lib/format';

export default function Numbers() {
  const { data, error, live } = useLive<AnalyticsResponse>('/api/beta/analytics', 10000);
  return <>
    <PageHeading eyebrow="live local analytics" title="Follow the flow." description="Confirmed fees, funding and payments. All values are test ETH in this local session."/>
    <div className="notice" role="status">{error ? 'Live analytics unavailable. ' + error : !data ? 'Loading confirmed local activity…' : data.stale ? 'Indexer catching up. Showing the last confirmed snapshot.' : `Session ${data.sessionId.slice(0, 8)} · confirmed block ${data.checkpoint} · accounting reconciled to contracts.`}</div>
    {live && data && <>
      <div className="stats-grid rewards-stats panel-margin"><Stat label="vault fees received" value={eth(data.totals.received)} detail="ETH"/><Stat label="holder ETH funded" value={eth(data.totals.funded)} detail="ETH"/><Stat label="holder ETH paid" value={eth(data.totals.paid)} detail="ETH"/><Stat label="holder share allocated" value={eth(data.totals.holders)} detail="ETH"/></div>
      <div className="two-columns panel-margin">
        <section className="panel panel-body"><h2>Where received fees go</h2>{([['holders', data.totals.holders], ['community', data.totals.community], ['platform', data.totals.platform], ['creators', data.totals.creators]] as const).map(([label, amount]) => <div className="asset-breakdown-row" key={label}><div><span>{label}</span><span>{eth(amount)} ETH</span></div><div className="horizontal-track"><i style={{ width: (BigInt(data.totals.received) === 0n ? 0 : Number(BigInt(amount) * 10000n / BigInt(data.totals.received)) / 100) + '%' }}/></div></div>)}<p className="fine">Actual event allocations, including integer rounding.</p></section>
        <section className="panel panel-body"><h2>Tracked trading activity</h2><div className="review-list"><div><span>curve trades</span><strong>{data.totals.curveTrades}</strong></div><div><span>curve ETH volume</span><strong>{eth(data.totals.curveVolume)}</strong></div><div><span>pool-router trades</span><strong>{data.totals.poolTrades}</strong></div><div><span>pool-router ETH volume</span><strong>{eth(data.totals.poolVolume)}</strong></div></div><p className="fine">{data.coverage}</p></section>
      </div>
      <SectionHeading title="Daily funding and payouts." note="UTC chain dates · days with activity"/>
      <div className="panel table-wrap"><table className="data-table"><thead><tr><th>date</th><th>fees received · ETH</th><th>holder funding · ETH</th><th>holder payouts · ETH</th></tr></thead><tbody>{data.timeline.map(d => <tr key={d.date}><td>{d.date}</td><td>{eth(d.received)}</td><td>{eth(d.funded)}</td><td>{eth(d.paid)}</td></tr>)}</tbody></table>{!data.timeline.length && <p className="panel-body fine">No funding or payment activity yet.</p>}</div>
      <SectionHeading title="Launch performance." note="indexed local launches" href="/discover" label="the pulse"/>
      <div className="panel table-wrap"><table className="data-table"><thead><tr><th>coin</th><th>route</th><th>vault fees · ETH</th><th>holder funding · ETH</th><th>paid · ETH</th><th>trades</th></tr></thead><tbody>{data.coins.map(c => <tr key={c.token}><td><Link className="positive" to={`/coin/${c.token}`}>{c.symbol} →</Link></td><td>{c.route}</td><td>{eth(c.received)}</td><td>{eth(c.funded)}</td><td>{eth(c.paid)}</td><td>{c.curveTrades + c.poolTrades}</td></tr>)}</tbody></table></div>
    </>}
    {!live && !error && !data && null}
    {error && <div className="panel-margin"><EmptyState title="No live numbers yet." description="Point VITE_API_BASE at a running CULT backend to see confirmed local-chain analytics here." href="/discover" label="see the pulse"/></div>}
  </>;
}
