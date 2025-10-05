import React, { useState } from 'react';
import AdminPage from '../../../components/admin/AdminPage';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { distributorsStore, Distributor, DistributorType } from '../../../services/distributorsStore';
import { useTranslation } from 'react-i18next';

const AdminDistributorCreate: React.FC = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [name,setName] = useState('');
  const [type,setType] = useState<DistributorType>('association');
  const [country,setCountry] = useState('');
  const [status,setStatus] = useState<'actif'|'inactif'|'en_revue'>('actif');
  const [contactName,setContactName] = useState('');
  const [contactEmail,setContactEmail] = useState('');
  const [contactPhone,setContactPhone] = useState('');
  const [agreementFile,setAgreementFile] = useState<File|null>(null);
  const [agreementPreview,setAgreementPreview] = useState<string>('');

  const canSubmit = name && country;

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setAgreementFile(f);
    if(f){
      const url = await fileToDataUrl(f);
      setAgreementPreview(url);
    } else {
      setAgreementPreview('');
    }
  };

  const onSubmit = async () => {
    const id = 'dist-'+ name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') + '-' + Math.random().toString(36).slice(2,6);
    const base: Distributor = { id, name, type, country, status, contactName, contactEmail, contactPhone, activeProjects:0, volumeDelivered:0, satisfaction:0 };
    let item: Distributor = base;
    if(agreementFile){
      const dataUrl = agreementPreview || await fileToDataUrl(agreementFile);
      item = { ...base, agreementFileName: agreementFile.name, agreementFileSize: agreementFile.size, agreementFileType: agreementFile.type, agreementFileDataUrl: dataUrl };
    }
    distributorsStore.upsert(item);
    nav(`/admin/distributors/${id}`);
  };

  return (
    <AdminPage title={t('admin.ui.distributors.create.title','New distributor')}>
      <div className="rounded-2xl bg-[var(--color-surface)] border p-4 max-w-2xl" style={{borderColor:'var(--color-border)'}}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[12px]">{t('common.title','Title')}</label>
            <Input value={name} onChange={e=> setName(e.target.value)} placeholder={t('admin.ui.distributors.create.placeholders.name','Ex: Ecole Kanyosha')} />
          </div>
          <div>
            <label className="text-[12px]">{t('admin.ui.projects.table.type','Type')}</label>
            <select value={type} onChange={e=> setType(e.target.value as DistributorType)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
              <option value="association">association</option>
              <option value="ecole">ecole</option>
              <option value="ONG">ONG</option>
              <option value="institution">institution</option>
            </select>
          </div>
          <div>
            <label className="text-[12px]">{t('admin.ui.projects.filters.country','Country')}</label>
            <Input value={country} onChange={e=> setCountry(e.target.value)} placeholder="BI" />
          </div>
          <div>
            <label className="text-[12px]">{t('admin.ui.table.status','Status')}</label>
            <select value={status} onChange={e=> setStatus(e.target.value as any)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
              <option value="actif">actif</option>
              <option value="en_revue">en_revue</option>
              <option value="inactif">inactif</option>
            </select>
          </div>
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[12px]">{t('admin.ui.distributors.contact','Main contact')}</label>
              <Input value={contactName} onChange={e=> setContactName(e.target.value)} />
            </div>
            <div>
              <label className="text-[12px]">{t('common.email','Email')}</label>
              <Input type="email" value={contactEmail} onChange={e=> setContactEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-[12px]">{t('admin.ui.projects.table.type','Type')}</label>
              <Input value={contactPhone} onChange={e=> setContactPhone(e.target.value)} placeholder="+257 ..." />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-[12px]">{t('admin.ui.distributors.create.contract','Contract (optional)')}</label>
            <input type="file" onChange={onFileChange} className="block w-full text-[13px] border rounded-lg p-2 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
            {agreementPreview && (
              <div className="mt-2 text-[12px] text-[var(--muted-color)]">{t('admin.ui.distributors.create.selected','Selected')}: {agreementFile?.name} • {agreementFile ? Math.round(agreementFile.size/1024) : 0} KB</div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={()=> nav(-1)}>{t('common.cancel')}</Button>
          <Button onClick={onSubmit} disabled={!canSubmit}>{t('common.create')}</Button>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminDistributorCreate;

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
