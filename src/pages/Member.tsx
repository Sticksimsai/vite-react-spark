import { Link, useParams } from '@/lib/nav';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Stat, SectionHeading, EmptyState } from '@/components/ui';
import { getMemberByHandle } from '@/lib/cult';
import { shortAddr } from '@/lib/format';

export default function MemberPage() {
  const { handle = '' } = useParams();
  const member = getMemberByHandle(handle);
  if (!member) return <EmptyState title="Nothing here just yet." description="No member with that handle." href="/discover" label="back to the pulse"/>;

  return <>
    <Link to="/discover" className="fine"><ArrowLeft size={12}/> back to the pulse</Link>
    <div className="coin-detail-top">
      {member.avatar
        ? <img className="cult-avatar" src={member.avatar} alt="" width={65} height={65} style={{ width: 65, height: 65, flexBasis: 65, borderRadius: 16 }}/>
        : <span className="pulse-letter" style={{ width: 65, height: 65, borderRadius: 16 }}>{member.initials}</span>}
      <div>
        <h1>{member.handle}</h1>
        <p className="coin-subtitle">{member.bio}</p>
      </div>
      <span className="tag">example data</span>
    </div>

    <div className="panel panel-body panel-margin">
      <p className="eyebrow">linked wallets</p>
      <div className="cult-badges" style={{ marginTop: 10 }}>{member.addresses.map(address => <span className="tag" key={address}>{shortAddr(address)}</span>)}</div>
    </div>

    <div className="stats-grid coin-stat-grid">
      <Stat label="cults joined" value={String(member.cults.length)}/>
      <Stat label="total rewarded" value={`${member.totalRewardedEth.toFixed(4)} ETH`}/>
      <Stat label="best PnL coin" value={member.bestCoin ? `$${member.bestCoin.symbol}` : '—'} detail={member.bestCoin ? `${member.bestCoin.pnlPercent >= 0 ? '+' : ''}${member.bestCoin.pnlPercent}%` : undefined}/>
      <Stat label="member since" value={member.memberSince}/>
    </div>

    <SectionHeading title="the cults they’re in" note={`${member.cults.length} coins`}/>
    <div className="panel cult-list">
      {member.cults.map(cult => <Link key={cult.coinId} className="cult-row" to={`/coin/${cult.coinId}`}>
        <div className="cult-person">
          {cult.image
            ? <img className="cult-avatar" src={cult.image} alt="" width={46} height={46}/>
            : <span className="pulse-letter cult-avatar" aria-hidden="true">{cult.mark}</span>}
          <div className="cult-identity"><strong>${cult.symbol}</strong><span>{cult.name} · holding {cult.holdingSince}</span></div>
          <div className="cult-badges">{cult.badges.map(badge => <span className="tag" key={badge}>{badge}</span>)}</div>
        </div>
        <div className="cult-metric cult-holding"><span>holding</span><strong>{cult.holdingPercent}%</strong><div className="horizontal-track"><i style={{ width: `${Math.min(100, cult.holdingPercent * 8)}%` }}/></div></div>
        <div className="cult-metric"><span>rewarded</span><strong>{cult.rewardedEth.toFixed(4)} ETH</strong></div>
        <div className="cult-metric"><span>PnL</span><strong className={cult.pnlPercent === null ? '' : cult.pnlPercent >= 0 ? 'positive' : 'negative'}>{cult.pnlPercent === null ? '—' : `${cult.pnlPercent >= 0 ? '+' : ''}${cult.pnlPercent}%`}</strong></div>
      </Link>)}
    </div>

    <div className="panel panel-body panel-margin"><p className="lead-note">Example figures. Holdings, rewards and PnL will read from on-chain balances and trade history once the backend endpoint exists.</p><Link to="/rounds" className="button">explore the ledger <ArrowRight size={14}/></Link></div>
  </>;
}
