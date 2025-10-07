import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { getLessonDetail, getModule, getModuleOutline, getRelatedLessons, logEvent } from '../../data/elearning';
import { transformArticleHtml } from '../../utils/mediaTransform';
import { useTranslation } from 'react-i18next';

const ELearningLessonPage: React.FC = () => {
  const { slug } = useParams();
  const location = useLocation();
  const moduleSlug = new URLSearchParams(location.search).get('module') || '';
  const lesson = slug? getLessonDetail(slug): undefined;
  const module = moduleSlug? getModule(moduleSlug): undefined;
  const outline = module? getModuleOutline(module.slug): [];
  const related = slug? getRelatedLessons(slug): [];
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement|null>(null);
  const { t } = useTranslation();
  const [progress,setProgress] = useState(0);
  useEffect(()=> { const onScroll=()=> { if(!contentRef.current) return; const rect=contentRef.current.getBoundingClientRect(); const total = rect.height - window.innerHeight + 200; const scrolled = Math.min(Math.max(window.scrollY - (contentRef.current.offsetTop-100),0), total); setProgress(total>0? scrolled/total:0); }; window.addEventListener('scroll', onScroll,{passive:true}); onScroll(); return ()=> window.removeEventListener('scroll', onScroll); },[]);
  // Keyboard shortcuts
  useEffect(()=> { const handler=(e:KeyboardEvent)=> { if(!outline.length) return; const idx = outline.findIndex(o=> o.slug===slug); if(e.key==='[' && idx>0){ navigate(`/e-learning/lesson/${outline[idx-1].slug}?module=${moduleSlug}`); logEvent('elearn_prev_next',{direction:'prev', to:outline[idx-1].slug}); } if(e.key===']' && idx < outline.length-1){ navigate(`/e-learning/lesson/${outline[idx+1].slug}?module=${moduleSlug}`); logEvent('elearn_prev_next',{direction:'next', to:outline[idx+1].slug}); } if(e.key==='Escape' && module){ navigate(`/e-learning/module/${module.slug}`);} }; window.addEventListener('keydown', handler); return ()=> window.removeEventListener('keydown', handler); },[outline, slug, module, moduleSlug, navigate]);
  const currentIndex = outline.findIndex(o=> o.slug===slug);
  if(!lesson) return <div className="min-h-screen bg-background"><PublicNav /><main className="max-w-3xl mx-auto p-10"><h1 className="text-2xl font-bold text-primary">{t('elearning.lessonNotFound','Lesson not found')}</h1></main></div>;
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-primary-light)] z-50"><div className="h-full bg-[var(--color-primary)] transition-[width] duration-150" style={{width:`${progress*100}%`}} /></div>
      <PublicNav />
      <main ref={contentRef} className="px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        <div className="max-w-[1200px] mx-auto space-y-8">
          {/* Breadcrumb */}
            {module && (
              <div className="rounded-md border border-base p-2 flex items-center justify-between bg-white text-[11px] text-secondary" aria-label="Breadcrumb">
                <div className="flex flex-wrap gap-1 items-center"><Link to="/e-learning" className="hover:underline">{t('elearning.breadcrumbRoot','E-learning')}</Link> / <Link to={`/e-learning/module/${module.slug}`} className="hover:underline">{module.title}</Link> / <span className="text-primary font-medium">{lesson.title}</span></div>
                <button onClick={()=> navigate(`/e-learning/module/${module.slug}`)} className="px-3 h-7 rounded-full border border-base hover:bg-[var(--color-primary-light)]">{t('elearning.backToModule','← Back to module')}</button>
              </div>
            )}

          <div className="grid lg:grid-cols-[820px_1fr] gap-6">
            <article className="space-y-8" aria-labelledby="lesson-title">
              <header>
                <h1 id="lesson-title" className="text-[24px] leading-[32px] font-extrabold text-primary">{lesson.title}</h1>
                <div className="mt-1 text-[12px] text-secondary">{lesson.level} • {lesson.duration_minutes} min • {t('elearning.lastUpdated','Last updated')} {new Date(lesson.updated_at).toLocaleDateString(undefined,{month:'short', year:'numeric'})}</div>
              </header>
              <div className="rounded-2xl border border-base p-6 bg-white">
                <div className="w-full aspect-video rounded-md border border-base overflow-hidden bg-[var(--color-primary-light)] flex items-center justify-center text-[12px] text-secondary">
                  {lesson.cover_image_url ? (
                    <img src={lesson.cover_image_url} alt={lesson.title} className="w-full h-full object-cover" loading="eager" />
                  ) : (
                    <span>{t('elearning.lessonCover','Lesson cover')}</span>
                  )}
                </div>
              </div>
              <div className="space-y-10">
                {lesson.body_sections.map(sec => (
                  <section key={sec.h2} aria-labelledby={sec.h2.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}>
                    <h2 id={sec.h2.replace(/[^a-z0-9]+/gi,'-').toLowerCase()} className="text-[18px] font-bold text-primary mb-2">{sec.h2}</h2>
                    {sec.html && <div className="prose prose-sm max-w-none text-[15px] leading-[22px] text-primary" dangerouslySetInnerHTML={{__html: transformArticleHtml(sec.html)}} />}
                    {sec.links && (
                      <ul className="list-disc pl-5 space-y-1 text-[15px] leading-[22px] text-primary">
                        {sec.links.map(l=> <li key={l.url}><a href={l.url} className="underline" download>{l.label}</a></li>)}
                      </ul>
                    )}
                  </section>
                ))}
                {lesson.quick_tip && (
                  <div className="rounded-xl border border-base p-5 bg-white">
                    <strong className="block mb-1 text-primary">{t('elearning.quickTip','Quick tip')}</strong>
                    <p className="text-[13px] leading-[18px] text-secondary">{lesson.quick_tip}</p>
                  </div>
                )}
              </div>
              {/* Prev / Next */}
              {outline.length>0 && (
                <div className="flex items-center justify-between mt-12">
                  <div>
                    {currentIndex>0 && <Link to={`/e-learning/lesson/${outline[currentIndex-1].slug}?module=${moduleSlug}`} onClick={()=> logEvent('elearn_prev_next',{direction:'prev', to:outline[currentIndex-1].slug})} className="px-4 h-8 rounded-full border border-base text-[12px] hover:bg-[var(--color-primary-light)]">{t('elearning.prevLesson','Prev lesson')}</Link>}
                  </div>
                  <div className="text-[10px] text-secondary">{t('elearning.shortcutsHint','Shortcuts: [ = Prev, ] = Next, Esc = Back to module')}</div>
                  <div>
                    {currentIndex < outline.length-1 && <Link to={`/e-learning/lesson/${outline[currentIndex+1].slug}?module=${moduleSlug}`} onClick={()=> logEvent('elearn_prev_next',{direction:'next', to:outline[currentIndex+1].slug})} className="px-4 h-8 rounded-full border border-base text-[12px] hover:bg-[var(--color-primary-light)]">{t('elearning.nextLesson','Next lesson')}</Link>}
                  </div>
                </div>
              )}
            </article>
            <aside className="space-y-6">
              {outline.length>0 && (
                <div className="rounded-xl border border-base p-4 bg-white" aria-label="Module outline">
                  <h4 className="text-[13px] font-semibold text-primary mb-2">{t('elearning.moduleOutline','Module outline')}</h4>
                  <ul className="space-y-1 text-[12px] text-secondary">
                    {outline.map(o=> {
                      const isCurrent = o.slug===slug; return (
                        <li key={o.slug} className={`truncate px-2 py-1 rounded-md border ${isCurrent?'bg-[var(--color-primary-light)] border-base font-medium':''}`}> <Link to={`/e-learning/lesson/${o.slug}?module=${moduleSlug}`} className="block truncate">{o.order_index}. {o.title}{isCurrent && ' (current)'}</Link></li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {related.length>0 && (
                <div className="rounded-xl border border-base p-4 bg-white" aria-label="Related lessons">
                  <h4 className="text-[13px] font-semibold text-primary mb-2">{t('elearning.relatedLessons','Related lessons')}</h4>
                  <ul className="space-y-3">
                    {related.map(r=> (
                      <li key={r.slug}>
                        <Link to={`/e-learning/lesson/${r.slug}`} className="block rounded-md border border-base p-3 hover:bg-[var(--color-primary-light)]">
                          <div className="w-full aspect-video rounded-sm border border-base overflow-hidden bg-[var(--color-primary-light)] mb-2 flex items-center justify-center text-[10px] text-secondary">
                            {r.cover_image_url ? (
                              <img src={r.cover_image_url} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                            ) : null}
                          </div>
                          <div className="text-[12px] font-medium text-primary line-clamp-2">{r.title} — {r.level}</div>
                          <div className="text-[10px] text-secondary">{r.level} • {r.duration_minutes} min</div>
                        </Link>
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
export default ELearningLessonPage;
