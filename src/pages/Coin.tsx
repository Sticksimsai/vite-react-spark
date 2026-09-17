import { useState } from 'react';
import { Link, useParams } from '@/lib/nav';
import { isAddress } from 'viem';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CoinArt, Stat, SectionHeading, EmptyState } from '@/components/ui';
import { Chart } from '@/components/Chart';
import { Modal } from '@/components/Modal';
import { useLive, type StateResponse } from '@/lib/api';
import { useMember } from '@/lib/auth';
import { getCult, handleSlug, type CultHolder } from '@/lib/cult';
import { eth, shortAddr } from '@/lib/format';
import { coins, compact, money, type Coin } from '@/lib/demo';

function DemoCoin({ coin }: { coin: Coin }) {
  const [side, setSide] = useState('buy'), [amount, setAmount] = useState('0.01'), [open, setOpen] = useState(false), [cultView, setCultView] = useState<'members' | 'holders'>('members');
  const { addresses, authenticated, handle } = useMember();
  const cult = getCult(coin.id);
  const ownAddresses = new Set(addresses.map(address => address.toLowerCase()));
  const visibleCult = (cultView === 'members' ? cult.members : cult.holders)
    .map(holder => ({ ...holder, isYou: ownAddresses.has(holder.address.toLowerCase()) }))
    .sort((a, b) => Number(b.isYou) - Number(a.isYou));
  const memberHoldsCoin = visibleCult.some(holder => holder.isYou);
  return <>
    <Link to="/discover" className="fine"><ArrowLeft size={12}/> back to the pulse</Link>
    <div className="coin-detail-top"><CoinArt coin={coin} small/><div><h1>{coin.name}<span>${coin.symbol}</span></h1><p className="coin-subtitle">robinhood chain <span>·</span> pays {coin.reward} <span>·</span> example coin</p></div><span className="tag">{coin.progress === 100 ? 'graduated' : 'on the curve'}</span></div>
    <div className="stats-grid coin-stat-grid"><Stat label="market cap" value={compact(coin.cap)}/><Stat label="24h volume" value={compact(coin.volume)}/><Stat label="24h change" value={`${coin.change > 0 ? '+' : ''}${coin.change}%`}/><Stat label="holders" value={coin.holders.toLocaleString()}/><Stat label="rewards paid" value={money(coin.paid)}/></div>
    <div className="detail-layout">
      <div>
        <div className="panel"><Chart label={`${coin.symbol} / USD`} kind="price"/><div className="progress-section"><div><span>{coin.progress === 100 ? 'Graduated to pool' : 'Bonding curve progress'}</span><strong className="positive">{coin.progress}%</strong></div><div className="horizontal-track"><i style={{ width: coin.progress + '%' }}/></div><p className="fine" style={{ marginTop: 12 }}>Illustrative status. This coin has no deployed contract.</p></div></div>
        <div className="cult-heading">
          <div><h2>the ${coin.symbol} cult</h2><span>{cult.members.length} members · {cult.memberSupplyPercent}% of supply held by members</span></div>
          <div className="cult-heading-tools"><span className="tag">example data</span><div className="segmented" aria-label="Cult holder view">{(['members', 'holders'] as const).map(view => <button key={view} className={cultView === view ? 'selected' : ''} aria-pressed={cultView === view} onClick={() => setCultView(view)}>{view === 'holders' ? 'all holders' : 'members'}</button>)}</div></div>
        </div>
        <div className="panel cult-list">
          {visibleCult.map(holder => <CultRow key={holder.address} holder={holder} displayHandle={holder.isYou && handle ? handle : undefined}/>) }
          {authenticated && !memberHoldsCoin && <div className="cult-join"><span className="fine">You don’t hold ${coin.symbol} yet.</span><button className="button primary" onClick={() => setOpen(true)}>join the cult</button></div>}
        </div>
        <SectionHeading title="A community that gives back."/>
        <div className="panel panel-body"><p className="lead-note">{coin.name} is an example of a launch that rewards its community in {coin.reward}. When live, every funded round will link its fee receipts, allocations and payments.</p><Link to="/rounds" className="button">explore the ledger <ArrowRight size={14}/></Link></div>
      </div>
      <aside>
        <div className="panel"><div className="panel-heading"><h2>Trade {coin.symbol}</h2><span>preview</span></div><div className="panel-body">
          <div className="trade-tabs">{['buy', 'sell'].map(s => <button key={s} className={s === side ? 'selected' : ''} aria-pressed={side === s} onClick={() => { setSide(s); setAmount(s === 'buy' ? '0.01' : '1000'); }}>{s}</button>)}</div>
          <label><span className="field-label">you pay</span><div className="input-unit"><input aria-label="Trade amount" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)}/><span>{side === 'buy' ? 'ETH' : coin.symbol}</span></div></label>
          <div className="amount-presets">{(side === 'buy' ? ['0.01', '0.05', '0.1'] : ['100', '1000', '10000']).map(v => <button key={v} onClick={() => setAmount(v)}>{v}</button>)}</div>
          <div className="trade-info"><span>execution quote</span><span>not available yet</span></div>
          <button className="button primary full" onClick={() => setOpen(true)}>trading availability <ArrowRight size={14}/></button>
          <p className="fine" style={{ marginTop: 16 }}>No approvals, signatures, or transactions are requested in this preview.</p>
        </div></div>
        <div className="panel panel-margin"><div className="panel-heading"><h2>Holder rewards</h2><span>{coin.reward}</span></div><div className="panel-body"><div className="chart-value">{money(coin.paid)}</div><p className="fine">example total distributed</p><div className="review-list"><div><span>holder share</span><strong>50%</strong></div><div><span>creator share</span><strong>20%</strong></div></div><Link to="/wallet" className="fine positive">view wallet rewards →</Link></div></div>
      </aside>
    </div>
    <Modal open={open} onOpenChange={setOpen} title="Trading on the local beta" description="This page is an interface preview. Example tokens cannot be bought or sold."><div className="notice">Live coins trade through the beta backend with a reviewed wallet transaction. Your entered amount has not been sent anywhere.</div><Link to="/status" className="button primary full" onClick={() => setOpen(false)}>see build progress <ArrowRight size={15}/></Link></Modal>
  </>;
}

