import { BlogArticle, BlogArticleIndexMeta, BlogAuthor } from '../types/blog';

const LS_KEY = 'e4d_blog_articles_v1';

function loadAll(): BlogArticle[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seed();
    const arr = JSON.parse(raw) as BlogArticle[];
    return Array.isArray(arr) ? arr : seed();
  } catch {
    return seed();
  }
}

function persist(all: BlogArticle[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

function seed(): BlogArticle[] {
  const author: BlogAuthor = { id: 'auth1', name: 'E4D Ops', role: 'Operations' };
  const s: BlogArticle[] = [
    {
      title: 'From absenteeism to attendance: reusable kits at work',
      slug: 'from-absenteeism-to-attendance',
      category: 'impact',
      tags: ['MHM','Attendance','Case Study'],
      author,
  cover_image_url: '/photos/jeune-adulte-deprime-a-la-maison.jpg',
      published_at: new Date().toISOString(),
      read_minutes: 6,
      excerpt: 'What changed when girls received training and reusable kits.',
      body_md: '# Headline\n\nShort intro...\n\n- point 1\n- point 2',
      callout_transparency: 'Photos anonymized. Data aggregated over 3 schools.'
    },
    {
      title: 'Mobile money receipts for dignity kits',
      slug: 'mobile-money-receipts-kits',
      category: 'howto',
      tags: ['Payments','How-to'],
      author,
  cover_image_url: '/photos/tir-isole-de-l-heureuse-jeune-femme-afro-tient-un-tampon-de-coton-menstuation-et-une-serviette-hygienique.jpg',
      published_at: new Date(Date.now()-86400e3*20).toISOString(),
      read_minutes: 4,
      excerpt: 'Simple flows for transparency-friendly reimbursements.',
      body_md: 'Content coming soon.'
    }
  ];
  persist(s);
  return s;
}

export type BlogStatus = 'draft'|'published';

export interface BlogIndexRow extends BlogArticleIndexMeta {
  status: BlogStatus;
  author_name: string;
}

export const blogStore = {
  list(): BlogIndexRow[] {
    const all = loadAll();
  return all.map(a=> ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      tags: a.tags,
      excerpt: a.excerpt,
      published_at: a.published_at,
      read_minutes: a.read_minutes,
      featured: false,
  status: (a.published_at ? 'published' : 'draft') as BlogStatus,
      author_name: a.author?.name || 'Unknown'
    })).sort((a,b)=> new Date(b.published_at).getTime()-new Date(a.published_at).getTime());
  },
  get(slug: string): BlogArticle | undefined {
    return loadAll().find(a=> a.slug===slug);
  },
  upsert(article: BlogArticle) {
    const all = loadAll();
    const idx = all.findIndex(a=> a.slug===article.slug);
    if (idx>=0) all[idx]=article; else all.push(article);
    persist(all);
  },
  delete(slug: string) {
    const all = loadAll().filter(a=> a.slug!==slug);
    persist(all);
  },
  publish(slug: string) {
    const all = loadAll();
    const a = all.find(x=> x.slug===slug);
    if (a) { a.published_at = new Date().toISOString(); persist(all);} 
  },
  unpublish(slug: string) {
    const all = loadAll();
    const a = all.find(x=> x.slug===slug);
    if (a) { a.published_at = ''; persist(all);} 
  }
};
