import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { getModule, getModuleOutline, logEvent } from '../../data/elearning';
import { useTranslation } from 'react-i18next';

const ELearningModulePage: React.FC = () => {
  const { slug } = useParams();
  const module = slug ? getModule(slug) : undefined;
  const outline = module ? getModuleOutline(module.slug) : [];
  const navigate = useNavigate();
  const { t } = useTranslation();
  if(!module || !module.is_public) return <div className="min-h-screen bg-background"><PublicNav /><main className="max-w-3xl mx-auto p-10"><h1 className="text-2xl font-bold text-primary">{t('elearning.moduleNotFound','Module not found')}</h1></main></div>;
  const firstPublic = outline.find(o=> o.is_public);
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <div className="max-w-[1200px] mx-auto space-y-10">
          {/* Hero */}
          <div className="rounded-2xl border border-base p-6 bg-white grid lg:grid-cols-[260px_1fr_200px] gap-6 items-start">
            <div className="w-full aspect-video rounded-md border border-base bg-[var(--color-primary-light)] flex items-center justify-center text-[12px] text-secondary">{t('elearning.moduleCover','Module cover')}</div>
            <div className="space-y-2">
              <h1 className="text-[24px] leading-[32px] font-extrabold text-primary">Module: {module.title}</h1>
              <div className="text-[12px] text-secondary">{outline.length} lessons • ~{module.estimated_minutes_total} min • {module.level}</div>
              <p className="text-[13px] leading-[20px] text-secondary">{t('elearning.whatYouWillLearn',"What you'll learn")}<br />{module.summary}</p>
              <div className="flex flex-wrap gap-2 pt-1">{module.tags?.map(t=> <span key={t} className="px-2 h-6 rounded-full border border-base text-[11px] inline-flex items-center bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">{t}</span>)}</div>
            </div>
            <div className="flex flex-col items-end gap-3">
              {firstPublic && (
                <button onClick={()=> { logEvent('elearn_start_module',{module:module.slug, firstLesson:firstPublic.slug}); navigate(`/e-learning/lesson/${firstPublic.slug}?module=${module.slug}`); }} className="px-5 h-10 rounded-full bg-[var(--color-primary)] text-white text-[13px] font-semibold hover:bg-[var(--color-primary-dark)]">{t('elearning.startModule','Start module →')}</button>
              )}
            </div>
          </div>

          {/* Lesson list & sidebar grid */}
          <div className="grid lg:grid-cols-[820px_1fr] gap-6">
            <section className="space-y-3" aria-label="Lessons list">
              {outline.map(o=> (
                <div key={o.slug} className="rounded-xl border border-base p-3 bg-white flex items-center gap-3 text-[13px]">
                  <div className="w-7 h-7 rounded-full border border-base flex items-center justify-center text-[11px] font-medium bg-[var(--color-primary-light)]">{o.order_index}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-primary truncate">{o.title}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={()=> { logEvent('elearn_start_lesson_row',{lesson:o.slug, module:module.slug}); navigate(`/e-learning/lesson/${o.slug}?module=${module.slug}`); }} className="px-4 h-8 rounded-full border border-base text-[12px] hover:bg-[var(--color-primary-light)]">{t('elearning.start','Start')}</button>
                  </div>
                </div>
              ))}
            </section>
            <aside className="space-y-6">
              {outline.length>0 && (
                <div className="rounded-xl border border-base p-4 bg-white" aria-label="Module outline">
                  <h4 className="text-[13px] font-semibold text-primary mb-2">{t('elearning.moduleOutline','Module outline')}</h4>
                  <ul className="space-y-1 text-[12px] text-secondary">
                    {outline.map(o=> <li key={o.slug} className="truncate px-2 py-1 rounded-md border"><Link to={`/e-learning/lesson/${o.slug}?module=${module.slug}`} className="block truncate">{o.order_index}. {o.title}</Link></li>)}
                  </ul>
                </div>
              )}
              {module.downloads && module.downloads.length>0 && (
                <div className="rounded-xl border border-base p-4 bg-white" aria-label="Downloads">
                  <h4 className="text-[13px] font-semibold text-primary mb-2">{t('elearning.downloads','Downloads')}</h4>
                  <ul className="list-disc pl-5 space-y-1 text-[12px] text-primary">
                    {module.downloads.map(d=> <li key={d.url}><a className="underline" href={d.url} download>{d.label}</a></li>)}
                  </ul>
                </div>
              )}
              {module.related && module.related.length>0 && (
                <div className="rounded-xl border border-base p-4 bg-white" aria-label="Related modules">
                  <h4 className="text-[13px] font-semibold text-primary mb-2">{t('elearning.relatedModules','Related modules')}</h4>
                  <ul className="space-y-3">
                    {module.related.slice(0,2).map(r=> (
                      <li key={r.slug} className="rounded-md border border-base p-3">
                        <div className="w-full aspect-video rounded-sm border border-base bg-[var(--color-primary-light)] mb-2 flex items-center justify-center text-[10px] text-secondary">{t('elearning.moduleCover','Module cover')}</div>
                        <div className="text-[12px] font-medium text-primary line-clamp-2">{r.title}</div>
                        <div className="text-[11px] text-secondary">{r.stats}</div>
                        <div className="flex flex-wrap gap-1 mt-1">{r.tags?.map(t=> <span key={t} className="px-2 h-5 rounded-full border border-base text-[10px] bg-[var(--color-primary-light)] inline-flex items-center">{t}</span>)}</div>
                        <Link to={`/e-learning/module/${r.slug}`} className="mt-2 inline-flex justify-end w-full px-3 h-7 rounded-full border border-base text-[11px] hover:bg-[var(--color-primary-light)]">{t('elearning.viewModule','View module →')}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
export default ELearningModulePage;
