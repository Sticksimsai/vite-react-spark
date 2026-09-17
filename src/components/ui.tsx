import { Link } from 'react-router-dom';
import { ArrowRight, MoveUpRight } from 'lucide-react';
import type { Coin } from '@/lib/demo';

export function CoinArt({ coin, small = false }: { coin: Coin; small?: boolean }) {
  return <div className={`coin-art ${coin.color} ${small ? 'art-small' : ''} ${coin.image ? 'has-image' : ''}`} aria-hidden="true">
    {coin.image ? <img src={coin.image} alt="" width={128} height={128}/> : <span>{coin.mark}</span>}
    <div className="art-caption">{coin.symbol}<i>ON ROBINHOOD</i></div>
  </div>;
}

export function FeeSplit({ compact: small = false, asset = 'ETH', mode = 'drop' }: { compact?: boolean; asset?: string; mode?: string }) {
  const rows = [
    { percent: 50, label: 'coin holders', detail: `paid in ${asset}`, cls: 'cream' },
    { percent: 10, label: '$cult community', detail: mode === 'treasury' ? 'ETH treasury credit' : mode === 'drop' ? 'a share of every launch' : 'buy & burn $CULT', cls: 'lime' },
    { percent: 20, label: 'the creator', detail: 'yours, in ETH', cls: 'gray' },
    { percent: 20, label: 'the platform', detail: 'keeping it all running', cls: 'dark-gray' },
  ];
  return <div className={`fee-split ${small ? 'compact' : ''}`}>
    <div className="eyebrow">where the fees go <span>50 / 10 / 20 / 20</span></div>
    {rows.map(row => <div key={row.label} className="fee-row">
      <strong className={row.cls === 'lime' ? 'positive' : ''}>{row.percent}<span>%</span></strong>
      <div><div className="fee-bar"><i className={row.cls} style={{ width: row.percent * 2 + '%' }}/></div><div className="fee-label"><span>{row.label}</span><span>{row.detail}</span></div></div>
    </div>)}
    <p className="fine">Of fees received by the coin’s vault. Network and trading fees are separate.</p>
  </div>;
}

export function PageHeading({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: React.ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</div>;
}

export function SectionHeading({ title, note, href, label }: { title: string; note?: string; href?: string; label?: string }) {
  return <div className="section-heading"><div><h2>{title}</h2>{note && <span>{note}</span>}</div>{href && <Link to={href}>{label ?? 'view all'} <ArrowRight size={14}/></Link>}</div>;
}

export function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>;
}

export function EmptyState({ title, description, href, label }: { title: string; description: string; href?: string; label?: string }) {
  return <div className="empty-state"><img className="empty-mark" src="/brand/mark.png" alt="" width={56} height={58}/><h2>{title}</h2><p>{description}</p>{href && <Link className="button primary" to={href}>{label}<MoveUpRight size={15}/></Link>}</div>;
}

export function Notice({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'warn' }) {
  return <div className={`notice ${tone === 'warn' ? 'notice-warn' : ''}`} role="status">{children}</div>;
}
