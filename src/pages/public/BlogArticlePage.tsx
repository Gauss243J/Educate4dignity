import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicNav from '../../components/layout/PublicNav';
// Logo import removed (handled inside PublicFooter)
import NewsletterSignup from '../../components/ui/NewsletterSignup';
import PublicFooter from '../../components/layout/PublicFooter';
import { findArticleBySlug } from '../../data/blogArticles';
import { BlogArticle } from '../../types/blog';
import { ArrowLeft, Share2, Copy, Check, ShieldCheck, Clock, Tag, BookOpen, ChevronRight } from 'lucide-react';

import { mdToHtml } from '../../utils/markdown';
import { blogStore } from '../../services/blogStore';
import { transformArticleHtml } from '../../utils/mediaTransform';

const BlogArticlePage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article: BlogArticle | undefined = slug ? findArticleBySlug(slug) : undefined;
  // Prefer store article if exists (admin-published). Fallback to existing logic below.
  const storeArticle = blogStore.get(slug!);
  const [copied, setCopied] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if(!article) return;
    const onScroll = () => {
      if(!contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight + 120; // some offset
      const scrolled = Math.min(Math.max(window.scrollY - (contentRef.current.offsetTop - 80), 0), total);
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [article]);

  const toc = useMemo(() => {
    if(!article) return [] as { id: string; text: string; level: number }[];
    const lines = article.body_md.split(/\n/);
    const items: { id: string; text: string; level: number }[] = [];
    lines.forEach(line => {
      const h2 = line.match(/^## (.+)/);
      const h3 = line.match(/^### (.+)/);
      if(h2){
        const id = h2[1].toLowerCase().replace(/[^a-z0-9]+/g,'-');
        items.push({ id, text: h2[1], level: 2 });
      } else if(h3){
        const id = h3[1].toLowerCase().replace(/[^a-z0-9]+/g,'-');
        items.push({ id, text: h3[1], level: 3 });
      }
    });
    return items;
  }, [article]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    });
  };

  if(!article){
    return (
      <div className="min-h-screen bg-[var(--rose-50)]">
        <PublicNav />
        <div className="max-w-[1200px] mx-auto px-6 pt-28 pb-40 text-center">
          <h1 className="text-[32px] font-extrabold text-[var(--slate-900)] mb-6">Article not found</h1>
          <button onClick={()=>navigate('/blog')} className="h-11 px-6 rounded-md bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white font-semibold inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4"/>Back to blog</button>
        </div>
      </div>
    );
  }

  const htmlBody = mdToHtml(article.body_md);
  const withMediaTransforms = (html: string) => transformArticleHtml(html);

  return (
    <div className="min-h-screen bg-[var(--rose-50)] font-[Segoe UI,ui-sans-serif,sans-serif] relative">
      <PublicNav />
      {/* Reading progress bar */}
      <div ref={progressRef} className="fixed top-[64px] left-0 right-0 h-1 bg-[var(--rose-200)] z-40">
        <div className="h-full bg-[var(--rose-600)] transition-all" style={{width: `${progress}%`}}></div>
      </div>

      <main className="pt-24 pb-24 px-6">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[820px_300px] gap-8">
          {/* Content */}
          <article ref={contentRef} className="space-y-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-[12px] text-[var(--slate-600)] flex flex-wrap gap-1">
              <Link to="/" className="hover:text-[var(--rose-700)]">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-[var(--rose-700)]">Blog</Link>
              <span>/</span>
              <span className="text-[var(--slate-700)]">{article.category}</span>
              <span>/</span>
              <span className="text-[var(--slate-900)] font-medium">{article.title}</span>
            </nav>

            {/* Cover */}
            {article.cover_image_url && (
              <div className="relative rounded-2xl overflow-hidden border" style={{borderColor:'var(--rose-200)'}}>
                <div className="w-full aspect-video bg-[var(--rose-100)] flex items-center justify-center text-[12px] text-[var(--rose-700)]">Cover image placeholder</div>
                {article.cover_consent_verified && (
                  <div className="absolute top-3 left-3 h-7 px-3 rounded-full text-[11px] font-medium bg-white/85 backdrop-blur border flex items-center gap-1" style={{borderColor:'var(--rose-200)'}}>
                    <ShieldCheck className="w-4 h-4 text-[var(--rose-600)]" /> Consent verified
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <header className="space-y-4">
              <h1 className="text-[32px] leading-[38px] font-extrabold text-[var(--slate-900)]">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-[15px] leading-[22px] text-[var(--slate-700)] max-w-2xl">{article.excerpt}</p>
              )}
            </header>

            {/* Byline */}
            <div className="rounded-2xl bg-white border p-5 flex flex-col gap-4" style={{borderColor:'var(--rose-200)'}}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center text-[12px] font-medium" style={{borderColor:'var(--rose-200)', background:'var(--rose-100)', color:'var(--rose-700)'}}>
                    {article.author.avatar_url ? <span className="text-[10px]">IMG</span> : article.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--slate-900)] text-[14px]">{article.author.name}</div>
                    {article.author.role && <div className="text-[12px] text-[var(--slate-600)]">{article.author.role}</div>}
                  </div>
                </div>
                <div className="text-[12px] text-[var(--slate-600)] flex items-center gap-2 flex-wrap">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{article.read_minutes} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleCopyLink} className="h-9 px-3 rounded-md bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white text-[12px] font-medium inline-flex items-center gap-1">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied' : 'Copy link'}
                  </button>
                  <button className="h-9 px-3 rounded-md bg-white border text-[12px] font-medium inline-flex items-center gap-1" style={{borderColor:'var(--rose-200)', color:'var(--rose-700)'}}>
                    <Share2 className="w-4 h-4"/> Share
                  </button>
                </div>
              </div>
              {(article.category || (article.tags && article.tags.length)) && (
                <div className="flex flex-wrap gap-2">
                  {article.category && (
                    <span className="inline-flex items-center gap-1 h-7 px-3 rounded-full text-[11px] font-medium bg-[var(--rose-100)] border" style={{borderColor:'var(--rose-200)', color:'var(--rose-700)'}}>
                      <BookOpen className="w-3 h-3" /> {article.category}
                    </span>
                  )}
                  {article.tags?.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 h-7 px-3 rounded-full text-[11px] font-medium border" style={{borderColor:'var(--rose-200)', color:'var(--slate-700)'}}>
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article body */}
            <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-[var(--slate-900)] prose-p:text-[14px] prose-p:leading-[20px] prose-p:text-[var(--slate-700)] prose-blockquote:border-l-4 prose-blockquote:border-[var(--rose-300)] prose-blockquote:bg-[var(--rose-50)] prose-blockquote:p-4 prose-blockquote:rounded-xl prose-blockquote:text-[var(--slate-700)] prose-img:rounded-xl bg-white border rounded-2xl p-8" style={{borderColor:'var(--rose-200)'}} dangerouslySetInnerHTML={{__html: withMediaTransforms((storeArticle?.body_html) ? storeArticle.body_html : htmlBody)}} />

            {/* Transparency callout */}
            {article.callout_transparency && (
              <div className="rounded-2xl border p-6 bg-white flex gap-4" style={{borderColor:'var(--rose-200)'}}>
                <div className="w-10 h-10 rounded-lg bg-[var(--rose-100)] flex items-center justify-center text-[var(--rose-700)] font-semibold">i</div>
                <div className="space-y-1">
                  <h3 className="text-[14px] font-semibold text-[var(--slate-900)]">Transparency note</h3>
                  <p className="text-[13px] leading-[19px] text-[var(--slate-700)]">{article.callout_transparency}</p>
                </div>
              </div>
            )}

            {/* Author bio */}
            {article.author.bio && (
              <div className="rounded-2xl border p-6 bg-white flex gap-4" style={{borderColor:'var(--rose-200)'}}>
                <div className="w-16 h-16 rounded-full border flex items-center justify-center text-[12px] font-medium" style={{borderColor:'var(--rose-200)', background:'var(--rose-100)', color:'var(--rose-700)'}}>
                  {article.author.avatar_url ? <span className="text-[10px]">IMG</span> : article.author.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-[var(--slate-900)] text-[14px]">{article.author.name}</div>
                  <p className="text-[13px] leading-[19px] text-[var(--slate-700)] max-w-xl">{article.author.bio}</p>
                </div>
              </div>
            )}

            {/* Related */}
            {article.related && article.related.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[18px] font-bold text-[var(--slate-900)]">Keep Reading</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {article.related.slice(0,2).map(r => (
                    <Link key={r.slug} to={`/blog/${r.slug}`} className="group rounded-2xl border p-5 bg-white flex flex-col gap-3 hover:shadow-sm transition" style={{borderColor:'var(--rose-200)'}}>
                      <div className="h-28 rounded-xl bg-[var(--rose-100)] border flex items-center justify-center text-[11px] text-[var(--rose-600)]" style={{borderColor:'var(--rose-200)'}}>Preview image</div>
                      <div className="font-semibold text-[14px] leading-[20px] text-[var(--slate-900)] group-hover:text-[var(--rose-700)] line-clamp-3">{r.title}</div>
                      <div className="text-[12px] text-[var(--rose-700)] inline-flex items-center gap-1 mt-auto">Read article <ChevronRight className="w-4 h-4"/></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 h-fit">
            {toc.length > 0 && (
              <div className="rounded-2xl border bg-white p-5" style={{borderColor:'var(--rose-200)'}}>
                <h2 className="text-[14px] font-semibold text-[var(--slate-900)] mb-3">On this page</h2>
                <ul className="space-y-2 text-[12px] text-[var(--slate-700)]">
                  {toc.map(item => (
                    <li key={item.id} className={item.level===3 ? 'pl-4 relative before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:bg-[var(--rose-400)] before:rounded-full':''}>
                      <a href={`#${item.id}`} className="hover:text-[var(--rose-700)] focus:outline-none focus:ring-2 focus:ring-[var(--rose-400)] rounded-sm inline-block">{item.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-2xl border bg-white p-5" style={{borderColor:'var(--rose-200)'}}>
              <h2 className="text-[14px] font-semibold text-[var(--slate-900)] mb-3">Subscribe</h2>
              <p className="text-[12px] leading-[18px] text-[var(--slate-600)] mb-3">Monthly round-up of impact stories & transparency updates.</p>
              <NewsletterSignup />
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="rounded-2xl border bg-white p-5" style={{borderColor:'var(--rose-200)'}}>
                <h2 className="text-[14px] font-semibold text-[var(--slate-900)] mb-3">Popular topics</h2>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center h-7 px-3 rounded-full text-[11px] font-medium bg-[var(--rose-100)] border" style={{borderColor:'var(--rose-200)', color:'var(--rose-700)'}}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      <PublicFooter withNewsletter />
    </div>
  );
};

export default BlogArticlePage;
