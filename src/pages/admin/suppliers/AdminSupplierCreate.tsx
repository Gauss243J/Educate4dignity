import React, { useState } from 'react';
import AdminPage from '../../../components/admin/AdminPage';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { suppliersStore, Supplier, SupplierType, SupplyMode } from '../../../services/suppliersStore';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/ui/Modal';

const AdminSupplierCreate: React.FC = () => {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [name,setName] = useState('');
  const [type,setType] = useState<SupplierType>('coop/atelier');
  const [country,setCountry] = useState('');
  const [address,setAddress] = useState('');
  const [status,setStatus] = useState<'actif'|'inactif'|'en_revue'>('actif');
  const [mode,setMode] = useState<SupplyMode>('production');

  // Contact
  const [contactName,setContactName] = useState('');
  const [contactEmail,setContactEmail] = useState('');
  const [contactPhone,setContactPhone] = useState('');

  // Production
  const [workers,setWorkers] = useState<number|''>('');
  const [womenPct,setWomenPct] = useState<number|''>('');
  const [capacity,setCapacity] = useState<number|''>('');
  const [leadTime,setLeadTime] = useState<number|''>('');
  const [prodNotes,setProdNotes] = useState('');
  // removed purchaseNotes per request
  const [description,setDescription] = useState('');

  // Compliance & docs
  const [certifications,setCertifications] = useState<string[]>([]);
  const [contractFile,setContractFile] = useState<File|null>(null);
  const [contractPreview,setContractPreview] = useState('');

  // removed portal roles per request

  const [notes,setNotes] = useState('');
  const [tags,setTags] = useState('');

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certDraft, setCertDraft] = useState('');
  const onAddCert = () => setCertModalOpen(true);
  const commitCert = () => {
    if (certDraft.trim()) setCertifications(c => [...c, certDraft.trim()]);
    setCertDraft('');
    setCertModalOpen(false);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null; setContractFile(f);
    if(f){ setContractPreview(await fileToDataUrl(f)); } else { setContractPreview(''); }
  };

  const canSubmit = name && country && type && mode;
  const onSubmit = async () => {
    const id = 'sup-'+ name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + Math.random().toString(36).slice(2,6);
    const base: Supplier = {
      id, name, type, country, address, status, mode,
      contactName, contactEmail, contactPhone,
      workers: typeof workers==='number'? workers: undefined,
      womenPct: typeof womenPct==='number'? womenPct: undefined,
      capacityPerMonth: typeof capacity==='number'? capacity: undefined,
      leadTimeDays: typeof leadTime==='number'? leadTime: undefined,
      productionNotes: prodNotes,
      description,
      certifications,
      // roles removed from create flow
      notes,
      tags: tags? tags.split(',').map(s=> s.trim()).filter(Boolean): undefined
    };
    let item = base;
    if(contractFile){
      const dataUrl = contractPreview || await fileToDataUrl(contractFile);
      item = { ...base, contractFileName: contractFile.name, contractFileType: contractFile.type, contractFileSize: contractFile.size, contractFileDataUrl: dataUrl };
    }
    suppliersStore.upsert(item);
    nav(`/admin/producers/${id}`);
  };

  return (
    <AdminPage title={t('admin.ui.suppliers.create.title','Créer fournisseur (simple)')}>
      <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Organisation */}
          <section className="space-y-3">
            <h3 className="font-semibold text-[var(--text-primary)]">{t('admin.ui.suppliers.create.org','Organisation')}</h3>
            <div>
              <label className="text-[12px]">{t('admin.ui.suppliers.create.orgName','Nom de l\'organisation')} *</label>
              <Input value={name} onChange={e=> setName(e.target.value)} placeholder="FemCo Atelier" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[12px]">{t('admin.ui.projects.table.type','Type')} *</label>
                <select value={type} onChange={e=> setType(e.target.value as SupplierType)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
                  <option value="coop/atelier">coop/atelier</option>
                  <option value="fabricant">fabricant</option>
                  <option value="commerçant">commerçant</option>
                </select>
              </div>
              <div>
                <label className="text-[12px]">{t('admin.ui.projects.filters.country','Country')} *</label>
                <Input value={country} onChange={e=> setCountry(e.target.value)} placeholder="BI" />
              </div>
            </div>
            <div>
              <label className="text-[12px]">{t('admin.ui.suppliers.create.address','Adresse')}</label>
              <Input value={address} onChange={e=> setAddress(e.target.value)} placeholder="Gitega, Zone Kanyosha" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[12px]">{t('admin.ui.table.status','Status')}</label>
                <select value={status} onChange={e=> setStatus(e.target.value as any)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
                  <option value="actif">actif</option>
                  <option value="en_revue">en_revue</option>
                  <option value="inactif">inactif</option>
                </select>
              </div>
              <div>
                <label className="text-[12px]">{t('admin.ui.suppliers.mode.title','Mode')}</label>
                <select value={mode} onChange={e=> setMode(e.target.value as SupplyMode)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
                  <option value="production">{t('admin.ui.suppliers.mode.production','Production')}</option>
                  <option value="achat">{t('admin.ui.suppliers.mode.achat','Achat')}</option>
                  <option value="hybride">{t('admin.ui.suppliers.mode.hybride','Hybride')}</option>
                </select>
              </div>
            </div>

            <h3 className="font-semibold text-[var(--text-primary)] mt-2">{t('admin.ui.suppliers.create.contact','Contact principal')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[12px]">{t('admin.ui.suppliers.create.name','Nom')} *</label>
                <Input value={contactName} onChange={e=> setContactName(e.target.value)} />
              </div>
              <div>
                <label className="text-[12px]">Email</label>
                <Input type="email" value={contactEmail} onChange={e=> setContactEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-[12px]">{t('admin.ui.suppliers.create.phone','Téléphone')}</label>
                <Input value={contactPhone} onChange={e=> setContactPhone(e.target.value)} placeholder="+257 ..." />
              </div>
            </div>

            <h3 className="font-semibold text-[var(--text-primary)] mt-2">{t('admin.ui.suppliers.create.compliance','Conformité & documents')}</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {certifications.map((c,idx)=> (
                <span key={idx} className="px-2 py-0.5 rounded-full border text-[12px]" style={{borderColor:'var(--color-border)'}}>{c}</span>
              ))}
              <button type="button" className="text-[12px] underline" onClick={onAddCert}>{t('admin.ui.suppliers.create.add','Ajouter')}</button>
            </div>
            <div>
              <label className="text-[12px]">{t('admin.ui.suppliers.create.contract','Contrat / MoU (optionnel)')}</label>
              <input type="file" onChange={onFileChange} className="block w-full text-[13px] border rounded-lg p-2 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
              {contractFile && <div className="text-[12px] text-[var(--muted-color)] mt-1">{contractFile.name} • {Math.round(contractFile.size/1024)} KB</div>}
            </div>
            {/* Add certification modal */}
            <Modal isOpen={certModalOpen} onClose={()=>{ setCertModalOpen(false); setCertDraft(''); }} title={t('admin.ui.suppliers.create.addCertification','Add certification')}>
              <div className="space-y-3">
                <Input autoFocus value={certDraft} onChange={e=> setCertDraft(e.target.value)} placeholder={t('admin.ui.suppliers.create.certPlaceholder','Ex: ISO 9001, Audit social 2024') as string} />
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={()=> { setCertModalOpen(false); setCertDraft(''); }}>{t('common.cancel','Cancel')}</Button>
                  <Button onClick={commitCert}>{t('common.add','Add')}</Button>
                </div>
              </div>
            </Modal>

            <div>
              <label className="text-[12px]">{t('admin.ui.suppliers.create.notes','Notes internes')}</label>
              <textarea value={notes} onChange={e=> setNotes(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
            </div>
            <div>
              <label className="text-[12px]">Tags</label>
              <Input value={tags} onChange={e=> setTags(e.target.value)} placeholder="fournisseur, coop, local" />
            </div>
          </section>

          {/* Approvisionnement & Portail */}
          <section className="space-y-3">
            <h3 className="font-semibold text-[var(--text-primary)]">{t('admin.ui.suppliers.create.sourcing','Approvisionnement')}</h3>
            <div>
              <label className="text-[12px]">{t('admin.ui.suppliers.create.description','Description des fournitures (libre)')}</label>
              <textarea value={description} onChange={e=> setDescription(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} placeholder="Ex: Kits menstruels réutilisables; inserts; emballages; options de personnalisation." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[12px]">{t('admin.ui.suppliers.create.workers','Nombre de travailleurs (estimation)')}</label>
                <Input type="number" value={workers} onChange={e=> setWorkers(e.target.value? Number(e.target.value): '')} />
              </div>
              <div>
                <label className="text-[12px]">% {t('admin.ui.suppliers.create.women','femmes')} (optionnel)</label>
                <Input type="number" value={womenPct} onChange={e=> setWomenPct(e.target.value? Number(e.target.value): '')} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[12px]">{t('admin.ui.suppliers.create.capacity','Capacité (optionnel)')}</label>
                <Input type="number" value={capacity} onChange={e=> setCapacity(e.target.value? Number(e.target.value): '')} placeholder="≈ 1200 kits/mois" />
              </div>
              <div>
                <label className="text-[12px]">{t('admin.ui.suppliers.create.leadTime','Lead time (optionnel)')}</label>
                <Input type="number" value={leadTime} onChange={e=> setLeadTime(e.target.value? Number(e.target.value): '')} placeholder="≈ 14 jours" />
              </div>
            </div>
            <div>
              <label className="text-[12px]">{t('admin.ui.suppliers.create.prodNotes','Notes (production)')}</label>
              <textarea value={prodNotes} onChange={e=> setProdNotes(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
            </div>
            {/* Purchase notes removed as requested */}

            {/* Portal & roles (RBAC) section removed as requested */}
            {/* Removed associated projects field as requested */}
          </section>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={()=> nav(-1)}>{t('common.cancel','Cancel')}</Button>
          <Button onClick={onSubmit} disabled={!canSubmit}>{t('common.create','Create')}</Button>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminSupplierCreate;

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
