import React, { useMemo, useState } from 'react';
import { Users, Layers, UserPlus, UserMinus, FileDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import AdminPage from '../../components/admin/AdminPage';
import { listProjects, listBeneficiaries } from '../../mock/db';

const BeneficiariesManagement: React.FC = () => {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);

  const projects = useMemo(()=> listProjects(), []);
  const rows = useMemo(()=> {
    // Aggregate beneficiaries per project
    return projects.map(p => {
      const sess = listBeneficiaries(p.id);
      const females = sess.reduce((s,b)=> s + (b.females||0), 0);
      const males = sess.reduce((s,b)=> s + (b.males||0), 0);
      const total = females + males;
      const lastFile = sess.slice().sort((a,b)=> (b.date||'').localeCompare(a.date||'')).find(s=> s.file)?.file || '';
      return { id: p.id, name: p.name, organisation: p.organisation, location: p.location || '', females, males, total, file: lastFile };
    });
  },[projects]);

  const filtered = useMemo(()=> rows.filter(r=> {
    const term = q.toLowerCase().trim();
    if(!term) return true;
    return r.id.toLowerCase().includes(term) || r.name.toLowerCase().includes(term) || r.organisation.toLowerCase().includes(term) || r.location.toLowerCase().includes(term);
  }),[rows,q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/rowsPerPage));
  const pageItems = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);

  const totalBeneficiaries = rows.reduce((sum, r)=> sum + r.total, 0);
  const totalProjects = rows.length;
  const totalFemales = rows.reduce((s,r)=> s + r.females, 0);
  const totalMales = rows.reduce((s,r)=> s + r.males, 0);

  return (
    <AdminPage title={t('admin.beneficiaries')}>
      {/* Toolbar */}
      <div className="rounded-2xl bg-[var(--color-surface)] border p-3 mb-3 flex flex-wrap gap-2 items-center" style={{borderColor:'var(--color-border)'}}>
        <Input className="w-full sm:w-[320px]" placeholder={t('common.search','Search...')} value={q} onChange={(e)=> { setQ(e.target.value); setPage(1); }} />
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" className="rounded-full" onClick={()=> exportCsv(filtered)}>{t('admin.ui.actions.exportCsv','Export CSV')}</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-light rounded-lg">
                <Users className="text-primary w-5 h-5" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">{totalBeneficiaries.toLocaleString()}</div>
                <div className="text-text-secondary text-sm">{t('admin.beneficiaries.total','Total beneficiaries')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-success-light rounded-lg">
                <Layers className="text-success w-5 h-5" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">{totalProjects}</div>
                <div className="text-text-secondary text-sm">{t('admin.projects','Projects')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-light rounded-lg">
                <UserPlus className="text-primary w-5 h-5" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">{totalFemales.toLocaleString()}</div>
                <div className="text-text-secondary text-sm">{t('common.females','Females')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-light rounded-lg">
                <UserMinus className="text-primary w-5 h-5" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">{totalMales.toLocaleString()}</div>
                <div className="text-text-secondary text-sm">{t('common.males','Males')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Aggregated table by project (no individual names) */}
      <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
        <div className="p-3 border-b" style={{borderColor:'var(--color-border)'}}>
          <div className="text-[15px] font-semibold text-[var(--text-primary)]">{t('admin.beneficiaries','Beneficiaries')} — {t('common.overview','Overview')}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[var(--text-primary)]">
            <thead>
              <tr className="text-left text-[var(--color-text-secondary)]">
                <th className="py-3 pl-4 pr-4">{t('admin.ui.projects.table.id','ID')}</th>
                <th className="py-3 pr-4">{t('admin.ui.projects.table.name','Name')}</th>
                <th className="py-3 pr-4">{t('admin.ui.projects.table.organisation','Organisation')}</th>
                <th className="py-3 pr-4">{t('common.location','Location')}</th>
                <th className="py-3 pr-4">♀</th>
                <th className="py-3 pr-4">♂</th>
                <th className="py-3 pr-4">{t('common.total','Total')}</th>
                <th className="py-3 pr-4 text-right">{t('common.file','File')}</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(r=> (
                <tr key={r.id} className="border-t" style={{borderColor:'var(--color-border)'}}>
                  <td className="py-2 pl-4 pr-4">{r.id}</td>
                  <td className="py-2 pr-4">{r.name}</td>
                  <td className="py-2 pr-4">{r.organisation}</td>
                  <td className="py-2 pr-4">{r.location}</td>
                  <td className="py-2 pr-4">{r.females.toLocaleString()}</td>
                  <td className="py-2 pr-4">{r.males.toLocaleString()}</td>
                  <td className="py-2 pr-4 font-semibold">{r.total.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-right">{r.file? <button onClick={()=> downloadProjectCsv(r.id)} className="inline-flex items-center gap-1 text-[13px] underline"><FileDown className="w-4 h-4" /> {r.file}</button> : <span className="text-[12px] text-[var(--muted-color)]">—</span>}</td>
                </tr>
              ))}
              {pageItems.length===0 && (
                <tr><td colSpan={8} className="text-center py-10 text-[13px] text-[var(--muted-color)]">{t('common.noResults','No results')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-t" style={{borderColor:'var(--color-border)'}}>
          <div className="text-[12px] text-[var(--muted-color)]">{filtered.length} {t('admin.projects','Projects')} • {t('common.page','Page')} {page} / {totalPages}</div>
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

      {/* Summary footer */}
      <div className="mt-3 text-[12px] text-[var(--muted-color)]">
        {t('privacy.note','Confidentialité: les noms ne sont pas affichés ici. Les fichiers CSV par projet contiennent la liste détaillée stockée de manière sécurisée.')} 
      </div>
  </AdminPage>
  );
};

export default BeneficiariesManagement;

function exportCsv(rows: Array<{id:string; name:string; organisation:string; location:string; females:number; males:number; total:number; file:string}>){
  if(!rows.length) return;
  const headers = ['project_id','project_name','organisation','location','females','males','total','file'];
  const csv = [headers.join(','), ...rows.map(r=> [r.id,r.name,r.organisation,r.location,String(r.females),String(r.males),String(r.total),r.file||''].map(s => '"'+String(s).replace(/"/g,'""')+'"').join(','))].join('\n');
  const blob = new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='beneficiaries_projects.csv'; a.click(); URL.revokeObjectURL(a.href);
}

function downloadProjectCsv(projectId: string){
  const sess = listBeneficiaries(projectId);
  const headers = ['session_id','date','type','females','males','total'];
  const csv = [headers.join(','), ...sess.map(s=> [s.id, s.date, s.type, String(s.females), String(s.males), String(s.females + s.males)].map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`beneficiaries_${projectId}.csv`; a.click(); URL.revokeObjectURL(a.href);
}
