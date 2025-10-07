import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PublicPageShell from '../../components/layout/PublicPageShell';
import { Activity, Lightbulb, FlaskConical, BookOpen, Search } from 'lucide-react';
import { imageForIndex, courseImageAlt } from '../../data/imagePools';
import { blogStore } from '../../services/blogStore';
import { blogArticles } from '../../data/blogArticles';

const BlogPage: React.FC = () => {
  // Filters / pagination state (resource-style)
  const [q,setQ] = useState('');
  const [category,setCategory] = useState('all');
  const [sort,setSort] = useState<'newest'|'oldest'>('newest');
  const [year,setYear] = useState<number|''>('');
  const [tags,setTags] = useState<string[]>([]);
  const [showTags,setShowTags] = useState(false);
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(6);
  const navigate = useNavigate();

  // All narrative & side panels removed for simplified layout

  // Mapping of landing story images by slug for continuity in grid thumbnails
  const landingImageBySlug = useMemo(() => ({
    'from-absenteeism-to-attendance': '/photos/Dossier/Generated Image October 02, 2025 - 9_15AM.png',
    'training-day-mhm-basics': '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
    'coops-women-led-production': '/photos/Dossier/Generated Image October 02, 2025 - 8_50AM (1).png'
  } as Record<string,string>),[]);

  const basePostData = [
    {
      id: '2',
      slug: 'why-dignity-engineering-matters',
      title: 'Why dignity engineering matters in MHM',
      excerpt: 'Exploring innovative approaches to bring digital literacy to underserved populations.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Michael Chen',
      authorRole: 'Technology Lead',
      publishDate: '2024-12-10',
      readTime: '7 min read',
      category: 'insights',
      tags: ['education', 'technology', 'digital'],
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: '4',
      slug: 'coops-women-led-production',
      title: 'Co-ops at the center: women-led production',
      excerpt: 'Latest research on cost-effective approaches to sustainable development projects.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Dr. James Wilson',
      authorRole: 'Research Director',
      publishDate: '2024-12-05',
      readTime: '10 min read',
      category: 'research',
      tags: ['research', 'economics', 'sustainability'],
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: '6',
      slug: 'training-day-mhm-basics',
      title: 'Training day: MHM basics that stick',
      excerpt: 'How we\'re revolutionizing training programs with innovative pedagogical approaches.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Lisa Thompson',
      authorRole: 'Training Specialist',
      publishDate: '2024-11-28',
      readTime: '8 min read',
      category: 'insights',
      tags: ['training', 'innovation', 'methodology'],
      image: '/api/placeholder/400/250',
      featured: false
    }
  ];

  // Replace water post titles later to align with menstrual health theme if desired.
  // Merge admin-managed posts with static articles (union by slug, admin overrides)
  const adminPosts = blogStore.list().filter(r=> r.status==='published');
  const staticRows = (blogArticles && blogArticles.length ? blogArticles.map((a,idx)=> ({
    id: String(idx+1),
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt || '',
    author: a.author?.name || 'E4D',
    authorRole: a.author?.role || '',
    publishDate: a.published_at,
    readTime: `${a.read_minutes} min read`,
    category: (a.category as any) || 'impact',
    tags: a.tags || [],
    image: a.cover_image_url || '',
    featured: false
  })) : basePostData);
  const bySlug = new Map(staticRows.map(r=> [r.slug, r] as const));
  if (adminPosts.length) {
    adminPosts.forEach((r, i)=> {
      const existing = bySlug.get(r.slug);
      const merged = {
        id: existing?.id || `adm-${i+1}`,
        slug: r.slug,
        title: r.title || existing?.title || r.slug,
        excerpt: r.excerpt || existing?.excerpt || '',
        author: r.author_name || existing?.author || 'E4D',
        authorRole: existing?.authorRole || '',
        publishDate: r.published_at || existing?.publishDate || new Date().toISOString(),
        readTime: `${r.read_minutes || (existing?.readTime? Number((existing.readTime||'').split(' ')[0]) : 5)} min read`,
        category: r.category || existing?.category || 'impact',
        tags: r.tags || existing?.tags || [],
        image: existing?.image || '', // prefer curated static cover for consistency
        featured: existing?.featured || false
      };
      bySlug.set(r.slug, merged);
    });
  }
  const blogPosts = Array.from(bySlug.values());

  const categoryMeta: Record<string, { name: string; icon: React.ReactNode }> = {
    impact: { name: 'Impact Stories', icon: <Activity className="w-4 h-4" /> },
    insights: { name: 'Insights', icon: <Lightbulb className="w-4 h-4" /> },
    updates: { name: 'Project Updates', icon: <BookOpen className="w-4 h-4" /> },
    research: { name: 'Research', icon: <FlaskConical className="w-4 h-4" /> },
    howto: { name: 'How‑to', icon: <BookOpen className="w-4 h-4" /> }
  };

  const categories = useMemo(()=>{
    const counts: Record<string, number> = {};
    blogPosts.forEach(p=>{ counts[p.category]=(counts[p.category]||0)+1; });
    return [{id:'all', name:'All Posts', count: blogPosts.length}, ...Object.entries(categoryMeta).map(([id,meta])=>({id, name:meta.name, count: counts[id]||0}))];
  },[blogPosts]);

  const years = useMemo(()=> Array.from(new Set(blogPosts.map(p=> new Date(p.publishDate).getFullYear()))).sort((a,b)=> b-a),[blogPosts]);
  const allTags = useMemo(()=> Array.from(new Set(blogPosts.flatMap(p=> p.tags))).sort(),[blogPosts]);

  const filtered = blogPosts.filter(p=>{
    const qq = q.toLowerCase();
    const okQ = !q || p.title.toLowerCase().includes(qq) || p.excerpt.toLowerCase().includes(qq) || p.tags.some(t=> t.toLowerCase().includes(qq));
    const okCat = category==='all' || p.category===category;
    const yr = new Date(p.publishDate).getFullYear();
    const okYear = !year || yr === year;
    const okTags = !tags.length || tags.every(t=> p.tags.includes(t));
    return okQ && okCat && okYear && okTags;
  }).sort((a,b)=> sort==='newest' ? (new Date(b.publishDate).getTime()-new Date(a.publishDate).getTime()) : (new Date(a.publishDate).getTime()-new Date(b.publishDate).getTime()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);

  // Prefer each article's own cover image for the list thumbnail.
  function getCoverFor(slug: string, idx: number): string {
    // First, if this slug matches one of the landing stories, use that exact image for visual continuity
    if (landingImageBySlug[slug]) return landingImageBySlug[slug];
    const fromStatic = blogArticles.find(a=> a.slug===slug)?.cover_image_url || '';
    if (fromStatic) return fromStatic;
    const fromStore = blogStore.get(slug)?.cover_image_url || '';
    return fromStore || imageForIndex(idx);
  }

  function resetAll(){ setQ(''); setCategory('all'); setSort('newest'); setYear(''); setTags([]); setPage(1); }
  function toggleTag(tag:string){ setTags(cur=> cur.includes(tag)? cur.filter(t=> t!==tag): [...cur, tag]); }

  return (
    <PublicPageShell>
      {/* Header */}
      <header className="space-y-2 mb-8">
        <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">Blog</h1>
        <p className="text-[14px] leading-[20px] text-secondary">Field notes, impact updates & research logs.</p>
      </header>

      {/* Stories section removed per request */}

      {/* Toolbar */}
      <section className="sticky top-[84px] z-30 mb-10">
        <div className="rounded-2xl bg-white border border-base p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <input value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} placeholder="Search posts..." className="h-10 w-full pl-9 pr-4 rounded-full text-[13px] border border-base bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <select value={category} onChange={e=>{setCategory(e.target.value); setPage(1);}} className="h-10 px-3 rounded-full border border-base bg-white text-[13px]">
            {categories.map(c=> <option key={c.id} value={c.id}>{c.name} ({c.count})</option>)}
          </select>
          <select value={year} onChange={e=> {setYear(e.target.value ? Number(e.target.value):''); setPage(1);}} className="h-10 px-3 rounded-full border border-base bg-white text-[13px] w-[110px]">
            <option value="">Year</option>
            {years.map(y=> <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="relative" aria-expanded={showTags} aria-haspopup="listbox">
            <button type="button" onClick={()=> setShowTags(s=>!s)} className="h-10 px-3 rounded-full border border-base bg-white flex items-center gap-2 text-[13px]">
              <span>Tags</span>
              {tags.length>0 && <span className="text-[11px] rounded-full px-2 py-[2px] bg-[var(--color-primary-light)] border border-base text-primary">{tags.length}</span>}
            </button>
            {showTags && (
              <div className="absolute left-0 mt-2 w-[240px] max-h-[250px] overflow-y-auto rounded-xl border border-base bg-white shadow-lg p-3 z-40 grid gap-2" role="listbox">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-medium text-secondary">Select tags</span>
                  {tags.length>0 && <button type="button" onClick={()=> setTags([])} className="text-[11px] underline text-secondary">Clear</button>}
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
                  <button type="button" onClick={()=> setShowTags(false)} className="text-[11px] underline text-secondary">Done</button>
                </div>
              </div>
            )}
          </div>
          <select value={sort} onChange={e=>{setSort(e.target.value as any); setPage(1);}} className="h-10 px-3 rounded-full border border-base bg-white text-[13px] w-[150px]">
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          {(q||category!=='all'||year||tags.length||sort!=='newest') && <button onClick={resetAll} className="h-10 px-4 rounded-full border border-base bg-white text-[12px]">Reset</button>}
        </div>
      </section>

      {/* Grid */}
      <section id="posts" aria-live="polite" className="min-h-[400px] space-y-8">
          {paginated.length===0 && (
            <div className="text-center py-24 text-[14px]" style={{color:'var(--slate-600)'}}>No posts. <button onClick={resetAll} className="underline">Clear filters</button>.</div>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((post, idx) => {
              // derive pseudo-progress from readTime (e.g., '5 min read')
              return (
                <article key={post.id} className="rounded-xl border border-base bg-white flex flex-col overflow-hidden hover:shadow-sm hover:border-primary/40 transition">
                  <div className="w-full aspect-video border-b border-base relative overflow-hidden">
                    <img
                      src={getCoverFor(post.slug, idx)}
                      alt={courseImageAlt('blog', post.title)}
                      loading={idx > 2 ? 'lazy' : 'eager'}
                      className="w-full h-full object-cover"
                      onError={(e)=> { (e.currentTarget as HTMLImageElement).src = '/photos/banniere.png'; }}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[11px] text-secondary">{categoryMeta[post.category]?.name || post.category}</div>
                    <h3 className="mt-2 text-[15px] leading-[20px] font-semibold text-primary line-clamp-3">{post.title}</h3>
                    <div className="mt-1 text-[11px] text-secondary">{new Date(post.publishDate).toLocaleDateString(undefined,{month:'short', year:'numeric'})} • {post.readTime}</div>
                    <div className="mt-3 flex justify-end">
                      <button onClick={()=>navigate(`/blog/${post.slug}`, { state: { coverOverride: getCoverFor(post.slug, idx) } })} className="px-3 h-8 rounded-full border border-base text-[12px] font-medium hover:bg-[var(--color-primary-light)]">Read →</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      {/* Pagination */}
      <nav className="mt-6 flex items-center justify-between text-[12px] flex-wrap gap-4" aria-label="Pagination">
        <div className="flex items-center gap-2">Rows:
          <select value={pageSize} onChange={e=>{setPageSize(Number(e.target.value)); setPage(1);}} className="h-8 px-2 rounded-full border border-base bg-white">
            {[6,9,12].map(sz=> <option key={sz} value={sz}>{sz}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Previous page" onClick={()=>setPage(p=> Math.max(1,p-1))} disabled={page===1} className="h-8 px-3 rounded-full transition-colors border border-base bg-[var(--color-primary-light)] text-primary disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
          {Array.from({length: totalPages}).slice(0,5).map((_,i)=> { const n=i+1; const active=n===page; return (
            <button key={n} aria-current={active?'page':undefined} onClick={()=>setPage(n)} className={`w-8 h-8 rounded-full text-[12px] border border-base ${active? 'bg-primary text-white':'bg-[var(--color-primary-light)] text-primary hover:brightness-95'}`}>{n}</button>
          );})}
          <button aria-label="Next page" onClick={()=>setPage(p=> Math.min(totalPages,p+1))} disabled={page===totalPages} className="h-8 px-3 rounded-full transition-colors border border-base bg-[var(--color-primary-light)] text-primary disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
        </div>
      </nav>

      {/* Support banner (minimal) */}
      <section className="pt-10">
        <div className="rounded-xl border border-base bg-white p-6 space-y-4 text-center">
          <h2 className="text-[18px] leading-[24px] font-semibold text-primary">Support field innovation & menstrual dignity education.</h2>
          <Link to="/donate" className="btn-donate inline-flex justify-center">Donate</Link>
        </div>
      </section>
    </PublicPageShell>
  );
};

export default BlogPage;
