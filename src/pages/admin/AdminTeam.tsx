import React, { useMemo, useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useTranslation } from 'react-i18next';
import { teamStore } from '../../services/teamStore';
import { useNavigate } from 'react-router-dom';

const AdminTeam: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [q,setQ] = useState('');
  const [role,setRole] = useState<'all'|'manager'|'operator'>('all');
  const [country,setCountry] = useState<'all'|string>('all');
  const [rowsPerPage,setRowsPerPage] = useState(25);
  const [page,setPage] = useState(1);
  const [selected,setSelected] = useState<string[]>([]);

  const all = useMemo(()=> teamStore.list(),[]);
  const countries = useMemo(()=> Array.from(new Set(all.map(x=>x.country))).sort(),[all]);
  const filtered = useMemo(()=> all.filter(m=> {
    const term = q.toLowerCase().trim();
    if (term && !(m.name.toLowerCase().includes(term) || m.email.toLowerCase().includes(term) || (m.phone||'').toLowerCase().includes(term))) return false;
    if (role!=='all' && m.role!==role) return false;
    if (country!=='all' && m.country!==country) return false;
    return true;
  }),[all,q,role,country]);
  const totalPages = Math.max(1, Math.ceil(filtered.length/rowsPerPage));
  const pageItems = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);

  const managers = all.filter(x=>x.role==='manager').length;
  const operators = all.filter(x=>x.role==='operator').length;
  const activeProjects = all.reduce((s,m)=> s + (m.projectsCount||0), 0); // sum; demo proxy
  const openTasks = 57; // placeholder KPI from mock screenshot

  const toggleAll = (checked:boolean)=> {
    setSelected(checked? pageItems.map(r=> r.id): []);
  };
  const toggleOne = (id:string, checked:boolean)=> {
    setSelected(s=> checked? Array.from(new Set([...s,id])): s.filter(x=> x!==id));
  };

  const bulkAction = (action:'activate'|'suspend'|'resetPwd')=> {
    if (!selected.length) return;
    if (action==='resetPwd') {
      alert(t('admin.team.resetSent','Password reset instructions sent to selected users.'));
      return;
    }
    selected.forEach(id=> teamStore.update(id, { status: action==='activate'? 'active':'suspended' }));
    setSelected([]);
  };

  const onImportCsv = async ()=> {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.csv';
    input.onchange = async ()=> {
      const file = input.files?.[0]; if(!file) return;
      const text = await file.text();
      teamStore.importCsv(text);
      window.location.reload();
    };
    input.click();
  };
  const onExportCsv = ()=> {
    const csv = teamStore.toCsv(filtered);
    const blob = new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='team.csv'; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <AdminPage title={t('admin.team','Team')}>
      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <Kpi label={t('admin.team.kpis.managers','Chefs de projet')} value={managers} />
        <Kpi label={t('admin.team.kpis.operators','Opérateurs terrain')} value={operators} />
        <Kpi label={t('admin.team.kpis.activeProjects','Projets actifs')} value={activeProjects} />
        <Kpi label={t('admin.team.kpis.openTasks','Tâches ouvertes')} value={openTasks} />
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl bg-[var(--color-surface)] border p-3 mb-3 flex flex-wrap gap-2 items-center" style={{borderColor:'var(--color-border)'}}>
        <Input className="w-full sm:w-[340px]" placeholder={t('admin.team.search','Rechercher (nom, email, téléphone)')} value={q} onChange={e=>{ setQ(e.target.value); setPage(1);} } />
        <select className="h-9 px-3 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={role} onChange={e=> { setRole(e.target.value as any); setPage(1); }}>
          <option value="all">{t('admin.ui.filters.role','Rôle')}</option>
          <option value="manager">{t('admin.team.role.manager','Chef de projet')}</option>
          <option value="operator">{t('admin.team.role.operator','Opérateur terrain')}</option>
        </select>
        <select className="h-9 px-3 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={country} onChange={e=> { setCountry(e.target.value); setPage(1); }}>
          <option value="all">{t('admin.ui.filters.country','Pays')}</option>
          {countries.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" className="rounded-full" onClick={onImportCsv}>{t('admin.ui.actions.importCsv','Importer CSV')}</Button>
          <Button variant="secondary" size="sm" className="rounded-full" onClick={onExportCsv}>{t('admin.ui.actions.exportCsv','Exporter CSV')}</Button>
          <Button size="sm" className="rounded-full" onClick={()=> navigate('/admin/team/new')}>{t('common.create','Créer')}</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-text-secondary)]">
                <th className="py-3 pl-4 pr-2"><input type="checkbox" aria-label="select all" checked={selected.length===pageItems.length && pageItems.length>0} onChange={e=> toggleAll(e.target.checked)} /></th>
                <th className="py-3 pr-4">{t('common.name','Nom')}</th>
                <th className="py-3 pr-4">Email / {t('common.phone','Téléphone')}</th>
                <th className="py-3 pr-4">{t('common.role','Rôle')}</th>
                <th className="py-3 pr-4">{t('admin.ui.filters.country','Pays')}</th>
                <th className="py-3 pr-4">{t('admin.team.projects','Projets (#)')}</th>
                <th className="py-3 pr-4">{t('admin.team.lastAccess','Dernier accès')}</th>
                <th className="py-3 pr-4">{t('common.details','Détails')}</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(m=> (
                <tr key={m.id} className="border-t hover:bg-[var(--chip-bg)]/60" style={{borderColor:'var(--color-border)'}} onClick={(e)=> { if((e.target as HTMLElement).closest('input,button,a')) return; navigate(`/admin/team/${m.id}`); }}>
                  <td className="py-2 pl-4 pr-2"><input type="checkbox" checked={selected.includes(m.id)} onChange={e=> toggleOne(m.id, e.target.checked)} onClick={e=> e.stopPropagation()} /></td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--chip-bg)] flex items-center justify-center text-[11px] font-semibold">{(m.name||'?').slice(0,1)}</div>
                      <div className="leading-tight">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-[12px] text-[var(--muted-color)]">{m.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 pr-4"><div className="flex flex-col"><span>{m.email}</span><span className="text-[12px] text-[var(--muted-color)]">{m.phone||'—'}</span></div></td>
                  <td className="py-2 pr-4">{m.role==='manager'? <Badge size="sm" variant="secondary">{t('admin.team.role.manager','Chef de projet')}</Badge> : <Badge size="sm" variant="secondary">{t('admin.team.role.operator','Opérateur terrain')}</Badge>}</td>
                  <td className="py-2 pr-4">{m.country}</td>
                  <td className="py-2 pr-4">{m.projectsCount??0}</td>
                  <td className="py-2 pr-4">{m.lastAccess? new Date(m.lastAccess).toLocaleString(): '—'}</td>
                  <td className="py-2 pr-4"><button className="underline" onClick={(e)=> { e.stopPropagation(); navigate(`/admin/team/${m.id}`); }}>{t('common.view','Voir')}</button></td>
                </tr>
              ))}
              {pageItems.length===0 && <tr><td colSpan={8} className="text-center py-10 text-[13px] text-[var(--muted-color)]">{t('common.noResults','Aucun résultat')}</td></tr>}
            </tbody>
          </table>
        </div>
        {/* Footer / bulk actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-t" style={{borderColor:'var(--color-border)'}}>
          <div className="flex items-center gap-2">
            <select className="h-9 px-3 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
              <option>{t('admin.team.bulk.action','Actions en masse')}</option>
            </select>
            <Button variant="secondary" size="sm" className="rounded-full" onClick={()=> bulkAction('activate')}>{t('admin.team.bulk.activate','Activer')}</Button>
            <Button variant="secondary" size="sm" className="rounded-full" onClick={()=> bulkAction('suspend')}>{t('admin.team.bulk.suspend','Suspendre')}</Button>
            <Button variant="secondary" size="sm" className="rounded-full" onClick={()=> bulkAction('resetPwd')}>{t('admin.team.bulk.resetPwd','Réinit. mot de passe')}</Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-[var(--muted-color)]">Rows:</label>
            <select className="h-8 px-2 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={rowsPerPage} onChange={e=>{ setRowsPerPage(Number(e.target.value)); setPage(1); }}>
              {[10,25,50].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <button aria-label="Previous page" disabled={page===1} onClick={()=> setPage(p=> Math.max(1,p-1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>‹</button>
            {Array.from({length: totalPages}).slice(0,7).map((_,i)=> { const n=i+1; const active=n===page; return (
              <button key={n} aria-current={active? 'page':undefined} onClick={()=> setPage(n)} className={`w-8 h-8 rounded-full text-[12px] border ${active? 'bg-[var(--color-primary)] text-white':'bg-[var(--chip-bg)] text-[var(--text-primary)] hover:brightness-95'}`} style={{borderColor:'var(--color-border)'}}>{n}</button>
            );})}
            <button aria-label="Next page" disabled={page===totalPages} onClick={()=> setPage(p=> Math.min(totalPages,p+1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>›</button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

const Kpi = ({label,value}:{label:string; value:number|string}) => (
  <Card>
    <CardContent className="py-4">
      <div className="flex items-center">
        <div className="p-2 bg-primary-light rounded-lg w-8 h-8"/>
        <div className="ml-4">
          <div className="text-2xl font-bold text-text-primary">{value}</div>
          <div className="text-text-secondary text-sm">{label}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AdminTeam;
