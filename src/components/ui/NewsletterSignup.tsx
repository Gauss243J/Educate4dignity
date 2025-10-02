import React, { useState } from 'react';
import { Send } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [error, setError] = useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!emailRegex.test(email)) { setError('Adresse invalide'); setStatus('error'); return; }
    setStatus('loading'); setError('');
    try {
      // Placeholder: simulate API call
      await new Promise(r=> setTimeout(r, 800));
      setStatus('success');
    } catch(err:any){
      setStatus('error'); setError('Échec, réessayez');
    }
  };

  return (
    <div>
      <h4 className="font-bold text-sm mb-2" style={{color:'var(--slate-900)'}}>Newsletter</h4>
      <p className="text-[13px] mb-3" style={{color:'var(--slate-600)'}}>Inscrivez-vous pour des mises à jour mensuelles.</p>
      {status==='success' ? (
        <div className="text-sm font-medium text-[var(--rose-600)]">Merci ! Vérifiez votre email.</div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={e=> setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="flex-1 px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--rose-300)]"
              style={{borderColor:'var(--rose-200)',background:'#fff'}}
              disabled={status==='loading'}
              aria-label="Email"
            />
            <button
              type="submit"
              disabled={status==='loading'}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white disabled:opacity-50"
              aria-label="S'inscrire"
            >
              <Send className="w-4 h-4" />
              <span>S'inscrire</span>
            </button>
          </div>
          {error && <div className="text-xs text-[var(--rose-600)]">{error}</div>}
        </form>
      )}
      <div className="mt-2 text-[11px] leading-snug" style={{color:'var(--slate-500)'}}>Protection des données: désabonnement en un clic dans chaque email.</div>
    </div>
  );
};

export default NewsletterSignup;
