import React, { useState } from 'react';
import AdminPage from '../../../components/admin/AdminPage';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { teamStore, TeamMember } from '../../../services/teamStore';
import { useTranslation } from 'react-i18next';

const TeamCreate: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<TeamMember>>({
    role: 'operator',
    status: 'invited',
    country: 'BI',
    skills: [],
  });
  const [newSkill,setNewSkill] = useState('');

  const set = (k: keyof TeamMember, v:any)=> setForm(s=> ({...s,[k]:v }));

  const create = ()=> {
    if (!form.name || !form.email) return alert(t('common.required','Required fields are missing'));
    const member = teamStore.add({
      id: undefined as any,
      name: form.name!,
      email: form.email!,
      phone: form.phone||'',
      role: form.role||'operator',
      country: form.country||'BI',
      status: form.status||'invited',
      skills: form.skills||[],
      notes: form.notes||'',
      assignedProjects: form.assignedProjects||[],
      projectsCount: 0,
      documents: [],
    });
    navigate(`/admin/team/${member.id}`);
  };

  const addSkill = ()=> {
    const v = newSkill.trim(); if(!v) return;
    set('skills', [...(form.skills||[]), v]);
    setNewSkill('');
  };
  const removeSkill = (s:string)=> set('skills', (form.skills||[]).filter(x=> x!==s));

  return (
    <AdminPage title={t('admin.team.create','Créer un membre d\'équipe')}>
      <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Identité */}
          <section className="lg:col-span-2 space-y-3">
            <h3 className="font-medium">{t('admin.team.identity','Identité')}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[12px] text-[var(--muted-color)]">{t('common.name','Nom complet')}</label>
                <Input value={form.name||''} onChange={e=> set('name', e.target.value)} placeholder={t('admin.team.name.placeholder','Ex: Chantal Niyonsaba')} />
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">Email</label>
                <Input value={form.email||''} onChange={e=> set('email', e.target.value)} placeholder="prenom@e4d.org" />
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">{t('common.phone','Téléphone')}</label>
                <Input value={form.phone||''} onChange={e=> set('phone', e.target.value)} placeholder="+257 ..." />
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">{t('common.language','Langue')}</label>
                <select className="w-full h-9 rounded-lg border px-2" value={(form as any).lang||'FR'} onChange={e=> set('notes',(form.notes||'')+` [lang:${e.target.value}]`)}>
                  <option value="FR">FR</option>
                  <option value="EN">EN</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">{t('admin.ui.filters.country','Pays')}</label>
                <select className="w-full h-9 rounded-lg border px-2" value={form.country} onChange={e=> set('country', e.target.value)}>
                  {['BI','RW','TZ','CD','SN','IN'].map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">{t('common.role','Rôle')}</label>
                <div className="flex gap-4 items-center h-9">
                  <label className="inline-flex gap-1 items-center"><input type="radio" name="role" checked={form.role==='manager'} onChange={()=> set('role','manager')} /> {t('admin.team.role.manager','Chef de projet')}</label>
                  <label className="inline-flex gap-1 items-center"><input type="radio" name="role" checked={form.role==='operator'} onChange={()=> set('role','operator')} /> {t('admin.team.role.operator','Opérateur/Opératrice terrain')}</label>
                </div>
              </div>
              <div>
                <label className="text-[12px] text-[var(--muted-color)]">{t('admin.team.accountStatus','Statut du compte')}</label>
                <div className="flex gap-4 items-center h-9">
                  <label className="inline-flex gap-1 items-center"><input type="radio" name="status" checked={form.status==='invited'} onChange={()=> set('status','invited')} /> {t('admin.team.status.invited','Invité')}</label>
                  <label className="inline-flex gap-1 items-center"><input type="radio" name="status" checked={form.status==='active'} onChange={()=> set('status','active')} /> {t('admin.team.status.active','Actif')}</label>
                  <label className="inline-flex gap-1 items-center"><input type="radio" name="status" checked={form.status==='suspended'} onChange={()=> set('status','suspended')} /> {t('admin.team.status.suspended','Suspendu')}</label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[12px] text-[var(--muted-color)]">{t('admin.team.skills','Compétences (tags)')}</label>
              <div className="flex gap-2 items-center">
                <Input className="flex-1" value={newSkill} onChange={e=> setNewSkill(e.target.value)} placeholder="Ex: MHM/WASH" />
                <Button variant="secondary" onClick={addSkill}>{t('common.add','Ajouter')}</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(form.skills||[]).map(s=> <span key={s} className="px-2 py-1 rounded-full text-[12px] bg-[var(--chip-bg)]">{s} <button className="ml-1" onClick={()=> removeSkill(s)}>×</button></span>)}
              </div>
            </div>

            <div>
              <label className="text-[12px] text-[var(--muted-color)]">{t('admin.team.internalNotes','Notes internes (audit)')}</label>
              <textarea className="w-full rounded-lg border p-2 min-h-[88px]" value={form.notes||''} onChange={e=> set('notes', e.target.value)} placeholder={t('admin.team.notes.placeholder','Ex: Affectée sur projets région Gitega. Priorité distribution Q4.') as string} />
            </div>
          </section>

          {/* Accès & Assignations */}
          <section className="space-y-3">
            <h3 className="font-medium">{t('admin.team.initialAccess','Accès initial')}</h3>
            <div className="space-y-2 rounded-xl border p-3">
              <label className="inline-flex gap-2 items-center"><input type="checkbox" /> {t('admin.team.invite.email','Envoyer invitation par email')}</label>
              <label className="inline-flex gap-2 items-center"><input type="checkbox" /> {t('admin.team.invite.sms','Envoyer aussi par SMS')}</label>
              <label className="inline-flex gap-2 items-center"><input type="checkbox" /> 2FA {t('admin.team.invite.2fa','requis (PWA/back-office)')}</label>
              <div className="flex gap-2 items-center">
                <Input className="flex-1" placeholder={t('admin.team.tempPwd','Mot de passe temporaire (optionnel)') as string} />
                <Button variant="secondary" onClick={()=> alert('Temp password: '+ Math.random().toString(36).slice(2,8).toUpperCase())}>{t('common.generate','Générer')}</Button>
              </div>
            </div>

            <h3 className="font-medium">{t('admin.team.documents','Documents (facultatif)')}</h3>
            <div className="rounded-xl border p-6 text-center text-[13px] text-[var(--muted-color)]">
              {t('admin.team.documents.hint','Glissez-déposez / Cliquez pour téléverser')}<br/>
              <Button variant="secondary" className="mt-2" onClick={()=> alert('Uploader non connecté (mock)')}>{t('common.upload','Téléverser...')}</Button>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={()=> navigate('/admin/team')}>{t('common.cancel','Annuler')}</Button>
          <Button variant="secondary" onClick={create}>{t('admin.team.createWithoutInvite','Créer (sans invite)')}</Button>
          <Button onClick={create}>{t('admin.team.createAndInvite','Créer & inviter')}</Button>
        </div>
        <div className="mt-2 text-[12px] text-[var(--muted-color)]">{t('admin.team.tip','Astuce: vous pouvez créer sans inviter et activer plus tard.')}</div>
      </div>
    </AdminPage>
  );
};

export default TeamCreate;
