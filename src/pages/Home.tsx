import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { SectionHeading, Stat } from '@/components/ui';
import { useLive, type AnalyticsResponse } from '@/lib/api';
import { eth } from '@/lib/format';
import { coins as demoCoins, compact } from '@/lib/demo';

const split = [
  { pct: 50, who: 'holders', note: 'paid in ETH, weighted by how long you hold', cls: 'seg-a' },
  { pct: 20, who: 'the creator', note: 'yours, in ETH, withdraw any time', cls: 'seg-b' },
  { pct: 20, who: 'the platform', note: 'keeps the lights on', cls: 'seg-c' },
  { pct: 10, who: '$cult community', note: 'a share of every launch', cls: 'seg-d' },
];
const steps = [
  { n: '01', title: 'Start a coin in a minute.', text: 'Pick a name, a ticker and a face for it. Your coin gets its own live page, a fee vault and a bonding curve the moment it lands on chain.' },
  { n: '02', title: 'Every trade feeds the vault.', text: 'Each buy and sell sends a fee into the coin’s vault. The split is fixed at launch and written into the contract, so nobody can quietly change it later.' },
  { n: '03', title: 'Holders get paid, on the record.', text: 'Rounds are published to a public ledger. Time-weighted balances decide who gets what, and every allocation and claim has a receipt you can check.' },
];

function LiveStrip() {
  const { data, live } = useLive<AnalyticsResponse>('/api/beta/analytics', 10000);
  const demoPaid = demoCoins.reduce((s, c) => s + c.paid, 0);
  return <section className="ledger-strip">
    <SectionHeading title={live ? 'Live on the local chain.' : 'The collective, in numbers.'} note={live ? 'refreshes every 10s' : 'example figures'} href="/analytics" label="all the numbers"/>
    <div className="stats-grid rewards-stats panel-margin">
      {live && data ? <>
        <Stat label="indexed launches" value={String(data.coins.length)}/>
        <Stat label="holder ETH funded" value={eth(data.totals.funded)} detail="ETH"/>
        <Stat label="holder ETH paid" value={eth(data.totals.paid)} detail="ETH"/>
        <Stat label="tracked trades" value={String(data.totals.curveTrades + data.totals.poolTrades)} detail="curve + pool router"/>
      </> : <>
        <Stat label="example launches" value={String(demoCoins.length)}/>
        <Stat label="paid to holders" value={compact(demoPaid)} detail="illustrative"/>
        <Stat label="graduated" value={String(demoCoins.filter(c => c.progress === 100).length)}/>
        <Stat label="on the curve" value={String(demoCoins.filter(c => c.progress < 100).length)}/>
      </>}
    </div>
  </section>;
}

export default function Home() {
  return <>
    <section className="poster">
      <div className="poster-copy">
        <p className="poster-kicker"><Sparkles size={14}/> a launchpad where holding is the point</p>
        <h1>Start a coin.<br/>Pay the people<br/><em>who hold it.</em></h1>
        <p className="poster-lead">Trading fees don’t vanish into the platform. Half of everything a coin earns flows straight back to the wallets holding it — every round, on a public ledger.</p>
        <div className="poster-actions">
          <Link className="button primary large" to="/launch">start a coin <ArrowUpRight size={16}/></Link>
          <Link className="button large" to="/discover">browse live coins <ArrowRight size={15}/></Link>
        </div>
        <ul className="poster-facts">
          <li><strong>50%</strong> of fees to holders</li>
          <li><strong>fixed</strong> split, locked at launch</li>
          <li><strong>public</strong> ledger of every payout</li>
        </ul>
      </div>
      <div className="poster-art" aria-hidden="true">
        <img src="/brand/mark.png" alt="" width={420} height={440}/>
        <span className="sticker sticker-1">native ETH rewards</span>
        <span className="sticker sticker-2">on robinhood chain</span>
      </div>
    </section>

    <section className="flow">
      <div className="flow-head">
        <h2>One trade. Four ways.</h2>
        <p>Of the fee each coin’s vault receives. Network and DEX fees are separate. <Link to="/docs">Read the fee policy →</Link></p>
      </div>
      <div className="flow-bar" role="img" aria-label="Fee split: 50% holders, 20% creator, 20% platform, 10% community">
        {split.map(s => <i key={s.who} className={s.cls} style={{ flex: s.pct }}><b>{s.pct}%</b></i>)}
      </div>
      <div className="flow-legend">{split.map(s => <div key={s.who}><i className={s.cls}/><div><strong>{s.who}</strong><span>{s.note}</span></div></div>)}</div>
    </section>

    <LiveStrip/>

    <section className="steps">
      <div className="steps-intro">
        <p className="eyebrow">how it works</p>
        <h2>Three moves.<br/>No small print.</h2>
        <Link className="button" to="/docs">the full mechanics <ArrowRight size={14}/></Link>
      </div>
      <ol className="steps-list">{steps.map(s => <li key={s.n}><span className="step-num" aria-hidden="true">{s.n}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol>
    </section>

    <section className="cta-band">
      <div><h2>Got a cult in you?</h2><p>Launch on the local beta with test ETH. No keys, no cost, nothing goes to mainnet.</p></div>
      <Link className="button cta-button" to="/launch">start a coin <ArrowUpRight size={16}/></Link>
    </section>
  </>;
}
