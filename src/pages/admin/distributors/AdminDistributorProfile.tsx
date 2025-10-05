import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPage from '../../../components/admin/AdminPage';
import { distributorsStore, Distributor, DistributorUser } from '../../../services/distributorsStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useTranslation } from 'react-i18next';

const AdminDistributorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dist: Distributor | undefined = useMemo(()=> id? distributorsStore.get(id): undefined, [id]);

  const kpis = useMemo(()=> ({
    activeProjects: dist?.activeProjects ?? 0,
    volume: dist?.volumeDelivered ?? 0,
    satisfaction: dist?.satisfaction ?? 0,
    lastReport: dist?.lastReportAt?.slice(0,10) ?? '—'
  }),[dist]);

  // Add-user modal
  const [openAdd,setOpenAdd] = useState(false);
  const [newUser,setNewUser] = useState<Pick<DistributorUser,'name'|'email'|'role'>>({name:'', email:'', role:'benef_entry'});

  if(!dist){
    return <AdminPage title={t('admin.ui.distributors.profile.title','Distributor profile')}><div className="p-6">{t('admin.ui.distributors.profile.notFound','Distributor not found.')}</div></AdminPage>;
  }

  const statusChip = (s:string) => s==='actif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : s==='en_revue' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200';

  const onAddUser = () => {
    if(!id) return;
    if(!newUser.name || !newUser.email) return;
    distributorsStore.addUser(id,{ id:'', name:newUser.name, email:newUser.email, role:newUser.role, active:true, lastAccess: new Date().toISOString()});
    setOpenAdd(false);
    navigate(0 as any);
  };

  const toggleUserActive = (uid:string, active:boolean) => { if(!id) return; distributorsStore.updateUser(id, uid, { active: !active }); navigate(0 as any); };

  return (
    <AdminPage title={`${t('admin.distributors','Distributors')} • ${dist.name}`}>
      {/* Header */}
      <div className="rounded-2xl bg-[var(--color-surface)] border p-4 mb-4" style={{borderColor:'var(--color-border)'}}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-[18px] font-semibold text-[var(--text-primary)]">{dist.name}</div>
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="px-2 py-0.5 rounded-full border" style={{borderColor:'var(--color-border)'}}>{dist.type}</span>
              <span className={`px-2 py-0.5 rounded-full border ${statusChip(dist.status)}`}>{dist.status}</span>
              <span className="text-[var(--muted-color)]">{dist.country}</span>
              {dist.contactEmail && <span className="text-[var(--muted-color)]">• {dist.contactEmail}</span>}
              {dist.contactPhone && <span className="text-[var(--muted-color)]">• {dist.contactPhone}</span>}
            </div>
          </div>
          <div className="flex gap-3">
            <Kpi label={t('admin.ui.projects.projects','Projets en cours')} value={kpis.activeProjects} />
            <Kpi label={t('admin.ui.distributors.volume','Volume distribué (kits)')} value={kpis.volume.toLocaleString()} />
            <Kpi label={t('admin.ui.distributors.satisfaction','Satisfaction moyenne')} value={`${kpis.satisfaction.toFixed ? kpis.satisfaction.toFixed(1): kpis.satisfaction} / 5`} />
            <Kpi label={t('admin.ui.distributors.profile.lastReport','Dernier rapport')} value={kpis.lastReport} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Users */}
        <div className="lg:col-span-2 rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
          <div className="p-3 border-b flex items-center justify-between" style={{borderColor:'var(--color-border)'}}>
            <div className="text-[15px] font-semibold text-[var(--text-primary)]">{t('admin.ui.distributors.profile.users','Users')}</div>
            <Button variant="secondary" size="sm" onClick={()=> setOpenAdd(true)}>{t('admin.ui.distributors.profile.addUser','Add user')}</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-[var(--text-primary)]">
              <thead>
                <tr className="text-left text-[var(--color-text-secondary)]">
                  <th className="py-3 pl-4 pr-4">{t('common.title','Title')}</th>
                  <th className="py-3 pr-4">{t('common.email','Email')}</th>
                  <th className="py-3 pr-4">{t('admin.ui.distributors.profile.role','Role')}</th>
                  <th className="py-3 pr-4">{t('admin.ui.distributors.profile.lastAccess','Last access')}</th>
                  <th className="py-3 pr-4 text-right">{t('admin.ui.table.actions','Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {(dist.users||[]).map(u=> (
                  <tr key={u.id} className="border-t" style={{borderColor:'var(--color-border)'}}>
                    <td className="py-2 pl-4 pr-4">{u.name}</td>
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded-full border text-[11px]" style={{borderColor:'var(--color-border)'}}>{u.role}</span></td>
                    <td className="py-2 pr-4">{(u.lastAccess||'').slice(0,16).replace('T',' ')}</td>
                    <td className="py-2 pr-4 text-right">
                      <Button size="sm" variant="secondary" onClick={()=> toggleUserActive(u.id, !!u.active)}>
                        {u.active? t('admin.ui.distributors.profile.deactivate','Deactivate') : t('admin.ui.distributors.profile.activate','Activate')}
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!dist.users || dist.users.length===0) && (
                  <tr><td colSpan={5} className="text-center py-10 text-[13px] text-[var(--muted-color)]">{t('admin.ui.distributors.profile.noUsers','No users')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Details */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
            <div className="p-3 border-b" style={{borderColor:'var(--color-border)'}}>
              <div className="text-[15px] font-semibold text-[var(--text-primary)]">{t('admin.ui.distributors.profile.associatedProjects','Associated projects')}</div>
            </div>
            <div className="p-3">
              {dist.associatedProjects?.length ? (
                <ul className="list-disc pl-5 text-[13px] text-[var(--text-primary)]">
                  {dist.associatedProjects.map(p=> <li key={p}>{p}</li>)}
                </ul>
              ) : <div className="text-[13px] text-[var(--muted-color)]">{t('admin.ui.distributors.profile.noProjects','No associated projects')}</div>}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
            <div className="p-3 border-b" style={{borderColor:'var(--color-border)'}}>
              <div className="text-[15px] font-semibold text-[var(--text-primary)]">{t('admin.ui.distributors.profile.notes','Notes')}</div>
            </div>
            <div className="p-3 text-[13px] text-[var(--text-primary)] whitespace-pre-wrap">{dist.notes || '—'}</div>
          </div>

          {(dist.agreementFileName || dist.agreementFileSize) && (
            <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
              <div className="p-3 border-b" style={{borderColor:'var(--color-border)'}}>
                <div className="text-[15px] font-semibold text-[var(--text-primary)]">{t('admin.ui.distributors.profile.agreement','Agreement')}</div>
              </div>
              <div className="p-3 text-[13px] text-[var(--text-primary)]">
                <div>{dist.agreementFileName}</div>
                <div className="text-[12px] text-[var(--muted-color)]">{(dist.agreementFileType||'')} • {dist.agreementFileSize? `${Math.round((dist.agreementFileSize/1024))} KB`: ''}</div>
                {dist.agreementFileDataUrl && (
                  <div className="mt-2">
                    <a href={dist.agreementFileDataUrl} download={dist.agreementFileName || 'agreement'} className="underline text-[var(--primary-accent)]">{t('admin.ui.distributors.profile.download','Download')}</a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add user modal */}
      <Modal isOpen={openAdd} onClose={()=> setOpenAdd(false)} title={t('admin.ui.distributors.profile.addUser','Add user')}>
        <div className="space-y-3">
          <div>
            <label className="text-[12px]">{t('common.title','Title')}</label>
            <Input value={newUser.name} onChange={e=> setNewUser(u=> ({...u, name:e.target.value}))} />
          </div>
          <div>
            <label className="text-[12px]">{t('common.email','Email')}</label>
            <Input type="email" value={newUser.email} onChange={e=> setNewUser(u=> ({...u, email:e.target.value}))} />
          </div>
          <div>
            <label className="text-[12px]">{t('admin.ui.distributors.profile.role','Role')}</label>
            <select value={newUser.role} onChange={e=> setNewUser(u=> ({...u, role: e.target.value as any}))} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
              <option value="benef_entry">benef_entry</option>
              <option value="supply_updates">supply_updates</option>
              <option value="upload_reports">upload_reports</option>
              <option value="transparency_readonly">transparency_readonly</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={()=> setOpenAdd(false)}>{t('common.cancel')}</Button>
            <Button onClick={onAddUser} disabled={!newUser.name || !newUser.email}>{t('common.submit')}</Button>
          </div>
        </div>
      </Modal>
    </AdminPage>
  );
};

export default AdminDistributorProfile;

const Kpi: React.FC<{label:string; value: React.ReactNode}> = ({label,value}) => (
  <div className="rounded-xl p-3 bg-[var(--chip-bg)] border text-center min-w-[120px]" style={{borderColor:'var(--color-border)'}}>
    <div className="text-[11px] text-[var(--muted-color)]">{label}</div>
    <div className="text-[18px] font-bold text-[var(--text-primary)]">{value}</div>
  </div>
);
