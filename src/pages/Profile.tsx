import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Wallet, Check } from 'lucide-react';
import { PageHeading } from '@/components/ui';
import { useMember } from '@/lib/auth';
import { getProfile, saveProfile, uploadAvatar } from '@/lib/profile.functions';
import { shortAddress } from '@/lib/format';

/** Member profile: handle, bio, avatar, linked wallets, holdings visibility. */
export default function Profile() {
  const member = useMember();
  const id = member.user?.id ?? '';
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [holdingsPublic, setHoldingsPublic] = useState(true);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const loaded = useRef('');

  useEffect(() => {
    if (!id || loaded.current === id) return;
    loaded.current = id;
    void getProfile({ data: { id } }).then(p => {
      if (!p) return;
      setHandle(p.handle ?? '');
      setBio(p.bio ?? '');
      setAvatar(p.avatar_url ?? '');
      setHoldingsPublic(p.holdings_public);
    }).catch(() => { /* profile not created yet */ });
  }, [id]);

  const fallback = member.handle || shortAddress(member.addresses[0] ?? '') || 'member';
  const initials = (handle || fallback).replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase();

  async function withToken<T>(run: (token: string) => Promise<T>) {
    const token = await member.getAccessToken();
    if (!token) { setStatus('sign in first'); return null; }
    return run(token);
  }

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setStatus('image must be under 2 MB'); return; }
    const dataUrl = await new Promise<string>(res => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(file); });
    setBusy(true); setStatus('');
    try {
      const out = await withToken(token => uploadAvatar({ data: { token, dataUrl } }));
      if (out?.avatar_url) { setAvatar(out.avatar_url); setStatus('image saved'); }
    } catch (err) { setStatus(err instanceof Error ? err.message : 'could not upload that image'); }
    setBusy(false);
  }

  async function save() {
    setBusy(true); setStatus('');
    try {
      const saved = await withToken(token => saveProfile({ data: { token, handle, bio, addresses: member.addresses, holdings_public: holdingsPublic } }));
      if (saved) setStatus('profile saved');
    } catch (err) { setStatus(err instanceof Error ? err.message : 'could not save your profile'); }
    setBusy(false);
  }

  if (!member.authenticated) {
    return <>
      <PageHeading eyebrow="your profile" title="Sign in to set up your profile." description="Your handle, picture and linked wallets live with your account."/>
      <div className="panel"><div className="panel-body"><button className="button primary" onClick={member.login}>sign in</button></div></div>
    </>;
  }

  return <>
    <PageHeading eyebrow="your profile" title="How the cult sees you." description="Handle, picture and the wallets that prove what you hold."><span className="tag">{fallback}</span></PageHeading>

    <div className="panel">
      <section className="form-section">
        <div className="form-section-title"><span className="step-number">01</span><h2>You</h2></div>
        <div className="upload-row">
          <label className="upload-box" aria-label="Upload profile picture">
            {avatar ? <img src={avatar} alt=""/> : initials ? <strong>{initials}</strong> : <ImagePlus size={26}/>}
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pick}/>
          </label>
          <div className="upload-copy"><strong>A face for your handle</strong><p>PNG, JPG or WebP · up to 2 MB</p></div>
        </div>
        <div className="form-row">
          <label><span className="field-label">handle <small>optional</small></span><input maxLength={24} placeholder={fallback} value={handle} onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}/></label>
        </div>
        <label><span className="field-label">bio <small>{bio.length}/500</small></span><textarea maxLength={500} placeholder="What are you here for?" value={bio} onChange={e => setBio(e.target.value)}/></label>
      </section>

      <section className="form-section">
        <div className="form-section-title"><span className="step-number">02</span><h2>Linked wallets</h2><span className="muted">membership comes from these</span></div>
        <div className="choice-grid">
          {member.addresses.map(a => <div key={a} className="choice choice-card"><Wallet size={15}/><div><strong>{shortAddress(a)}</strong><small>{a === member.embeddedAddress ? 'account wallet' : 'linked wallet'}</small></div></div>)}
        </div>
        <button className="button" onClick={member.linkWallet}><Wallet size={15}/> link a wallet</button>
        <p className="form-description">What you hold is read from the chain for these addresses. Nothing here is self-declared.</p>
      </section>

      <section className="form-section">
        <div className="form-section-title"><span className="step-number">03</span><h2>Visibility</h2></div>
        <div className="choice-grid">
          <button className={`choice choice-card${holdingsPublic ? ' selected' : ''}`} onClick={() => setHoldingsPublic(true)}><Check size={15}/><div><strong>show my holdings</strong><small>your positions appear on cult pages</small></div></button>
          <button className={`choice choice-card${holdingsPublic ? '' : ' selected'}`} onClick={() => setHoldingsPublic(false)}><Wallet size={15}/><div><strong>keep them private</strong><small>only your handle is shown</small></div></button>
        </div>
        <div className="launch-review" style={{ marginTop: 4 }}>
          <p className="fine">{status || 'Changes are saved to your account.'}</p>
          <button className="button primary" disabled={busy} onClick={() => void save()}>{busy ? 'saving…' : 'save profile'}</button>
        </div>
      </section>
    </div>
  </>;
}
