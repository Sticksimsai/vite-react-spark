import { useState } from 'react';
import { Link, NavLink } from '@/lib/nav';
import { ArrowUpRight, X, Menu, Wallet, LogOut, User as UserIcon, Coins } from 'lucide-react';
import { Modal } from './Modal';
import { BuyTicker } from './BuyTicker';
import { useMember } from '@/lib/auth';
import { shortAddr } from '@/lib/format';

const nav = [['/discover', 'coins'], ['/launch', 'start a coin'], ['/wallet', 'my rewards'], ['/analytics', 'numbers'], ['/docs', 'how it works']] as const;

function initials(handle: string, address: string) {
  const source = handle || address.replace(/^0x/, '');
  return source.slice(0, 2).toUpperCase();
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [buyOpen, setBuyOpen] = useState(false), [menu, setMenu] = useState(false), [memberMenu, setMemberMenu] = useState(false);
  const member = useMember();
  const label = member.handle || (member.embeddedAddress ? shortAddr(member.embeddedAddress) : 'member');

  return <>
    <a href="#main" className="skip">Skip to content</a>
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="CULT FUN home"><img className="brand-wordmark" src="/brand/wordmark.png" alt="CULT FUN" width={327} height={244}/></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([href, label]) => <NavLink key={href} to={href} className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <Link to="/status" className="chain-pill"><i className="live-dot"/> robinhood chain · local beta</Link>
          <Link className="button primary start-button" to="/launch">start a coin <ArrowUpRight size={14}/></Link>
          {member.authenticated
            ? <button
                className="icon-button"
                onClick={() => setMemberMenu(true)}
                aria-label={'Account menu for ' + label}
                style={{ width: 34, height: 34, padding: 0, borderRadius: '50%', overflow: 'hidden', background: member.avatarUrl ? 'transparent' : 'var(--accent)', color: 'var(--on-accent)', font: '600 11px var(--mono)' }}
              >
                {member.avatarUrl ? <img src={member.avatarUrl} alt="" width={34} height={34} style={{ width: 34, height: 34, objectFit: 'cover' }}/> : initials(member.handle, member.embeddedAddress)}
              </button>
            : <button className="button primary wallet-button" onClick={member.login}>sign in</button>}
          <button className="icon-button mobile-toggle" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
        </div>
      </div>
      {menu && <nav className="mobile-nav" aria-label="Mobile navigation">{nav.map(([href, label]) => <Link to={href} key={href} onClick={() => setMenu(false)}>{label}</Link>)}<Link to="/status" onClick={() => setMenu(false)}>status</Link></nav>}
    </header>
    <div className="preview-banner"><span className="preview-label">phase 02 · local beta</span><span>Live local coins are in discovery. Example markets are labelled. Test ETH only; mainnet trading is disabled.</span><Link to="/status">build status <ArrowUpRight size={12}/></Link></div>
    <BuyTicker/>
    <main id="main">{children}</main>
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" aria-label="CULT FUN home"><img className="footer-wordmark" src="/brand/wordmark.png" alt="CULT FUN" width={327} height={244}/></Link>
          <p>Coins that pay the people who hold them. Built on Robinhood Chain, run in the open.</p>
          <button className="button subtle" onClick={() => setBuyOpen(true)}>about the $CULT token <ArrowUpRight size={13}/></button>
        </div>
        <nav className="footer-columns" aria-label="Footer">
          <div><span>product</span><Link to="/discover">coins</Link><Link to="/launch">start a coin</Link><Link to="/wallet">my rewards</Link><Link to="/rounds">the ledger</Link></div>
          <div><span>learn</span><Link to="/docs">how it works</Link><Link to="/analytics">numbers</Link><Link to="/status">status &amp; roadmap</Link></div>
          <div><span>legal</span><Link to="/terms">terms</Link><Link to="/privacy">privacy</Link></div>
        </nav>
      </div>
      <div className="footer-bottom"><img className="footer-mark" src="/brand/mark.png" alt="" width={420} height={440}/><span>© {new Date().getFullYear()} CULT FUN · a working name · unaudited local beta</span><span className="footer-network"><i className="live-dot"/> robinhood chain</span></div>
    </footer>

    <Modal open={memberMenu} onOpenChange={setMemberMenu} title={label} description="Your membership across every cult you hold.">
      <div className="member-menu" style={{ display: 'grid', gap: 8 }}>
        <Link className="button full" to="/wallet" onClick={() => setMemberMenu(false)}><Coins size={15}/> my rewards</Link>
        <Link className="button full" to="/wallet" onClick={() => setMemberMenu(false)}><UserIcon size={15}/> profile</Link>
        <button className="button full" onClick={() => { member.linkWallet(); setMemberMenu(false); }}><Wallet size={15}/> link a wallet</button>
        <button className="button full" onClick={() => { member.logout(); setMemberMenu(false); }}><LogOut size={15}/> sign out</button>
      </div>
    </Modal>
    <Modal open={buyOpen} onOpenChange={setBuyOpen} title="The $CULT token" description="CULT is the working name for the platform token. It has not been deployed.">
      <div className="notice">Purchases will open after the token policy and contracts are reviewed. The token shown in this preview is an example.</div>
      <Link className="button primary full" to="/coin/cult" onClick={() => setBuyOpen(false)}>Explore the token preview <ArrowUpRight size={16}/></Link>
    </Modal>
  </>;
}
