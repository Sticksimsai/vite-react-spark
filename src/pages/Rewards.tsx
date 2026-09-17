import { useState } from 'react';
import { Link, useNavigate, useParams } from '@/lib/nav';
import { isAddress } from 'viem';
import { PageHeading, Stat, EmptyState } from '@/components/ui';
import { useLive, type StateResponse } from '@/lib/api';
import { eth, shortAddr } from '@/lib/format';

function WalletView({ address }: { address: string }) {
  const { data, error } = useLive<StateResponse>(`/api/beta/state?account=${address}`, 5000);
  if (error) return <div className="notice panel-margin">Backend unavailable. {error}</div>;
  if (!data) return <p className="fine panel-margin">Loading wallet…</p>;
  const held = data.coins.filter(c => BigInt(c.balance ?? '0') > 0n || BigInt(c.credit ?? '0') > 0n);
  return <>
    <div className="wallet-hero"><div><h2>{shortAddr(address)}</h2><p>Live holdings and reward credit on the local chain · session {data.sessionId.slice(0, 8)}</p></div></div>
    {held.length ? <div className="panel table-wrap"><table className="data-table"><thead><tr><th>coin</th><th>balance</th><th>reward credit · ETH</th><th>route</th></tr></thead><tbody>{held.map(c => <tr key={c.token}><td><Link className="positive" to={`/coin/${c.token}`}>{c.symbol} →</Link></td><td>{eth(c.balance ?? '0', 2)}</td><td>{eth(c.credit ?? '0')}</td><td>{c.route}</td></tr>)}</tbody></table></div> : <EmptyState title="Nothing held yet." description="This wallet holds no indexed coins in the current local session." href="/discover" label="browse coins"/>}
  </>;
}

export default function Rewards() {
  const { address: param } = useParams();
  const [address, setAddress] = useState(''), [error, setError] = useState('');
  const navigate = useNavigate();
  function lookup(e: React.FormEvent) { e.preventDefault(); if (!isAddress(address.trim())) { setError('Enter a valid EVM wallet address.'); return; } navigate('/wallet/' + address.trim()); }
  async function connect() { try { if (!window.ethereum) throw Error('Use a browser with an injected EVM wallet, or enter an address.'); const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]; if (!accounts[0]) throw Error('No wallet selected'); navigate('/wallet/' + accounts[0]); } catch (e) { setError(e instanceof Error ? e.message : 'Connection declined'); } }
  return <>
    <PageHeading eyebrow="your local wallet" title="Good things find their way back." description="Live holdings, ETH rewards and creator earnings from the local chain."/>
    {param && isAddress(param) ? <WalletView address={param}/> : <>
      <div className="wallet-hero"><div><h2>Your wallet. Your record.</h2><p>Look up any EVM address without connecting or signing.</p><form className="wallet-lookup" onSubmit={lookup}><input aria-label="Wallet address" placeholder="0x… enter a wallet address" value={address} onChange={e => { setAddress(e.target.value); setError(''); }}/><button className="button primary">look up wallet</button></form>{error && <p className="error" role="alert">{error}</p>}</div><button className="button" onClick={connect}>use connected wallet</button></div>
      <div className="stats-grid rewards-stats"><Stat label="holder share" value="50%" detail="of vault fees"/><Stat label="creator share" value="20%" detail="withdraw any time"/><Stat label="review delay" value="1h" detail="before claims open"/><Stat label="paid in" value="ETH" detail="native"/></div>
    </>}
    <div className="notice panel-margin">Local chain 31337 · test ETH only. Records cover indexed coins and verified published rounds in the current session.</div>
    <Link to="/rounds" className="button panel-margin">explore the live rewards ledger →</Link>
  </>;
}
