import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus, ArrowRight, Plus } from 'lucide-react';
import { PageHeading, FeeSplit } from '@/components/ui';
import { Modal } from '@/components/Modal';

const initial = { name: '', symbol: '', description: '', website: '', twitter: '', telegram: '', firstBuy: '0.01' };
const DRAFT_KEY = 'cult.launch.draft.v3';

/** Launch form UI. Submission goes through the beta backend (/api/beta/quote + a reviewed wallet tx); this page prepares the draft and review. */
export default function Launch() {
  const [form, setForm] = useState(initial), [logo, setLogo] = useState(''), [saved, setSaved] = useState(false), [review, setReview] = useState(false), [more, setMore] = useState(false);
  useEffect(() => { try { const d = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null'); if (d) setForm({ ...initial, ...d }); } catch { /* ignore */ } }, []);
  function update(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })); setSaved(false); }
  function save() { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); setSaved(true); } catch { /* ignore */ } }
  function pick(e: React.ChangeEvent<HTMLInputElement>) { const f = e.target.files?.[0]; if (!f) return; if (f.size > 1024 * 1024) { alert('Image must be under 1 MB'); return; } const r = new FileReader(); r.onload = () => setLogo(String(r.result)); r.readAsDataURL(f); }
  const ready = form.name.trim().length > 1 && /^[A-Z0-9]{2,10}$/.test(form.symbol);
  return <>
    <PageHeading eyebrow="start something together" title="Your idea. Your community." description="Launch a coin with native ETH rewards and a fixed fee split."><span className="tag">local beta · test ETH</span></PageHeading>
    <div className="notice" style={{ marginBottom: 24 }}>Public testnet is the next release target. Launches currently deploy on the local chain (31337) with test ETH only. <Link to="/status" className="positive">Build status →</Link></div>
    <div className="launch-layout">
      <div className="panel">
        <section className="form-section">
          <div className="form-section-title"><span className="step-number">01</span><h2>Make it yours</h2></div>
          <div className="upload-row">
            <label className="upload-box" aria-label="Upload coin image">{logo ? <img src={logo} alt=""/> : <ImagePlus size={26}/>}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={pick}/></label>
            <div className="upload-copy"><strong>A face for your coin</strong><p>PNG, JPG or WebP · up to 1 MB<br/>Stored with an immutable content hash on the local server.</p></div>
          </div>
          <div className="form-row">
            <label><span className="field-label">coin name <small>{form.name.length}/64</small></span><input maxLength={64} placeholder="Something worth gathering around" value={form.name} onChange={e => update('name', e.target.value)}/></label>
            <label><span className="field-label">ticker</span><input maxLength={10} placeholder="YOURCOIN" value={form.symbol} onChange={e => update('symbol', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}/></label>
          </div>
          <label><span className="field-label">the story <small>{form.description.length}/500</small></span><textarea maxLength={500} placeholder="What brings your community together?" value={form.description} onChange={e => update('description', e.target.value)}/></label>
          <p className="details-label" onClick={() => setMore(!more)}>{more ? '▾' : '▸'} Website &amp; social links · optional</p>
          {more && <div className="form-row"><label><span className="field-label">website</span><input placeholder="https://" value={form.website} onChange={e => update('website', e.target.value)}/></label><label><span className="field-label">x / twitter</span><input placeholder="@handle" value={form.twitter} onChange={e => update('twitter', e.target.value)}/></label><label><span className="field-label">telegram</span><input placeholder="t.me/…" value={form.telegram} onChange={e => update('telegram', e.target.value)}/></label></div>}
          <p className="form-description">Metadata is set at launch. This version has no metadata editing function.</p>
        </section>
        <section className="form-section">
          <div className="form-section-title"><span className="step-number">02</span><h2>Take the first step</h2><span className="muted">0–1 test ETH</span></div>
          <label><span className="field-label">optional first buy</span><div className="input-unit"><input inputMode="decimal" value={form.firstBuy} onChange={e => update('firstBuy', e.target.value)}/><span>ETH</span></div></label>
          <div className="amount-presets">{['0', '0.01', '0.05', '0.1'].map(v => <button key={v} onClick={() => update('firstBuy', v)}>{v === '0' ? 'skip' : v}</button>)}</div>
          <p className="fine" style={{ marginTop: 12 }}>Launch and first buy execute together. Your wallet receives the tokens; the review shows the minimum output.</p>
        </section>
        <section className="form-section">
          <div className="form-section-title"><span className="step-number">03</span><h2>Review &amp; launch</h2></div>
          <div className="launch-review"><p className="fine">Launching creates the token, its fee vault and a bonding curve in one transaction on the local chain. Nothing is sent to mainnet.</p><div style={{ display: 'flex', gap: 10 }}><button className="button" onClick={save}>{saved ? 'draft saved' : 'save draft'}</button><button className="button primary" disabled={!ready} onClick={() => setReview(true)}>review launch <ArrowRight size={14}/></button></div></div>
        </section>
      </div>
      <aside className="launch-aside">
        <div className="panel"><div className="panel-body">
          <div className="preview-token" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}><span className="preview-token-icon">{logo ? <img src={logo} alt=""/> : <Plus size={20}/>}</span><div><strong>{form.name || 'Your next big idea'}</strong><small>${form.symbol || 'YOURCOIN'}</small></div></div>
          <h3 style={{ margin: '22px 0 14px', fontSize: 17 }}>A fixed ETH reward policy.</h3>
          <FeeSplit compact/>
        </div></div>
        <p className="aside-note">The upstream protocol controls its own fees and permissions. Review the fee documentation before launching.</p>
      </aside>
    </div>
    <Modal open={review} onOpenChange={setReview} title="Ready to launch" description="This preview prepares your draft. The transaction itself is built and signed through the local beta backend.">
      <dl className="review-list"><div><dt>name</dt><dd>{form.name}</dd></div><div><dt>ticker</dt><dd>${form.symbol}</dd></div><div><dt>first buy</dt><dd>{form.firstBuy || '0'} ETH</dd></div><div><dt>holder share</dt><dd>50%</dd></div><div><dt>creator share</dt><dd>20%</dd></div></dl>
      <div className="notice">Connect this frontend to a running local beta (<code>VITE_API_BASE</code>) to submit. The backend endpoint is <code>POST /api/beta/quote</code> followed by a wallet transaction the user reviews.</div>
    </Modal>
  </>;
}
