import { useEffect, useState } from 'react';
import { Link, NavLink } from '@/lib/nav';
import { ArrowUpRight, X, Menu, Wallet } from 'lucide-react';
import { Modal } from './Modal';
import { BuyTicker } from './BuyTicker';

type Provider = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown>; on?: (event: string, fn: (value: unknown) => void) => void; removeListener?: (event: string, fn: (value: unknown) => void) => void };
declare global { interface Window { ethereum?: Provider } }

const nav = [['/discover', 'coins'], ['/launch', 'start a coin'], ['/wallet', 'my rewards'], ['/analytics', 'numbers'], ['/docs', 'how it works']] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const [walletOpen, setWalletOpen] = useState(false), [buyOpen, setBuyOpen] = useState(false), [menu, setMenu] = useState(false);
  const [account, setAccount] = useState(''), [chain, setChain] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);

  useEffect(() => {
    const p = window.ethereum; if (!p) return;
    const accounts = (v: unknown) => setAccount(Array.isArray(v) ? String(v[0] ?? '') : '');
    const chains = (v: unknown) => setChain(String(v));
    p.on?.('accountsChanged', accounts); p.on?.('chainChanged', chains);
    return () => { p.removeListener?.('accountsChanged', accounts); p.removeListener?.('chainChanged', chains); };
  }, []);

  async function connect() {
    setError(''); setBusy(true);
    try {
      if (!window.ethereum) throw new Error('No EVM wallet detected. Open this page in a wallet browser or install an EVM wallet extension.');
      const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount((result as string[])[0] ?? '');
      setChain(String(await window.ethereum.request({ method: 'eth_chainId' })));
    } catch (e) { setError(e instanceof Error ? e.message : 'Wallet connection was declined.'); }
    finally { setBusy(false); }
  }

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
          <button className="button wallet-button" onClick={() => setWalletOpen(true)} aria-label={account ? 'Wallet ' + account : 'Connect wallet'}><Wallet size={15}/><span>{account ? account.slice(0, 6) + '…' + account.slice(-4) : 'wallet'}</span></button>
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

    <Modal open={walletOpen} onOpenChange={setWalletOpen} title={account ? 'Your wallet' : 'Connect your wallet'} description="Connect an EVM wallet to view your address. This connection only reads your address; transactions are only requested after you review them.">
      {account ? <>
        <div className="wallet-address"><Wallet size={24}/><code>{account}</code></div>
        <p className="muted">{chain === '0x1237' ? 'Robinhood Chain connected.' : 'Your wallet is on another network. Transactions are disabled in this phase.'}</p>
        <button className="button full" onClick={() => { setAccount(''); setWalletOpen(false); }}>Disconnect from preview</button>
      </> : <>
        <button className="button primary full" disabled={busy} onClick={connect}><Wallet size={16}/>{busy ? 'Waiting for your wallet…' : 'Connect browser wallet'}</button>
        <p className="fine">Robinhood Wallet, MetaMask, or another injected EVM wallet.</p>
      </>}
      {error && <p role="alert" className="error">{error}</p>}
    </Modal>
    <Modal open={buyOpen} onOpenChange={setBuyOpen} title="The $CULT token" description="CULT is the working name for the platform token. It has not been deployed.">
      <div className="notice">Purchases will open after the token policy and contracts are reviewed. The token shown in this preview is an example.</div>
      <Link className="button primary full" to="/coin/cult" onClick={() => setBuyOpen(false)}>Explore the token preview <ArrowUpRight size={16}/></Link>
    </Modal>
  </>;
}
