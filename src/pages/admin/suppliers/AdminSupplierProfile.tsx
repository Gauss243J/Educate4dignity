import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage';
import { suppliersStore, SupplierUser } from '../../../services/suppliersStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useTranslation } from 'react-i18next';

const AdminSupplierProfile: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const nav = useNavigate();

  const supplier = useMemo(()=> id? suppliersStore.get(id): undefined, [id]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState({ name:'', email:'' });

  if(!supplier){
    return (
      <AdminPage title={t('admin.ui.suppliers.profile.title','Fournisseur')}> 
        <div className="p-6">{t('admin.ui.suppliers.profile.notFound','Fournisseur introuvable')}</div>
      </AdminPage>
    );
  }

  const kpi = [
    { label: t('admin.ui.suppliers.kpi.workers','Travailleurs'), value: supplier.workers ?? '—' },
    { label: t('admin.ui.suppliers.kpi.capacity','Capacité/mois'), value: supplier.capacityPerMonth ?? '—' },
    { label: t('admin.ui.suppliers.kpi.leadTime','Lead time (j)'), value: supplier.leadTimeDays ?? '—' },
  ];

  const onToggleUser = (u: SupplierUser) => {
    suppliersStore.updateUser(supplier.id, u.id, { active: !u.active });
    nav(0);
  };

  const onInvite = () => {
    if(!invite.name || !invite.email) return;
  suppliersStore.addUser(supplier.id, { id: `u-${Math.random().toString(36).slice(2,8)}`, name: invite.name, email: invite.email, role: 'transparency_readonly', active: true });
    setInvite({ name:'', email:'' });
    setInviteOpen(false);
    nav(0);
  };

  const onReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if(!f) return;
    const dataUrl = await fileToDataUrl(f);
    suppliersStore.upsert({ ...supplier, contractFileName: f.name, contractFileType: f.type, contractFileSize: f.size, contractFileDataUrl: dataUrl });
    nav(0);
  };

  return (
    <AdminPage title={supplier.name}>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {kpi.map((k, idx)=> (
          <div key={idx} className="rounded-xl border p-3" style={{borderColor:'var(--color-border)'}}>
            <div className="text-[12px] text-[var(--muted-color)]">{k.label}</div>
            <div className="text-xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <h3 className="font-semibold mb-2">{t('admin.ui.suppliers.profile.org','Organisation')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <div><span className="text-[var(--muted-color)]">{t('admin.ui.projects.table.type','Type')}:</span> {supplier.type}</div>
              <div><span className="text-[var(--muted-color)]">{t('admin.ui.suppliers.mode.title','Mode')}:</span> {supplier.mode}</div>
              <div><span className="text-[var(--muted-color)]">{t('admin.ui.projects.filters.country','Country')}:</span> {supplier.country}</div>
              <div><span className="text-[var(--muted-color)]">{t('admin.ui.table.status','Status')}:</span> {supplier.status}</div>
              <div className="sm:col-span-2"><span className="text-[var(--muted-color)]">{t('admin.ui.suppliers.create.address','Adresse')}:</span> {supplier.address || '—'}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <h3 className="font-semibold mb-2">{t('admin.ui.suppliers.profile.sourcing','Approvisionnement')}</h3>
            <div className="text-[13px] whitespace-pre-wrap">{supplier.description || '—'}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-[13px]">
              <div><span className="text-[var(--muted-color)]">{t('admin.ui.suppliers.create.workers','Travailleurs')}:</span> {supplier.workers ?? '—'}</div>
              <div><span className="text-[var(--muted-color)]">% {t('admin.ui.suppliers.create.women','femmes')}:</span> {supplier.womenPct ?? '—'}</div>
              <div><span className="text-[var(--muted-color)]">{t('admin.ui.suppliers.create.capacity','Capacité')}:</span> {supplier.capacityPerMonth ?? '—'}</div>
              <div><span className="text-[var(--muted-color)]">{t('admin.ui.suppliers.create.leadTime','Lead time')}:</span> {supplier.leadTimeDays ?? '—'}</div>
            </div>
            <div className="mt-2">
              <div className="text-[12px] text-[var(--muted-color)]">{t('admin.ui.suppliers.create.prodNotes','Notes (production)')}</div>
              <div className="text-[13px] whitespace-pre-wrap">{supplier.productionNotes || '—'}</div>
            </div>
            <div className="mt-2">
              <div className="text-[12px] text-[var(--muted-color)]">{t('admin.ui.suppliers.create.purchaseNotes','Achat')}</div>
              <div className="text-[13px] whitespace-pre-wrap">{supplier.purchaseNotes || '—'}</div>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <h3 className="font-semibold mb-2">{t('admin.ui.suppliers.profile.notes','Notes & tags')}</h3>
            <div className="text-[13px] whitespace-pre-wrap">{supplier.notes || '—'}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(supplier.tags||[]).map((tag: string, i: number)=> (
                <span key={i} className="px-2 py-0.5 rounded-full border text-[12px]" style={{borderColor:'var(--color-border)'}}>{tag}</span>
              ))}
              {(!supplier.tags || supplier.tags.length===0) && <span className="text-[12px] text-[var(--muted-color)]">—</span>}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <h3 className="font-semibold mb-2">{t('admin.ui.suppliers.profile.contact','Contact & utilisateurs')}</h3>
            <div className="text-[13px]">
              <div>{supplier.contactName || '—'}</div>
              <div className="text-[12px] text-[var(--muted-color)]">{supplier.contactEmail || '—'} • {supplier.contactPhone || '—'}</div>
            </div>
            <div className="mt-2">
              <div className="text-[12px] text-[var(--muted-color)]">{t('admin.ui.suppliers.profile.users','Utilisateurs portail')}</div>
              <div className="divide-y border rounded-lg mt-1" style={{borderColor:'var(--color-border)'}}>
                {(supplier.users||[]).map((u: SupplierUser)=> (
                  <div key={u.id} className="flex items-center justify-between px-3 py-2">
                    <div>
                      <div className="text-[13px]">{u.name} <span className="text-[12px] text-[var(--muted-color)]">• {u.role}</span></div>
                      <div className="text-[12px] text-[var(--muted-color)]">{u.email}</div>
                    </div>
                    <Button size="sm" variant={u.active? 'secondary':'primary'} onClick={()=> onToggleUser(u)}>{u.active? t('admin.ui.distributors.profile.deactivate','Désactiver'): t('admin.ui.distributors.profile.activate','Activer')}</Button>
                  </div>
                ))}
                {(!supplier.users || supplier.users.length===0) && (<div className="px-3 py-2 text-[12px] text-[var(--muted-color)]">{t('admin.ui.distributors.profile.noUsers','Aucun utilisateur')}</div>)}
              </div>
              {inviteOpen ? (
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder={t('admin.ui.distributors.profile.name','Nom') as string} value={invite.name} onChange={e=> setInvite(s=> ({...s, name:e.target.value}))} />
                    <Input placeholder="Email" value={invite.email} onChange={e=> setInvite(s=> ({...s, email:e.target.value}))} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={onInvite}>{t('admin.ui.distributors.profile.addUser','Ajouter')}</Button>
                    <Button size="sm" variant="secondary" onClick={()=> setInviteOpen(false)}>{t('common.cancel','Cancel')}</Button>
                  </div>
                </div>
              ) : (
                <Button className="mt-2" size="sm" variant="secondary" onClick={()=> setInviteOpen(true)}>{t('admin.ui.distributors.profile.addUser','Ajouter')}</Button>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <h3 className="font-semibold mb-2">{t('admin.ui.suppliers.profile.certifications','Certifications')}</h3>
            <div className="flex flex-wrap gap-2">
              {(supplier.certifications||[]).map((c: string, idx: number)=> (
                <span key={idx} className="px-2 py-0.5 rounded-full border text-[12px]" style={{borderColor:'var(--color-border)'}}>{c}</span>
              ))}
              {(!supplier.certifications || supplier.certifications.length===0) && <span className="text-[12px] text-[var(--muted-color)]">—</span>}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <h3 className="font-semibold mb-2">{t('admin.ui.suppliers.profile.contract','Contrat')}</h3>
            {supplier.contractFileName ? (
              <div className="text-[13px]">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div>{supplier.contractFileName}</div>
                    <div className="text-[12px] text-[var(--muted-color)]">{supplier.contractFileType || '—'} • {Math.round((supplier.contractFileSize||0)/1024)} KB</div>
                  </div>
                  {supplier.contractFileDataUrl && (
                    <a className="text-sm underline" href={supplier.contractFileDataUrl} download>{t('admin.ui.distributors.profile.download','Télécharger')}</a>
                  )}
                </div>
                <div className="mt-2">
                  <label className="text-[12px] block mb-1">{t('admin.ui.suppliers.profile.replace','Remplacer fichier')}</label>
                  <input type="file" onChange={onReupload} className="block w-full text-[13px] border rounded-lg p-2 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
                </div>
              </div>
            ) : (
              <div>
                <div className="text-[12px] text-[var(--muted-color)] mb-1">{t('admin.ui.suppliers.profile.noContract','Aucun fichier')}</div>
                <input type="file" onChange={onReupload} className="block w-full text-[13px] border rounded-lg p-2 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
              </div>
            )}
          </div>
        </aside>
      </div>
    </AdminPage>
  );
};

export default AdminSupplierProfile;

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
