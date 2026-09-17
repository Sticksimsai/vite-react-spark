import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLive, type BuysResponse, type Buy } from '@/lib/api';
import { coins as demoCoins } from '@/lib/demo';
import { eth, shortAddr } from '@/lib/format';

/** Illustrative feed used when the backend is offline: rotates through the example coins. */
function demoFeed(): Buy[] {
  const wallets = ['0x8a3f…c1e2', '0x19b4…77d0', '0xf0e2…a91b', '0x4c77…3e8f', '0xb21d…0a4c', '0x73aa…e6f1', '0xde90…12b7', '0x0b5e…9c03'];
  const sizes = ['0.010', '0.025', '0.050', '0.100', '0.015', '0.200', '0.040', '0.075'];
  const curve = demoCoins.filter(c => c.progress < 100), pool = demoCoins.filter(c => c.progress === 100);
  return Array.from({ length: 14 }, (_, i) => {
    const c = i % 3 === 2 ? pool[i % pool.length] : curve[i % curve.length];
    return { id: 'demo-' + i, token: c.id, image: c.image, symbol: c.symbol, name: c.name, buyer: wallets[i % wallets.length], amount: String(BigInt(Math.round(parseFloat(sizes[i % sizes.length]) * 1e18))), blockNumber: 0, route: c.progress === 100 ? 'pool' : 'curve' };
  });
}

export function BuyTicker() {
  const { data, live } = useLive<BuysResponse>('/api/beta/buys', 5000);
  const items = useMemo(() => (live && data && data.buys.length ? data.buys : demoFeed()), [live, data]);
  const tip = data?.checkpoint ?? 0;
  const track = [...items, ...items]; // duplicated so the loop is seamless
  return <div className={`ticker ${live ? 'is-live' : 'is-demo'}`} aria-label="Recent buys">
    <span className="ticker-label"><i/>{live ? 'live buys' : 'example buys'}</span>
    <div className="ticker-viewport">
      <div className="ticker-track" style={{ ['--n' as string]: items.length }}>
        {track.map((b, i) => <Link key={b.id + '-' + i} to={`/coin/${b.token}`} className={`ticker-item ${i === 0 ? 'is-latest' : ''}`} aria-hidden={i >= items.length}>
          {b.image && <img src={b.image} alt=""/>}
          <span className="ticker-buyer">{live ? shortAddr(b.buyer) : b.buyer}</span>
          <span className="ticker-verb">bought</span>
          <strong className="ticker-amount">{eth(b.amount, 3)} ETH</strong>
          <span className="ticker-verb">of</span>
          <strong className="ticker-symbol">${b.symbol}</strong>
          <span className="ticker-route">{b.route}{live && tip ? ` · ${Math.max(0, tip - b.blockNumber)} blk` : ''}</span>
        </Link>)}
      </div>
    </div>
  </div>;
}
