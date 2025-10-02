import React, { useMemo, useState } from 'react';
import FilterSelect from './filters/FilterSelect';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface ItemRow { id: string; date: string; type: string; ref: string; status: string; amount?: number; currency?: string; action?: string; }
interface Props { items: ItemRow[]; }

const statusColors: Record<string,string> = {
  'réussi': 'text-green-700 bg-green-100',
  'en cours': 'text-orange-700 bg-orange-100',
  'soumis': 'text-purple-700 bg-purple-100',
  'validé': 'text-green-700 bg-green-100',
  'remboursé': 'text-slate-600 bg-slate-200',
  'rejeté': 'text-red-700 bg-red-100',
  'draft': 'text-gray-600 bg-gray-200',
  'actif': 'text-blue-700 bg-blue-100'
};

const RecentItemsTable: React.FC<Props> = ({ items }) => {
  const { t } = useTranslation();
  const [typeFilter,setTypeFilter] = useState('Tous');
  const [statusFilter,setStatusFilter] = useState('Tous');
  const [periodFilter,setPeriodFilter] = useState('30j');
  const [search,setSearch] = useState('');
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(10);

  const allKey = t('admin.ui.filters.all');
  const filtered = useMemo(()=> items.filter(i => (
    (typeFilter===allKey|| i.type===typeFilter) &&
    (statusFilter===allKey|| i.status===statusFilter) &&
    (!search || i.ref.toLowerCase().includes(search.toLowerCase()))
  )),[items,typeFilter,statusFilter,search]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize);
  if(page>totalPages) setPage(1);


  return (
    <div className="rounded-lg bg-white p-3 md:p-4 flex flex-col gap-3" style={{boxShadow:'var(--elev-1)'}}>
      <div className="flex flex-wrap gap-2 items-center text-[11px]">
        <FilterSelect value={typeFilter} onChange={setTypeFilter} options={[allKey,t('admin.ui.types.project'),t('admin.ui.types.donation'),t('admin.ui.types.report')]} ariaLabel={t('admin.ui.table.type')} />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[allKey,
            t('admin.ui.status.active'),
            t('admin.ui.status.pending'),
            t('admin.ui.status.submitted'),
            t('admin.ui.status.validated'),
            t('admin.ui.status.success'),
            t('admin.ui.status.draft'),
            t('admin.ui.status.refunded'),
            t('admin.ui.status.rejected')]} ariaLabel={t('admin.ui.table.status')} />
        <FilterSelect value={periodFilter} onChange={setPeriodFilter} options={[t('admin.ui.filters.period30'),t('admin.ui.filters.period90'),t('admin.ui.filters.period365')]} ariaLabel={t('admin.ui.filters.period')||'Period'} />
        <div className="ml-auto relative">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('admin.ui.table.searchPlaceholder')} className="pl-7 pr-3 py-1 text-[11px] rounded bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition" style={{boxShadow:'var(--elev-0)'}} />
          <Search size={14} className="absolute left-2 top-1.5 text-[var(--slate-400)]" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-[11px]">
          <thead>
            <tr className="text-left text-[var(--slate-600)]">
              <th className="py-1 pr-4 font-medium">{t('admin.ui.table.date')}</th>
              <th className="py-1 pr-4 font-medium">{t('admin.ui.table.type')}</th>
              <th className="py-1 pr-4 font-medium">{t('admin.ui.table.reference')}</th>
              <th className="py-1 pr-4 font-medium">{t('admin.ui.table.status')}</th>
              <th className="py-1 pr-4 font-medium">{t('admin.ui.table.amount')}</th>
              <th className="py-1 pr-2 font-medium">{t('admin.ui.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(r=> (
              <tr key={r.id} className="border-t hover:bg-[var(--rose-50)] transition" style={{borderColor:'rgba(0,0,0,0.06)'}}>
                <td className="py-1 pr-4 whitespace-nowrap">{r.date}</td>
                <td className="py-1 pr-4 capitalize">{r.type}</td>
                <td className="py-1 pr-4 font-medium">{r.ref}</td>
                <td className="py-1 pr-4"><span className={`px-1.5 py-0.5 rounded ${statusColors[r.status]||'bg-[var(--slate-200)] text-[var(--slate-600)]'}`}>{r.status}</span></td>
                <td className="py-1 pr-4">{r.amount? `$ ${r.amount.toLocaleString()}`: '·'}</td>
                <td className="py-1 pr-2 text-primary underline cursor-pointer text-[var(--rose-600)]">{t('admin.ui.actions.view')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[10px] mt-2">
        <div>
          Rows: {(page-1)*pageSize+1} - {Math.min(page*pageSize, filtered.length)} / {filtered.length} |
          <select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value)); setPage(1);}} className="ml-1 rounded px-1 py-0.5 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
            {[10,25,50].map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex gap-1">
          <button onClick={()=>setPage(p=> Math.max(1,p-1))} disabled={page===1} className="px-2 py-0.5 rounded bg-white border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] disabled:opacity-40 flex items-center justify-center transition" style={{boxShadow:'var(--elev-0)'}} aria-label="Prev page"><ChevronLeft size={16} /></button>
          <button onClick={()=>setPage(p=> Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2 py-0.5 rounded bg-white border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] disabled:opacity-40 flex items-center justify-center transition" style={{boxShadow:'var(--elev-0)'}} aria-label="Next page"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default RecentItemsTable;
