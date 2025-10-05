import React, { useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { settingsStore, Settings } from '../../services/settingsStore';

const TabBtn:React.FC<{label:string;active:boolean;onClick:()=>void}> = ({label,active,onClick}) => (
  <button type="button" className={`px-3 h-8 rounded-full border text-[12px] ${active? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]':'bg-[var(--chip-bg)]'}`} onClick={onClick}>{label}</button>
);

const AdminSettings: React.FC = () => {
  const [tab,setTab] = useState<'org'|'fin'|'sec'|'transp'|'email'|'integr'|'import'>('org');
  const [form,setForm] = useState<Settings>(settingsStore.get());
  const set = (obj: any) => setForm(f=> ({...f, ...obj}));
  const setOrg = (k:keyof Settings['organization'], v:any)=> set({ organization: { ...form.organization, [k]: v } });
  const setPref = (k:keyof Settings['preferences'], v:any)=> set({ preferences: { ...form.preferences, [k]: v } });
  const setFin = (k:keyof Settings['finances'], v:any)=> set({ finances: { ...form.finances, [k]: v } });
  const setSec = (k:keyof Settings['security'], v:any)=> set({ security: { ...form.security, [k]: v } });
  const setTransp = (path:string, v:any)=> set({ transparency: { ...form.transparency, ...(path==='page'? { page: { ...form.transparency.page, ...v } }: { publicRequirements: { ...form.transparency.publicRequirements, ...v } }) } });

  const cancel = ()=> setForm(settingsStore.get());
  const save = ()=> { settingsStore.update(form); alert('Enregistré'); };

  return (
    <AdminPage title="Paramètres du système — (Sécurisé : aucune clé/secret dans l’UI)">
      <div className="rounded-2xl bg-[var(--color-surface)] border p-3" style={{borderColor:'var(--color-border)'}}>
        <div className="flex flex-wrap gap-2 mb-3">
          <TabBtn label="Organisation" active={tab==='org'} onClick={()=> setTab('org')} />
          <TabBtn label="Finances" active={tab==='fin'} onClick={()=> setTab('fin')} />
          <TabBtn label="Sécurité" active={tab==='sec'} onClick={()=> setTab('sec')} />
          <TabBtn label="Transparence" active={tab==='transp'} onClick={()=> setTab('transp')} />
          <TabBtn label="E-mail & SMS" active={tab==='email'} onClick={()=> setTab('email')} />
          <TabBtn label="Intégrations" active={tab==='integr'} onClick={()=> setTab('integr')} />
          <TabBtn label="Imports/Exports" active={tab==='import'} onClick={()=> setTab('import')} />
        </div>

        {tab==='org' && (
          <div className="grid md:grid-cols-3 gap-3">
            <section className="md:col-span-2 space-y-2">
              <h3 className="font-medium">Identité & Contacts</h3>
              <label className="text-[12px] text-[var(--muted-color)]">Nom légal *</label>
              <Input value={form.organization.legalName} onChange={e=> setOrg('legalName', e.target.value)} />
              <div className="grid sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[12px] text-[var(--muted-color)]">Pays *</label>
                  <Input value={form.organization.country} onChange={e=> setOrg('country', e.target.value)} placeholder="BI" />
                </div>
                <div>
                  <label className="text-[12px] text-[var(--muted-color)]">Adresse</label>
                  <Input value={form.organization.address||''} onChange={e=> setOrg('address', e.target.value)} />
                </div>
                <div>
                  <label className="text-[12px] text-[var(--muted-color)]">Email principal *</label>
                  <Input value={form.organization.email||''} onChange={e=> setOrg('email', e.target.value)} placeholder="contact@e4d.org" />
                </div>
                <div>
                  <label className="text-[12px] text-[var(--muted-color)]">Téléphone</label>
                  <Input value={form.organization.phone||''} onChange={e=> setOrg('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">Logo</label>
                <input type="file" onChange={()=> { /* mock */ alert('Uploader logo (mock)'); }} className="block w-full text-[13px] border rounded-lg p-2 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <Button variant="secondary" onClick={cancel}>Annuler</Button>
                <Button onClick={save}>Enregistrer</Button>
              </div>
            </section>
            <aside className="space-y-2">
              <h3 className="font-medium">Préférences</h3>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">Langues actives</label>
                <div className="flex gap-2">
                  {['FR','EN'].map(l=> (
                    <label key={l} className="inline-flex gap-2 items-center"><input type="checkbox" checked={form.preferences.languages.includes(l)} onChange={(e)=> {
                      const cur = new Set(form.preferences.languages); if(e.target.checked) cur.add(l); else cur.delete(l); setPref('languages', Array.from(cur));
                    }} /> {l}</label>
                  ))}
                </div>
                <label className="text-[12px] text-[var(--muted-color)]">Fuseau horaire</label>
                <select className="w-full h-9 rounded-lg border px-2" value={form.preferences.timezone} onChange={e=> setPref('timezone', e.target.value)}>
                  {['Africa/Kigali','Africa/Bujumbura','Africa/Dar_es_Salaam'].map(z=> <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </aside>
          </div>
        )}

        {tab==='fin' && (
          <div className="space-y-2">
            <h3 className="font-medium">Finances (sécurisé — pas de clés dans l’UI)</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">Devise par défaut *</label>
                <select className="w-full h-9 rounded-lg border px-2" value={form.finances.defaultCurrency} onChange={e=> setFin('defaultCurrency', e.target.value as any)}>
                  {['USD','EUR','BIF','RWF','TZS','CDF'].map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">Plafond frais admin (%)</label>
                <Input type="number" value={form.finances.adminFeeCapPct} onChange={e=> setFin('adminFeeCapPct', Number(e.target.value))} />
              </div>
            </div>
            <div className="text-[12px] text-[var(--muted-color)]">Les clés/identifiants de paiement ne sont pas configurables ici. Gérés côté serveur via variables d’environnement (ex : STRIPE_SECRET, MM_API_KEY).</div>
          </div>
        )}

        {tab==='sec' && (
          <div className="grid md:grid-cols-2 gap-3">
            <section className="space-y-2">
              <h3 className="font-medium">Politiques</h3>
              <label className="text-[12px] text-[var(--muted-color)]">Politique mot de passe</label>
              <Input value={form.security.passwordPolicy} onChange={e=> setSec('passwordPolicy', e.target.value)} />
              <label className="inline-flex gap-2 items-center"><input type="checkbox" checked={form.security.admin2FA} onChange={e=> setSec('admin2FA', e.target.checked)} /> 2FA (administrateurs)</label>
            </section>
            <aside className="space-y-2">
              <h3 className="font-medium">Gestion des secrets</h3>
              <div className="rounded-xl border p-3 text-[12px] text-[var(--muted-color)]">Principe : aucun secret dans l’UI. Utiliser variables d’environnement. Rotation & accès via DevOps ; UI affiche seulement l’état (“Configuré / Non configuré”).</div>
            </aside>
          </div>
        )}

        {tab==='transp' && (
          <div className="grid md:grid-cols-2 gap-3">
            <section className="space-y-2">
              <h3 className="font-medium">Exigences publiques</h3>
              <label className="inline-flex gap-2 items-center"><input type="checkbox" checked={form.transparency.publicRequirements.linkExpenseToMilestone} onChange={e=> setTransp('req',{ linkExpenseToMilestone: e.target.checked })} /> Lien dépense → Projet + Activité + (Milestone) + Catégorie</label>
              <label className="inline-flex gap-2 items-center"><input type="checkbox" checked={form.transparency.publicRequirements.receiptsRequired} onChange={e=> setTransp('req',{ receiptsRequired: e.target.checked })} /> Justificatifs (URL) obligatoires</label>
              <label className="inline-flex gap-2 items-center"><input type="checkbox" checked={form.transparency.publicRequirements.aggregatePlanCollectSpend} onChange={e=> setTransp('req',{ aggregatePlanCollectSpend: e.target.checked })} /> Agrégation Planifié / Collecté / Dépensé</label>
              <label className="inline-flex gap-2 items-center"><input type="checkbox" checked={form.transparency.publicRequirements.anonymizePersonal} onChange={e=> setTransp('req',{ anonymizePersonal: e.target.checked })} /> Anonymisation des données personnelles</label>
            </section>
            <aside className="space-y-2">
              <h3 className="font-medium">Page Transparence</h3>
              <label className="inline-flex gap-2 items-center"><input type="checkbox" checked={form.transparency.page.active} onChange={e=> setTransp('page',{ active: e.target.checked })} /> Active</label>
              <label className="text-[12px] text-[var(--muted-color)]">URL publique</label>
              <Input value={form.transparency.page.publicUrl||''} onChange={e=> setTransp('page',{ publicUrl: e.target.value })} placeholder="https://e4d.org/transparency" />
              <div className="text-[12px] text-[var(--muted-color)]">Note : Les éléments sensibles (API keys, OAuth secrets, SMTP, etc.) sont gérés hors UI.</div>
            </aside>
          </div>
        )}

        {tab==='email' && (
          <div className="rounded-xl border p-4 text-[13px] text-[var(--muted-color)]">Config SMTP/Provider non exposée ici (sécurisé par ENV). UI affiche seulement l’état et des tests d’envoi (à implémenter ultérieurement).</div>
        )}

        {tab==='integr' && (
          <div className="grid md:grid-cols-2 gap-3">
            <section className="space-y-2">
              <h3 className="font-medium">Intégrations de paiement (état)</h3>
              <div className="flex items-center justify-between rounded-lg border p-3"><span>Stripe (Carte)</span><span className="text-[12px] px-2 py-1 rounded-full bg-[var(--chip-bg)]">{form.integrations.stripe==='env'? 'Géré par ENV':'Désactivé'}</span></div>
              <div className="flex items-center justify-between rounded-lg border p-3"><span>Mobile Money</span><span className="text-[12px] px-2 py-1 rounded-full bg-[var(--chip-bg)]">{form.integrations.mobileMoney==='env'? 'Géré par ENV':'Désactivé'}</span></div>
            </section>
            <aside className="space-y-2">
              <h3 className="font-medium">Imports/Exports</h3>
              <div className="rounded-xl border p-3 text-[12px] text-[var(--muted-color)]">À venir : templates CSV, import des paramètres, export de configuration.</div>
            </aside>
          </div>
        )}
      </div>
    </AdminPage>
  );
};

export default AdminSettings;
