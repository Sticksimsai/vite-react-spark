import { useEffect } from 'react';
import { X } from 'lucide-react';

/** Minimal accessible dialog (no Radix dependency) styled with the existing .modal classes. */
export function Modal({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; description: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onOpenChange]);
  if (!open) return null;
  return <>
    <div className="modal-overlay" onClick={() => onOpenChange(false)}/>
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">{title}</h2>
      <p>{description}</p>
      <button className="icon-button modal-close" aria-label="Close dialog" onClick={() => onOpenChange(false)}><X size={19}/></button>
      {children}
    </div>
  </>;
}
