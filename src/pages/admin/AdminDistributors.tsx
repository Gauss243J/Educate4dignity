import React, { useMemo, useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { distributorsStore, Distributor, toCsv } from '../../services/distributorsStore';
import { Button } from '../../components/ui/Button';

const AdminDistributors: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [q,setQ] = useState('');
  const [status,setStatus] = useState<'all'|'actif'|'inactif'|'en_revue'>('all');
  const [country,setCountry] = useState<'all'|string>('all');
  const [page,setPage] = useState(1);
  const [rowsPerPage,setRowsPerPage] = useState(25);

  const all = distributorsStore.list();
  const countries = useMemo(()=> ['all',...Array.from(new Set(all.map(d=> d.country||'').filter(Boolean)))] as const,[all]);

  const filtered = useMemo(()=> all.filter(d=> {
    const s = q.trim().toLowerCase();
    if(s){
      const hay = `${d.name} ${d.contactName} ${d.contactEmail} ${d.contactPhone}`.toLowerCase();
      if(!hay.includes(s)) return false;
    }
    if(status!=='all' && d.status!==status) return false;
    if(country!=='all' && d.country!==country) return false;
    return true;
  }),[all,q,status,country]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/rowsPerPage));
  const pageItems = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);

  const kpis = useMemo(()=> ({
    total: all.length,
    active: all.filter(d=> d.status==='actif').length,
    volume: all.reduce((s,d)=> s + (d.volumeDelivered||0), 0),
    satisfaction: all.length? (all.reduce((s,d)=> s + (d.satisfaction||0), 0)/all.length).toFixed(1): '—'
  }),[all]);

  const exportCsv = () => {
    const rows = filtered.map(d=> ({
      id:d.id, name:d.name, type:d.type, country:d.country, contact:d.contactName||'', email:d.contactEmail||'', phone:d.contactPhone||'', status:d.status, activeProjects:d.activeProjects||0, volume:d.volumeDelivered||0, satisfaction:d.satisfaction||''
    }));
    const csv = toCsv(rows);
    const blob = new Blob([csv],{type:'text/csv'}); const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='distributors.csv'; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
  <AdminPage title={t('admin.distributors','Distributors')} actions={<div className="flex gap-2"><Button variant="secondary" onClick={exportCsv}>{t('admin.ui.actions.exportCsv','Export CSV')}</Button><Button onClick={()=> navigate('/admin/distributors/new')}>{t('common.create','Create')}</Button></div>}>
      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label={t('admin.ui.kpis.total','Nb distributeurs')} value={kpis.total} />
        <Kpi label={t('admin.ui.kpis.activeProjects','Active projects')} value={kpis.active} />
        <Kpi label={t('admin.ui.distributors.volume','Volume distribué (kits)')} value={kpis.volume.toLocaleString()} />
        <Kpi label={t('admin.ui.distributors.satisfaction','Satisfaction moyenne')} value={`${kpis.satisfaction} / 5`} />
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-[var(--color-surface)] border p-3 mb-3 flex flex-wrap gap-2 items-center" style={{borderColor:'var(--color-border)'}}>
        <input value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} placeholder={t('common.search','Search...')} className="h-10 w-full sm:w-[320px] pl-3 pr-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
        <select value={status} onChange={e=> { setStatus(e.target.value as any); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          <option value="all">{t('admin.ui.filters.all','All')}</option>
          <option value="actif">{t('admin.ui.status.active','active')}</option>
          <option value="inactif">{t('admin.ui.status.inactive','inactive')}</option>
          <option value="en_revue">{t('admin.ui.status.pending','in progress')}</option>
        </select>
        <select value={country} onChange={e=> { setCountry(e.target.value as any); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          {countries.map(c=> <option key={c} value={c}>{c==='all'? t('admin.ui.filters.all','All'):c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
        <div className="p-3 border-b" style={{borderColor:'var(--color-border)'}}>
          <div className="text-[15px] font-semibold text-[var(--text-primary)]">{t('admin.ui.distributors.listTitle','Liste des distributeurs')}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[var(--text-primary)]">
            <thead>
              <tr className="text-left text-[var(--color-text-secondary)]">
                <th className="py-3 pl-4 pr-4">{t('common.title','Title')}</th>
                <th className="py-3 pr-4">{t('admin.ui.projects.table.type','Type')}</th>
                <th className="py-3 pr-4">{t('admin.ui.projects.filters.country','Country')}</th>
                <th className="py-3 pr-4">{t('admin.ui.distributors.contact','Contact principal')}</th>
                <th className="py-3 pr-4">{t('admin.ui.projects.projects','Projets en cours')}</th>
                <th className="py-3 pr-4">{t('admin.ui.table.status','Status')}</th>
                <th className="py-3 pr-4">{t('common.updated','Updated')}</th>
                <th className="py-3 pr-4 text-right">{t('admin.ui.table.actions','Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(d=> <Row key={d.id} d={d} />)}
              {pageItems.length===0 && (
                <tr><td colSpan={8} className="text-center py-10 text-[13px] text-[var(--muted-color)]">{t('common.noResults','No results')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-t" style={{borderColor:'var(--color-border)'}}>
          <div className="text-[12px] text-[var(--muted-color)]">{filtered.length} {t('admin.distributors','Distributors')} • {t('common.page','Page')} {page} / {totalPages}</div>
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-[var(--muted-color)]">Rows:</label>
            <select className="h-8 px-2 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={rowsPerPage} onChange={e=>{ setRowsPerPage(Number(e.target.value)); setPage(1); }}>
              {[10,25,50].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <button aria-label="Previous page" disabled={page===1} onClick={()=> setPage(p=> Math.max(1,p-1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>‹</button>
            {Array.from({length: totalPages}).slice(0,7).map((_,i)=> {
              const n = i+1; const active = n===page; return (
                <button key={n} aria-current={active? 'page':undefined} onClick={()=> setPage(n)} className={`w-8 h-8 rounded-full text-[12px] border ${active? 'bg-[var(--color-primary)] text-white':'bg-[var(--chip-bg)] text-[var(--text-primary)] hover:brightness-95'}`} style={{borderColor:'var(--color-border)'}}>{n}</button>
              );
            })}
            <button aria-label="Next page" disabled={page===totalPages} onClick={()=> setPage(p=> Math.min(totalPages,p+1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>›</button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminDistributors;

const Row: React.FC<{d:Distributor}> = ({d}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <tr className="border-t" style={{borderColor:'var(--color-border)'}}>
      <td className="py-2 pl-4 pr-4"><div className="font-medium text-[var(--text-primary)]">{d.name}</div></td>
      <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded-full text-[11px] border" style={{borderColor:'var(--color-border)', color:'var(--text-primary)'}}>{d.type}</span></td>
      <td className="py-2 pr-4">{d.country}</td>
      <td className="py-2 pr-4"><div>{d.contactName||'—'}</div><div className="text-[11px] text-[var(--muted-color)]">{d.contactEmail||'—'}</div></td>
      <td className="py-2 pr-4">{d.activeProjects||0}</td>
      <td className="py-2 pr-4"><span className={`px-2 py-0.5 rounded-full text-[11px] border ${d.status==='actif'?'bg-emerald-50 text-emerald-700 border-emerald-200': d.status==='en_revue'?'bg-amber-50 text-amber-700 border-amber-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>{d.status}</span></td>
      <td className="py-2 pr-4">{(d.updatedAt||d.createdAt||'').slice(0,10) || '—'}</td>
      <td className="py-2 pr-4 text-right"><Button size="sm" variant="secondary" onClick={()=> navigate(`/admin/distributors/${d.id}`)}>{t('common.view','View')}</Button></td>
    </tr>
  );
};

const Kpi: React.FC<{label:string; value: React.ReactNode}> = ({label,value}) => (
  <div className="rounded-2xl p-4 bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}> 
    <div className="text-[12px] text-[var(--muted-color)]">{label}</div>
    <div className="text-[22px] font-bold text-[var(--text-primary)]">{value}</div>
  </div>
);
