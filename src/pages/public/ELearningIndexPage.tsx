import React, { useEffect, useMemo, useState } from 'react';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { listLessons, LessonSummary, logEvent } from '../../data/elearning';
import { imageForIndex, courseImageAlt } from '../../data/imagePools';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// default page size (can be changed by user via selector)
const DEFAULT_PAGE_SIZE = 6;

const ELearningIndexPage: React.FC = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [q,setQ] = useState(params.get('q')||'');
  const [topic,setTopic] = useState(params.get('topic')||'');
  const [level,setLevel] = useState(params.get('level')||'');
  const [length,setLength] = useState(params.get('length')||'');
  const [sort,setSort] = useState(params.get('sort')||'newest');
  const [page,setPage] = useState(Number(params.get('page')||'1'));
  const [pageSize,setPageSize] = useState<number>(Number(params.get('pageSize')||DEFAULT_PAGE_SIZE));
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|undefined>();
  const [data,setData] = useState<{items:LessonSummary[]; total:number; page:number}>({items:[], total:0, page:1});

  const fire = () => {
    setLoading(true); setError(undefined);
    try {
  const res = listLessons({ q, topic, level, length, sort, page, pageSize });
      setData({ items:res.items, total:res.total, page:res.page });
      logEvent('elearn_filter_change', { q, topic, level, length, sort, page });
  setParams(p=> { p.set('page', String(page)); p.set('pageSize', String(pageSize)); q? p.set('q',q): p.delete('q'); topic? p.set('topic',topic): p.delete('topic'); level? p.set('level',level): p.delete('level'); length? p.set('length',length): p.delete('length'); sort? p.set('sort',sort): p.delete('sort'); return p; });
    } catch(e:any) { setError(e.message||'Error'); }
    finally { setLoading(false); }
  };

  useEffect(()=> { fire(); /* eslint-disable-next-line */ }, [q, topic, level, length, sort, page, pageSize]);

  // Derive option sets from full pool
  const all = useMemo(()=> listLessons({ q:'', page:1, pageSize:999 }).items, []);
  const topics = useMemo(()=> Array.from(new Set(all.map(l=> l.topic).filter(Boolean))) as string[], [all]);
  const topicHas = topics.length>0;
  const levels = ['Beginner','Intermediate','Advanced'].filter(l => all.some(a=> a.level===l));

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  const clear = () => { setQ(''); setTopic(''); setLevel(''); setLength(''); setSort('newest'); setPage(1); };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <header className="space-y-2">
            <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">{t('elearningIndex.title','E-learning')}</h1>
            <p className="text-[14px] leading-[20px] text-secondary">{t('elearningIndex.subtitle','Free, practical lessons on menstrual health—reusable kits, safe use, and dignity. No login required.')}</p>
          </header>
          {/* Toolbar */}
          <section className="rounded-2xl bg-white border border-base p-4 flex flex-wrap gap-3 items-center">
            <input value={q} onChange={e=> { setQ(e.target.value); setPage(1); }} placeholder={t('elearningIndex.search','Search lessons...')} className="h-10 px-4 rounded-full border border-base bg-white text-[13px] flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            {topicHas && (
              <select value={topic} onChange={e=> { setTopic(e.target.value); setPage(1); }} className="h-10 px-3 rounded-full border border-base bg-white text-[13px]">
                <option value="">{t('elearningIndex.topic','Topic')}</option>
                {topics.map(t=> <option key={t}>{t}</option>)}
              </select>) }
            {levels.length>0 && (
              <select value={level} onChange={e=> { setLevel(e.target.value); setPage(1); }} className="h-10 px-3 rounded-full border border-base bg-white text-[13px]">
                <option value="">{t('elearningIndex.level','Level')}</option>
                {levels.map(l=> <option key={l}>{l}</option>)}
              </select>) }
            <select value={length} onChange={e=> { setLength(e.target.value); setPage(1); }} className="h-10 px-3 rounded-full border border-base bg-white text-[13px]">
              <option value="">{t('elearningIndex.length','Length')}</option>
              <option value="<=5">≤5</option>
              <option value="6-10">6–10</option>
              <option value="11-15">11–15</option>
              <option value="15+">15+</option>
            </select>
            <select value={sort} onChange={e=> { setSort(e.target.value); setPage(1); }} className="h-10 px-3 rounded-full border border-base bg-white text-[13px]">
              <option value="newest">{t('elearningIndex.sort.newest','Sort: Newest')}</option>
              <option value="oldest">{t('elearningIndex.sort.oldest','Oldest')}</option>
              <option value="shortest">{t('elearningIndex.sort.shortest','Shortest')}</option>
              <option value="longest">{t('elearningIndex.sort.longest','Longest')}</option>
            </select>
            {(q||topic||level||length||sort!=='newest') && <button type="button" onClick={clear} className="h-10 px-4 rounded-full border border-base bg-white text-[12px] font-medium hover:bg-[var(--color-primary-light)]">{t('elearningIndex.reset','Reset')}</button>}
          </section>

          {/* States */}
          {error && <div className="rounded-lg border border-base p-3 bg-[var(--color-error-light)] text-[12px] text-[var(--color-error)] flex justify-between"><span>{error}</span><button className="underline" onClick={()=> fire()}>{t('elearningIndex.retry','Retry')}</button></div>}
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} className="animate-pulse rounded-xl border border-base p-4 space-y-3 bg-white">
                  <div className="w-full aspect-video rounded-md bg-[var(--color-primary-light)]" />
                  <div className="h-4 w-3/4 rounded bg-[var(--color-primary-light)]" />
                  <div className="h-3 w-1/2 rounded bg-[var(--color-primary-light)]" />
                  <div className="h-3 w-2/3 rounded bg-[var(--color-primary-light)]" />
                </div>))}
            </div> )}

          {!loading && data.items.length===0 && (
            <div className="rounded-xl border border-base p-10 text-center bg-white space-y-4">
              <p className="text-secondary text-sm">{t('elearningIndex.noResults','No results. Clear filters.')}</p>
              <button onClick={clear} className="px-4 h-10 rounded-full border border-base text-[13px] hover:bg-[var(--color-primary-light)]">{t('elearningIndex.reset','Reset')}</button>
            </div>
          )}

          {/* Lessons grid */}
          {!loading && data.items.length>0 && (
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((l,i)=> (
                <article key={l.slug} className="rounded-xl border border-base p-4 bg-white flex flex-col" onClick={()=> logEvent('elearn_card_click',{lessonSlug:l.slug, position:i})}>
                  <Link to={`/e-learning/lesson/${l.slug}`} className="block group">
                    <div className="w-full aspect-video rounded-md border border-base overflow-hidden">
                      <img
                        src={l.cover_image_url || imageForIndex(i)}
                        alt={courseImageAlt('lesson', l.title)}
                        loading={i > 2 ? 'lazy' : 'eager'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="mt-3 font-semibold text-[15px] leading-[20px] text-primary line-clamp-2 group-hover:underline">{l.title}</h2>
                    <p className="text-[12px] leading-[18px] text-secondary mt-1 line-clamp-2">{l.summary}</p>
                  </Link>
                  <div className="mt-2 text-[11px] text-secondary">{l.level} • {l.duration_minutes} min</div>
                  {l.tags && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {l.tags.slice(0,3).map(t=> <span key={t} className="px-2 h-6 inline-flex items-center rounded-full border border-base text-[11px] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">{t}</span>)}
                    </div>
                  )}
                  <div className="mt-3 flex justify-end">
                    <Link to={`/e-learning/lesson/${l.slug}`} className="px-3 h-8 inline-flex items-center rounded-full border border-base text-[12px] font-medium hover:bg-[var(--color-primary-light)]">{t('elearningIndex.startReading','Start reading →')}</Link>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* Newsletter */}
          <section className="rounded-xl border border-base p-6 space-y-4 bg-white">
            <h2 className="font-semibold text-[16px] leading-[22px] text-primary">{t('elearningIndex.newsletter.title','Stay in the loop — new lessons monthly.')}</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input placeholder={t('elearningIndex.newsletter.emailPlaceholder','Your email address')} className="h-10 px-4 rounded-full border border-base bg-white flex-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              <button className="h-10 px-6 rounded-full bg-[var(--color-primary)] text-white text-[13px] font-semibold hover:bg-[var(--color-primary-dark)] transition">{t('elearningIndex.newsletter.subscribe','Subscribe')}</button>
            </div>
          </section>

          {/* Donate banner */}
          <section className="rounded-xl border border-base p-6 bg-white text-center space-y-4">
            <h2 className="text-[18px] leading-[24px] font-semibold text-primary">{t('elearningIndex.donateBanner.title','Support free, open e-learning content.')}</h2>
            <Link to="/donate" className="btn-donate inline-flex justify-center">{t('elearningIndex.donateBanner.donate','Donate')}</Link>
          </section>

          {/* Pagination (always visible when there is at least one lesson) */}
          {data.total>0 && (
            <nav className="flex flex-wrap gap-4 items-center justify-between text-[12px]" aria-label="Pagination">
              <div className="flex items-center gap-2">{t('elearningIndex.pagination.rows','Rows:')}
                <select value={pageSize} onChange={e=> { setPageSize(Number(e.target.value)); setPage(1); }} className="h-8 px-2 rounded-full border border-base bg-white">
                  {[6,9,12,15].map(sz=> <option key={sz} value={sz}>{sz}</option>)}
                </select>
                <span className="ml-2 text-secondary">{t('elearningIndex.pagination.page','Page')} {page} / {totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button disabled={page===1} onClick={()=> { const next=Math.max(1,page-1); setPage(next); logEvent('elearn_paginate',{page:next}); }} className="h-8 px-3 rounded-full border border-base bg-[var(--color-primary-light)] text-primary disabled:opacity-40">{t('elearningIndex.pagination.prev','Prev')}</button>
                {Array.from({length: totalPages}).slice(0,5).map((_,i)=> { const p=i+1; return <button aria-current={p===page? 'page':undefined} key={p} onClick={()=> { setPage(p); logEvent('elearn_paginate',{page:p}); }} className={`w-8 h-8 rounded-full text-[12px] border border-base ${p===page? 'bg-[var(--color-primary)] text-white':'bg-[var(--color-primary-light)] text-primary hover:brightness-95'}`}>{p}</button>; })}
                <button disabled={page===totalPages} onClick={()=> { const next=Math.min(totalPages,page+1); setPage(next); logEvent('elearn_paginate',{page:next}); }} className="h-8 px-3 rounded-full border border-base bg-[var(--color-primary-light)] text-primary disabled:opacity-40">{t('elearningIndex.pagination.next','Next')}</button>
              </div>
            </nav>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
export default ELearningIndexPage;
