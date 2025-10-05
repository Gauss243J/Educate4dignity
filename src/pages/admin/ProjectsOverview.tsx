import React, { useMemo, useState, useEffect } from 'react';
import FilterSelect from '../../components/admin/filters/FilterSelect';
import KpiCard from '../../components/admin/KpiCard';
import { useProjectsData } from '../../hooks/useProjectsData';
import { useTranslation } from 'react-i18next';
import AdminPage from '../../components/admin/AdminPage';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const statusColors: Record<string,string> = {
  'réussi':'text-emerald-600','en cours':'text-orange-600','soumis':'text-violet-600','validé':'text-emerald-600','remboursé':'text-slate-500','rejeté':'text-red-600','draft':'text-slate-400','actif':'text-sky-600','en pause':'text-amber-600','clos':'text-rose-600'
};

const ProjectsOverview: React.FC = () => {
  const { rows, kpis, loading, error } = useProjectsData();
  const { t } = useTranslation();
  const [search,setSearch] = useState('');
  // Derive option lists
  const ALL = 'Tous';
  const types = useMemo(()=> Array.from(new Set(rows.map(r=> r.type))).sort(), [rows]);
  const statuses = useMemo(()=> Array.from(new Set(rows.map(r=> r.status))).sort(), [rows]);
  const orgs = useMemo(()=> Array.from(new Set(rows.map(r=> r.organisation))).sort(), [rows]);
  const countries = useMemo(()=> Array.from(new Set(rows.map(r=> r.location.split('•')[0].trim()))).sort(), [rows]);
  const years = useMemo(()=> Array.from(new Set(rows.map(r=> r.start.slice(0,4)))).sort(), [rows]);

  // Filter state
  const [typeFilter,setTypeFilter] = useState<string>(ALL);
  const [statusFilter,setStatusFilter] = useState<string>(ALL);
  const [orgFilter,setOrgFilter] = useState<string>(ALL);
  const [countryFilter,setCountryFilter] = useState<string>(ALL);
  const [yearFilter,setYearFilter] = useState<string>(ALL);

  const filtered = useMemo(()=> rows.filter(r=> {
    const country = r.location.split('•')[0].trim();
    const year = r.start.slice(0,4);
    if(search && !(r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))) return false;
    if(typeFilter!==ALL && r.type!==typeFilter) return false;
    if(statusFilter!==ALL && r.status!==statusFilter) return false;
    if(orgFilter!==ALL && r.organisation!==orgFilter) return false;
    if(countryFilter!==ALL && country!==countryFilter) return false;
    if(yearFilter!==ALL && year!==yearFilter) return false;
    return true;
  }), [rows, search, typeFilter, statusFilter, orgFilter, countryFilter, yearFilter]);

  // Pagination state (reusing pattern from RecentItemsTable for consistency)
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize);
  useEffect(()=> { if(page>totalPages) setPage(1); }, [totalPages,page]);

  return (
  <AdminPage title={t('admin.projects')+ ' — ' + (t('admin.ui.overview','Overview'))}>
      <div className="flex items-center mb-4">
  <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">{t('admin.ui.projects.total')}</h2>
        <Link to="/admin/projects/new" className="ml-auto h-8 px-4 rounded-full text-[12px] font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white flex items-center" style={{boxShadow:'var(--elev-1)'}}>
          {/** Using fallback if key not found */}
          { ( (window as any).i18next?.t?.('admin.ui.projects.newProject') ) || 'New project'}
        </Link>
      </div>
      {kpis && <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-2">
        <KpiCard title={t('admin.ui.projects.total')} value={kpis.total} subtitle={`${t('admin.ui.status.active', 'Active')}: ${kpis.active} • ${t('admin.ui.status.paused','Paused')}: ${kpis.paused} • ${t('admin.ui.status.closed','Closed')}: ${kpis.closed}`} />
        <KpiCard title={t('admin.ui.projects.plannedBudget')} value={`$ ${kpis.plannedBudget.toLocaleString()}`} subtitle={t('admin.ui.projects.total')} />
        <KpiCard title={t('admin.ui.projects.collected')} value={`$ ${kpis.collected.toLocaleString()}`} subtitle={t('admin.ui.projects.total')} />
        <KpiCard title={t('admin.ui.projects.spent')} value={`$ ${kpis.spent.toLocaleString()}`} subtitle={`% ${t('common.progress')}: ${((kpis.spent/Math.max(kpis.collected,1))*100).toFixed(0)}%`} progressPct={(kpis.spent/Math.max(kpis.collected,1))*100} />
      </div>}
  <div className="rounded-lg bg-[var(--color-surface)] p-3 md:p-4 flex flex-col gap-3" style={{boxShadow:'var(--elev-1)'}}>
        {/* Filters row (select style to mirror RecentItemsTable) */}
        <div className="flex flex-wrap gap-2 items-center">
          <FilterSelect label={t('admin.ui.projects.filters.type')} value={typeFilter} options={[ALL,...types]} onChange={v=>{setTypeFilter(v); setPage(1);}} />
          <FilterSelect label={t('admin.ui.projects.filters.status')} value={statusFilter} options={[ALL,...statuses]} onChange={v=>{setStatusFilter(v); setPage(1);}} />
          <FilterSelect label={t('admin.ui.projects.filters.country')} value={countryFilter} options={[ALL,...countries]} onChange={v=>{setCountryFilter(v); setPage(1);}} />
          <FilterSelect label={t('admin.ui.projects.filters.org')} value={orgFilter} options={[ALL,...orgs]} onChange={v=>{setOrgFilter(v); setPage(1);}} />
          <FilterSelect label={t('admin.ui.projects.filters.period')} value={yearFilter} options={[ALL,...years]} onChange={v=>{setYearFilter(v); setPage(1);}} />
          <div className="ml-auto relative">
            <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder={t('common.search')} className="pl-7 pr-3 py-1 text-[11px] rounded bg-[var(--color-surface)] border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition" style={{boxShadow:'var(--elev-0)'}} />
            <Search size={14} className="absolute left-2 top-1.5 text-[var(--slate-400)]" />
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-[11px] text-[var(--text-primary)]">
            <thead>
              <tr className="text-left text-[var(--color-text-secondary)]">
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.id')}</th>
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.name')}</th>
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.type')}</th>
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.organisation')}</th>
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.location')}</th>
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.dates')}</th>
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.status')}</th>
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.budget')}</th>
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.collected')}</th>
                <th className="py-1 pr-4 font-medium">{t('admin.ui.projects.table.spent')}</th>
                <th className="py-1 pr-2 font-medium">{t('admin.ui.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(p=> (
                <tr key={p.id} className="border-t hover:bg-[var(--chip-bg)] transition" style={{borderColor:'var(--color-border)'}}>
                  <td className="py-1 pr-4 whitespace-nowrap font-mono">{p.id}</td>
                  <td className="py-1 pr-4">{p.name}</td>
                  <td className="py-1 pr-4 capitalize">{p.type}</td>
                  <td className="py-1 pr-4">{p.organisation}</td>
                  <td className="py-1 pr-4">{p.location}</td>
                  <td className="py-1 pr-4">{p.start}</td>
                  <td className="py-1 pr-4"><span className={`px-1.5 py-0.5 rounded ${statusColors[p.status]||'bg-[var(--slate-200)] text-[var(--slate-600)]'}`}>{p.status}</span></td>
                  <td className="py-1 pr-4">$ {(p.budget/1000).toFixed(0)}k</td>
                  <td className="py-1 pr-4">$ {(p.collected/1000).toFixed(0)}k</td>
                  <td className="py-1 pr-4">$ {(p.spent/1000).toFixed(0)}k</td>
                  <td className="py-1 pr-2 text-[var(--primary-accent)] underline cursor-pointer">
                    <Link to={`/admin/projects/${p.id}/resume`}>{t('admin.ui.actions.view')}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer pagination */}
        <div className="flex items-center justify-between text-[10px] mt-2">
          <div>
            Rows: {(page-1)*pageSize + (filtered.length?1:0)} - {Math.min(page*pageSize, filtered.length)} / {filtered.length} |
            <select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value)); setPage(1);}} className="ml-1 rounded px-1 py-0.5 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
              {[10,25,50].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex gap-1">
            <button onClick={()=>setPage(p=> Math.max(1,p-1))} disabled={page===1} className="px-2 py-0.5 rounded bg-white border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] disabled:opacity-40 flex items-center justify-center transition" style={{boxShadow:'var(--elev-0)'}} aria-label="Prev page">◄</button>
            <button onClick={()=>setPage(p=> Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2 py-0.5 rounded bg-white border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] disabled:opacity-40 flex items-center justify-center transition" style={{boxShadow:'var(--elev-0)'}} aria-label="Next page">►</button>
          </div>
        </div>
      </div>
  {loading && <div className="text-[12px] text-[var(--muted-color)]">{t('common.loading')}</div>}
  {error && <div className="text-[12px] text-red-600">{t('common.error')}: {error}</div>}
    </AdminPage>
  );
};

  // (FilterChip + FilterBar removed: using simplified selects matching RecentItemsTable style)

export default ProjectsOverview;
