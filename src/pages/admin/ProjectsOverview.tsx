import React, { useMemo, useState, useEffect } from 'react';
import FilterSelect from '../../components/admin/filters/FilterSelect';
import KpiCard from '../../components/admin/KpiCard';
import { useProjectsData } from '../../hooks/useProjectsData';
import { useTranslation } from 'react-i18next';
import AdminPage from '../../components/admin/AdminPage';
import { Search } from 'lucide-react';

const statusColors: Record<string,string> = {
  'réussi':'text-emerald-600','en cours':'text-orange-600','soumis':'text-violet-600','validé':'text-emerald-600','remboursé':'text-slate-500','rejeté':'text-red-600','draft':'text-slate-400','actif':'text-sky-600','en pause':'text-amber-600','clos':'text-rose-600'
};

const ProjectsOverview: React.FC = () => {
  const { rows, kpis, loading, error } = useProjectsData();
  useTranslation(); // hook retained for future translations
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
  <AdminPage title="Projects — Overview">
      {kpis && <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total projets" value={kpis.total} subtitle={`Actifs: ${kpis.active} • Pause: ${kpis.paused} • Clos: ${kpis.closed}`} />
        <KpiCard title="Budget planifié" value={`$ ${kpis.plannedBudget.toLocaleString()}`} subtitle="Somme tous projets" />
        <KpiCard title="Collecté" value={`$ ${kpis.collected.toLocaleString()}`} subtitle="Somme tous projets" />
        <KpiCard title="Dépensé" value={`$ ${kpis.spent.toLocaleString()}`} subtitle={`Exécution: ${((kpis.spent/Math.max(kpis.collected,1))*100).toFixed(0)}%`} progressPct={(kpis.spent/Math.max(kpis.collected,1))*100} />
      </div>}
      <div className="rounded-lg border bg-white border-[var(--rose-200)] p-3 md:p-4 flex flex-col gap-3">
        {/* Filters row (select style to mirror RecentItemsTable) */}
        <div className="flex flex-wrap gap-2 items-center">
          <FilterSelect label="Type" value={typeFilter} options={[ALL,...types]} onChange={v=>{setTypeFilter(v); setPage(1);}} />
          <FilterSelect label="Statut" value={statusFilter} options={[ALL,...statuses]} onChange={v=>{setStatusFilter(v); setPage(1);}} />
          <FilterSelect label="Pays" value={countryFilter} options={[ALL,...countries]} onChange={v=>{setCountryFilter(v); setPage(1);}} />
          <FilterSelect label="Org" value={orgFilter} options={[ALL,...orgs]} onChange={v=>{setOrgFilter(v); setPage(1);}} />
          <FilterSelect label="Période" value={yearFilter} options={[ALL,...years]} onChange={v=>{setYearFilter(v); setPage(1);}} />
          <div className="ml-auto relative">
            <input value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} placeholder="Search..." className="pl-7 pr-3 py-1 text-[11px] border rounded border-[var(--rose-200)] focus:outline-none" />
            <Search size={14} className="absolute left-2 top-1.5 text-[var(--slate-400)]" />
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-[11px]">
            <thead>
              <tr className="text-left text-[var(--slate-600)]">
                <th className="py-1 pr-4 font-medium">ID</th>
                <th className="py-1 pr-4 font-medium">Nom</th>
                <th className="py-1 pr-4 font-medium">Type</th>
                <th className="py-1 pr-4 font-medium">Organisation</th>
                <th className="py-1 pr-4 font-medium">Location</th>
                <th className="py-1 pr-4 font-medium">Date</th>
                <th className="py-1 pr-4 font-medium">Statut</th>
                <th className="py-1 pr-4 font-medium">Budget</th>
                <th className="py-1 pr-4 font-medium">Collecté</th>
                <th className="py-1 pr-4 font-medium">Dépensé</th>
                <th className="py-1 pr-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(p=> (
                <tr key={p.id} className="border-t border-[var(--rose-100)] hover:bg-[var(--rose-50)] transition">
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
                  <td className="py-1 pr-2 text-[var(--rose-600)] underline cursor-pointer">Voir</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer pagination */}
        <div className="flex items-center justify-between text-[10px] mt-2">
          <div>
            Rows: {(page-1)*pageSize + (filtered.length?1:0)} - {Math.min(page*pageSize, filtered.length)} / {filtered.length} |
            <select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value)); setPage(1);}} className="ml-1 border rounded px-1 py-0.5 border-[var(--rose-200)] bg-white">
              {[10,25,50].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="flex gap-1">
            <button onClick={()=>setPage(p=> Math.max(1,p-1))} disabled={page===1} className="px-2 py-0.5 rounded border border-[var(--rose-200)] disabled:opacity-40 flex items-center justify-center" aria-label="Prev page">◄</button>
            <button onClick={()=>setPage(p=> Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2 py-0.5 rounded border border-[var(--rose-200)] disabled:opacity-40 flex items-center justify-center" aria-label="Next page">►</button>
          </div>
        </div>
      </div>
      {loading && <div className="text-[12px] text-[var(--muted-color)]">Chargement...</div>}
      {error && <div className="text-[12px] text-red-600">Erreur: {error}</div>}
    </AdminPage>
  );
};

  // (FilterChip + FilterBar removed: using simplified selects matching RecentItemsTable style)

export default ProjectsOverview;
