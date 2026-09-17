import { PageHeading, EmptyState } from '@/components/ui';
import { useLive, type LedgerResponse } from '@/lib/api';
import { eth } from '@/lib/format';
import { rounds as demoRounds } from '@/lib/demo';

export default function Rounds() {
  const { data, error, live } = useLive<LedgerResponse>('/api/beta/ledger', 5000);
  return <>
    <PageHeading eyebrow="live rewards ledger" title="Every round. In the open." description="Funded ETH allocations and confirmed payments from the local chain."/>
    <div className="notice" role="status">{error ? 'Local rewards unavailable. Showing example rounds. ' + error : data?.stale ? 'Indexer is catching up. Values below are the last confirmed snapshot.' : 'Live local chain · test ETH only. Public wallet lookup never requests a signature.'}</div>
    <div className="panel table-wrap panel-margin">
      {live && data ? <>
        <table className="data-table"><thead><tr><th>coin / round</th><th>funded ETH</th><th>paid ETH</th><th>status</th></tr></thead><tbody>{data.rounds.map(r => <tr key={r.id}><td>{r.symbol} · #{r.epoch}</td><td>{eth(r.budget)}</td><td>{eth(r.paid)}</td><td><span className={`status-tag ${r.status === 'delivered' ? '' : 'pending'}`}>{r.status}</span></td></tr>)}</tbody></table>
        {!data.rounds.length && <EmptyState title="No published rounds yet." description="Funded allocation rounds will appear after indexing confirms them."/>}
      </> : <table className="data-table"><thead><tr><th>round</th><th>coin</th><th>amount</th><th>wallets</th><th>when</th><th>status</th></tr></thead><tbody>{demoRounds.map(r => <tr key={r.id}><td>#{r.id}</td><td>{r.coin}</td><td>{r.amount} {r.asset}</td><td>{r.wallets}</td><td>{r.time}</td><td><span className={`status-tag ${r.state === 'Delivered' ? '' : r.state === 'Claimable' ? 'pending' : 'neutral'}`}>{r.state.toLowerCase()}</span></td></tr>)}</tbody></table>}
    </div>
  </>;
}