function CultRow({ holder, displayHandle }: { holder: CultHolder & { isYou: boolean }; displayHandle?: string }) {
  const pnl = holder.pnlPercent;
  return <div className="cult-row">
    <div className="cult-person">
      {holder.avatar ? <img className="cult-avatar" src={holder.avatar} alt="" width={46} height={46}/> : <span className="pulse-letter cult-avatar" aria-hidden="true">{holder.initials}</span>}
      <div className="cult-identity"><strong>{holder.handle ? <Link to={`/m/${handleSlug(holder.handle)}`}>{displayHandle ?? holder.handle}</Link> : (displayHandle ?? shortAddr(holder.address))}</strong><span>holding {holder.holdingSince}</span></div>
      <div className="cult-badges">{holder.isYou && <span className="tag">you</span>}{holder.badges.map(badge => <span className="tag" key={badge}>{badge}</span>)}</div>
    </div>
    <div className="cult-metric cult-holding"><span>holding</span><strong>{holder.holdingPercent}%</strong><div className="horizontal-track"><i style={{ width: `${Math.min(100, holder.holdingPercent * 8)}%` }}/></div></div>
    <div className="cult-metric"><span>rewarded</span><strong>{holder.rewardedEth.toFixed(4)} ETH</strong></div>
    <div className="cult-metric"><span>PnL</span><strong className={pnl === null ? '' : pnl >= 0 ? 'positive' : 'negative'}>{pnl === null ? '—' : `${pnl >= 0 ? '+' : ''}${pnl}%`}</strong></div>
  </div>;
}

function LiveCoin({ token }: { token: string }) {
  const { data, error } = useLive<StateResponse>(`/api/beta/state?token=${token}`, 5000);
  const coin = data?.coins.find(c => c.token.toLowerCase() === token.toLowerCase());
  if (error) return <EmptyState title="Backend unavailable." description={error} href="/discover" label="back to the pulse"/>;
  if (!data) return <p className="fine">Loading live coin…</p>;
  if (!coin) return <EmptyState title="Coin not indexed." description="This address is not a launched coin in the current local session." href="/discover" label="back to the pulse"/>;
  const threshold = coin.graduationThreshold ? BigInt(coin.graduationThreshold) : 0n;
  const progress = coin.graduated ? 100 : threshold > 0n ? Math.min(99, Number(BigInt(coin.reserve) * 100n / threshold)) : 0;
  return <>
    <Link to="/discover" className="fine"><ArrowLeft size={12}/> back to the pulse</Link>
    <div className="coin-detail-top"><span className="pulse-letter" style={{ width: 65, height: 65, borderRadius: 16 }}>{coin.symbol.slice(0, 3)}</span><div><h1>{coin.name}<span>${coin.symbol}</span></h1><p className="coin-subtitle">local chain <span>·</span> {coin.route} <span>·</span> <code>{shortAddr(coin.token)}</code></p></div><span className="tag">{coin.graduated ? 'graduated' : 'on the curve'}</span></div>
    <div className="stats-grid coin-stat-grid"><Stat label="curve reserve" value={eth(coin.reserve)} detail="ETH"/><Stat label="holder funded" value={eth(coin.funded)} detail="ETH"/><Stat label="holder paid" value={eth(coin.paid)} detail="ETH"/><Stat label="bonded" value={progress + '%'}/><Stat label="launched" value={'#' + coin.blockNumber} detail="block"/></div>
    <div className="panel panel-margin"><div className="progress-section"><div><span>{coin.graduated ? 'Graduated to pool' : 'Bonding curve progress'}</span><strong className="positive">{progress}%</strong></div><div className="horizontal-track"><i style={{ width: progress + '%' }}/></div><p className="fine" style={{ marginTop: 12 }}>Reserve ÷ graduation threshold, read from the factory at block {data.health.checkpoint}.</p></div></div>
    <div className="notice panel-margin">Trading and launches submit through the beta backend with a reviewed wallet transaction. Wire the trade panel to <code>/api/beta/quote</code> when you connect this frontend to the running local beta.</div>
  </>;
}

export default function CoinPage() {
  const { id = '' } = useParams();
  const sample = coins.find(c => c.id === id);
  if (sample) return <DemoCoin coin={sample}/>;
  if (isAddress(id)) return <LiveCoin token={id}/>;
  return <EmptyState title="Nothing here just yet." description="This coin could not be found." href="/discover" label="back to the pulse"/>;
}
