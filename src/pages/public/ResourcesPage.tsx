import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PublicPageShell from '../../components/layout/PublicPageShell';
import { listResources, formatSize, mockResources } from '../../data/resources';
import { ResourceCategory, ResourceLanguage } from '../../types/resources';
import { Search, Download } from 'lucide-react';

const categoryLabels = (t: ReturnType<typeof useTranslation>['t']): Record<string,string> => ({
  report: t('resources.category.report','Report'),
  audit: t('resources.category.audit','Audit'),
  policy: t('resources.category.policy','Policy'),
  template: t('resources.category.template','Template'),
  data: t('resources.category.data','Data'),
  guide: t('resources.category.guide','Guide')
});

const ResourcesPage: React.FC = () => {
  const { t } = useTranslation();
  // Filters state
  const [q,setQ] = useState('');
  const [type,setType] = useState<ResourceCategory|''>('');
  const years = useMemo(()=> Array.from(new Set(mockResources.map(r=> r.year))).sort((a,b)=> b-a),[]);
  const [year,setYear] = useState<number|''>('');
  const [lang,setLang] = useState<ResourceLanguage|''>('');
  const allTags = useMemo(()=> Array.from(new Set(mockResources.flatMap(r=> r.tags||[]))).sort(),[]);
  const [tags,setTags] = useState<string[]>([]);
  const [sort,setSort] = useState<'newest'|'oldest'>('newest');
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(6);
  const [showTags,setShowTags] = useState(false);
  const [showDev,setShowDev] = useState(false);

  function handleUnderDevelopment(e?: React.MouseEvent) {
    if (e) e.preventDefault();
    setShowDev(true);
  }

  useEffect(()=> { setPage(1); },[q,type,year,lang,tags,sort]);
  const data = useMemo(()=> listResources({ q, type, year, lang, tags, sort, page, pageSize }),[q,type,year,lang,tags,sort,page,pageSize]);
  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  function toggleTag(tag:string){ setTags(cur => cur.includes(tag)? cur.filter(x=> x!==tag): [...cur,tag]); }
  function clearAll(){ setQ(''); setType(''); setYear(''); setLang(''); setTags([]); setSort('newest'); }

  return (
    <PublicPageShell>
      {/* Header */}
      <header className="space-y-2 mb-8">
        <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">{t('resources.title','Resources')}</h1>
        <p className="text-[14px] leading-[20px] text-secondary">{t('resources.subtitle','Reports, audits, policies & templates for full transparency.')}</p>
      </header>

      {/* Toolbar */}
      <section id="toolbar" className="sticky top-[84px] z-30 mb-10">
        <div className="rounded-2xl bg-white border border-base p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input role="searchbox" aria-label={t('resources.searchAria','Search resources')} value={q} onChange={e=> setQ(e.target.value)} placeholder={t('resources.searchPlaceholder','Search resources...')} className="pl-9 pr-4 h-10 w-full rounded-full text-[13px] border border-base bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <select aria-label={t('resources.type','Type')} value={type} onChange={e=> setType(e.target.value as any)} className="h-10 px-3 rounded-full border border-base bg-white text-[13px]">
            <option value="">{t('resources.type','Type')}</option>
            {Object.keys(categoryLabels(t)).map(k=> <option key={k} value={k}>{categoryLabels(t)[k]}</option>)}
          </select>
          <select aria-label={t('resources.year','Year')} value={year} onChange={e=> setYear(e.target.value? Number(e.target.value):'')} className="h-10 px-3 rounded-full border border-base bg-white text-[13px] w-[110px]">
            <option value="">{t('resources.year','Year')}</option>
            {years.map(y=> <option key={y} value={y}>{y}</option>)}
          </select>
            <select aria-label={t('resources.language','Language')} value={lang} onChange={e=> setLang(e.target.value as any)} className="h-10 px-3 rounded-full border border-base bg-white text-[13px] w-[120px]">
              <option value="">{t('resources.language','Language')}</option>
              <option value="EN">EN</option>
              <option value="FR">FR</option>
              <option value="EN/FR">EN/FR</option>
            </select>
          <div className="relative" aria-expanded={showTags} aria-haspopup="listbox">
            <button type="button" onClick={()=> setShowTags(s=>!s)} className="h-10 px-3 rounded-full border border-base bg-white flex items-center gap-2 text-[13px]">
              <span>{t('resources.tags','Tags')}</span>
              {tags.length>0 && <span className="text-[11px] rounded-full px-2 py-[2px] bg-[var(--color-primary-light)] border border-base text-primary">{tags.length}</span>}
            </button>
            {showTags && (
              <div className="absolute left-0 mt-2 w-[260px] max-h-[260px] overflow-y-auto rounded-xl border border-base bg-white shadow-lg p-3 z-40 grid gap-2" role="listbox">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-medium text-secondary">{t('resources.selectTags','Select tags')}</span>
                  {tags.length>0 && <button type="button" onClick={()=> setTags([])} className="text-[11px] underline text-secondary">{t('resources.clear','Clear')}</button>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tg=> {
                    const active = tags.includes(tg);
                    return (
                      <button key={tg} type="button" onClick={()=> toggleTag(tg)} className={`px-2 h-7 rounded-full border border-base text-[11px] transition-colors ${active? 'bg-primary text-white border-primary':'bg-[var(--color-primary-light)] text-primary-dark'}`}>{tg}</button>
                    );
                  })}
                </div>
                <div className="pt-1 flex justify-end">
                  <button type="button" onClick={()=> setShowTags(false)} className="text-[11px] underline text-secondary">{t('resources.done','Done')}</button>
                </div>
              </div>
            )}
          </div>
          <select aria-label={t('resources.sort','Sort')} value={sort} onChange={e=> setSort(e.target.value as any)} className="h-10 px-3 rounded-full border border-base bg-white text-[13px] w-[150px]">
            <option value="newest">{t('resources.sortNewest','Sort: Newest')}</option>
            <option value="oldest">{t('resources.sortOldest','Oldest')}</option>
          </select>
          {(q||type||year||lang||tags.length||sort!=='newest') && <button onClick={clearAll} className="h-10 px-4 rounded-full border border-base bg-white text-[12px]">{t('resources.reset','Reset')}</button>}
        </div>
      </section>

      {/* Grid */}
      <section id="grid" className="min-h-[400px]" aria-live="polite">
          {data.items.length===0 && (
            <div className="text-center py-16 text-[14px]" style={{color:'var(--slate-600)'}}>{t('resources.noResults','No results. Clear filters?')} <button onClick={clearAll} className="underline">{t('resources.clearFilters','Clear filters')}</button>.</div>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {data.items.map(r => (
              <article key={r.id} role="article" className="group relative h-[260px] rounded-xl border border-base p-4 flex flex-col bg-white transition hover:shadow-sm">
                <div className="flex gap-4">
                  <div className="w-[84px] h-[84px] rounded-xl border border-base flex items-center justify-center text-[11px] font-medium uppercase tracking-wide bg-[var(--color-primary-light)] text-primary-dark">{r.file_type}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] leading-[20px] font-semibold line-clamp-2 text-primary">{r.title}</h3>
                    <p className="mt-1 text-[12px] leading-[18px] line-clamp-3 text-secondary">{r.summary}</p>
                  </div>
                </div>
                <div className="mt-2 text-[11px] leading-[18px] text-secondary">{categoryLabels(t)[r.category]} · {r.year} · {r.language} · {r.file_type} · {formatSize(r.file_size_bytes)}</div>
                <div className="mt-auto pt-3 flex gap-2 justify-end">
                  <Link aria-label={`${t('resources.view','View')} ${r.title}`} to={`/resources/${r.slug}`} onClick={handleUnderDevelopment} className="px-3 h-8 rounded-full border border-base text-[12px] font-medium hover:bg-[var(--color-primary-light)]">{t('resources.view','View')}</Link>
                  <button aria-label={`${t('resources.download','Download')} ${r.title}`} onClick={handleUnderDevelopment} className="px-3 h-8 rounded-full border border-base text-[12px] font-medium flex items-center gap-1 hover:bg-[var(--color-primary-light)]"><Download className="w-4 h-4"/>{t('resources.download','Download')}</button>
                </div>
              </article>
            ))}
          </div>
        </section>

      {/* Under development popup */}
      {showDev && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={()=> setShowDev(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-base bg-white p-6 text-center shadow-xl">
            <h3 className="text-[16px] font-semibold text-primary mb-2">{t('resources.devNoticeTitle','Notice')}</h3>
            <p className="text-[13px] text-secondary mb-4">{t('resources.devNoticeBody','It is under development.')}</p>
            <button autoFocus onClick={()=> setShowDev(false)} className="px-4 h-9 rounded-full border border-base bg-[var(--color-primary-light)] text-[13px]">{t('resources.close','Close')}</button>
          </div>
        </div>
      )}

        {/* Pagination (always visible when there is data, even if only one page) */}
        {data.total>0 && (
          <nav id="pagination" className="mt-8 flex items-center justify-between text-[12px] flex-wrap gap-4" aria-label="Pagination">
            <div className="flex items-center gap-2">{t('resources.rowsLabel','Rows:')}
              <select value={pageSize} onChange={e=> { setPageSize(Number(e.target.value)); setPage(1); }} className="h-8 px-2 rounded-full border border-base bg-white" aria-label={t('resources.rows','Rows per page')}>
                {[6,9,12,15].map(sz=> <option key={sz} value={sz}>{sz}</option>)}
              </select>
              <span className="ml-2 text-secondary">{t('resources.page','Page')} {page} / {totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label={t('resources.prev','Previous page')} onClick={()=> setPage(p=> Math.max(1,p-1))} disabled={page===1} className="h-8 px-3 rounded-full transition-colors border border-base bg-[var(--color-primary-light)] text-primary disabled:opacity-40 disabled:cursor-not-allowed">{t('resources.prev','Prev')}</button>
              {Array.from({length: totalPages}).slice(0,5).map((_,i)=> { const pageNum=i+1; const active=pageNum===page; return (
                <button aria-current={active? 'page':undefined} key={pageNum} onClick={()=> setPage(pageNum)} className={`w-8 h-8 rounded-full text-[12px] border border-base ${active?'bg-primary text-white':'bg-[var(--color-primary-light)] text-primary hover:brightness-95'}`}>{pageNum}</button>
              );})}
              <button aria-label={t('resources.next','Next page')} onClick={()=> setPage(p=> Math.min(totalPages,p+1))} disabled={page===totalPages} className="h-8 px-3 rounded-full transition-colors border border-base bg-[var(--color-primary-light)] text-primary disabled:opacity-40 disabled:cursor-not-allowed">{t('resources.next','Next')}</button>
            </div>
          </nav>
        )}
        {/* Donate banner */}
        <section className="pt-10">
          <div className="rounded-xl border border-base bg-white p-6 space-y-4 text-center">
            <h2 className="text-[18px] leading-[24px] font-semibold text-primary">{t('resources.donateBannerTitle','Help expand open resources & transparency.')}</h2>
            <Link to="/donate" className="btn-donate inline-flex justify-center">{t('nav.donate','Donate')}</Link>
          </div>
        </section>
    </PublicPageShell>
  );
};

export default ResourcesPage;
