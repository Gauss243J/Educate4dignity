// Mock e-learning data & simple in-memory query helpers.
// This mirrors the lightweight approach used for blog/resources pages.
// In future, replace with real API calls (see spec in conversation).
import { elearningStore } from '../services/elearningStore';

export interface LessonSummary {
  title: string;
  slug: string;
  summary: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_minutes: number;
  tags?: string[];
  topic?: string;
  cover_image_url?: string | null;
  published_at: string; // ISO date
  is_public: boolean;
}

export interface LessonDetail extends LessonSummary {
  updated_at: string;
  body_sections: Array<{ h2: string; html?: string; links?: { label: string; url: string }[] }>;
  quick_tip?: string;
}

export interface ModuleRecord {
  title: string;
  slug: string;
  summary: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  cover_image_url?: string | null;
  estimated_minutes_total: number;
  lessons_count: number;
  downloads?: { label: string; url: string }[];
  related?: Array<{ title: string; slug: string; summary: string; stats: string; tags?: string[] }>;
  is_public: boolean;
}

// Seed lessons (single module mock)
const lessons: LessonDetail[] = [
  {
    title: 'MHM basics: period health 101',
    slug: 'mhm-basics-101',
    summary: 'Foundations of menstrual health and dignity.',
    level: 'Beginner',
    duration_minutes: 8,
    tags: ['MHM', 'Education'],
    topic: 'MHM',
    cover_image_url: null,
    published_at: '2025-05-10',
    updated_at: '2025-05-01',
    is_public: true,
    body_sections: [
      { h2: 'What is MHM?', html: '<p>Menstrual Hygiene Management (MHM) means access to materials, privacy, water & soap, and enough knowledge to manage periods with dignity.</p>' },
      { h2: 'Materials and safe use', html: '<p>Reusable kits: absorbency, comfort, how to wash and dry in a clean ventilated space.</p>' },
      { h2: 'Myths and stigma', html: '<p>Debunk myths with age-appropriate explanations. Involve boys & parents.</p>' },
      { h2: 'Healthy practices', html: '<p>Handwashing, safe disposal, when to seek care, change frequency.</p>' },
      { h2: 'Download & reference', links: [ { label:'One-pager (PDF)', url:'/files/mhm-onepager.pdf' }, { label:'Facilitator checklist (PDF)', url:'/files/facilitator-checklist.pdf' } ] }
    ],
    quick_tip: 'Teach “wash & dry” with a real kit. Practise once; learners remember.'
  },
  {
    title: 'Materials & safe use',
    slug: 'materials-safe-use',
    summary: 'Absorbency, comfort, washing & drying.',
    level: 'Beginner',
    duration_minutes: 7,
    tags: ['MHM'],
    topic: 'MHM',
    cover_image_url: null,
    published_at: '2025-05-12',
    updated_at: '2025-05-12',
    is_public: true,
    body_sections: [
      { h2: 'Choosing materials', html: '<p>Select safe, reusable materials with proper absorbency.</p>' },
      { h2: 'Cleaning process', html: '<p>Rinse, wash with soap, dry in sunlight or ventilated area.</p>' },
      { h2: 'Safe storage', html: '<p>Store in breathable bag; avoid damp areas.</p>' },
      { h2: 'Irritants & risks', html: '<p>Avoid harsh detergents and prolonged moisture.</p>' },
      { h2: 'Download & reference', links: [] }
    ]
  },
  {
    title: 'Myths & stigma',
    slug: 'myths-stigma',
    summary: 'Simple explanations to debunk myths.',
    level: 'Beginner',
    duration_minutes: 6,
    tags: ['MHM'],
    topic: 'MHM',
    cover_image_url: null,
    published_at: '2025-05-14',
    updated_at: '2025-05-14',
    is_public: true,
    body_sections: [
      { h2: 'Common myths', html: '<p>Identify myths around menstruation.</p>' },
      { h2: 'Addressing stigma', html: '<p>Use inclusive language & education.</p>' },
      { h2: 'Engaging boys & parents', html: '<p>Participation reduces stigma.</p>' },
      { h2: 'Cultural sensitivity', html: '<p>Respect local beliefs while promoting health.</p>' },
      { h2: 'Download & reference', links: [] }
    ]
  },
  {
    title: 'Healthy practices',
    slug: 'healthy-practices',
    summary: 'Frequency, hygiene, safe disposal.',
    level: 'Beginner',
    duration_minutes: 7,
    tags: ['MHM'],
    topic: 'MHM',
    cover_image_url: null,
    published_at: '2025-05-16',
    updated_at: '2025-05-16',
    is_public: true,
    body_sections: [
      { h2: 'Change frequency', html: '<p>Change every 4–6 hours or as needed.</p>' },
      { h2: 'Handwashing', html: '<p>Wash before and after handling materials.</p>' },
      { h2: 'Disposal', html: '<p>Use pit, burn safely, or appropriate waste systems.</p>' },
      { h2: 'Seeking care', html: '<p>Identify infections or issues early.</p>' },
      { h2: 'Download & reference', links: [] }
    ]
  }
];

const moduleRecord: ModuleRecord = {
  title: 'MHM Essentials',
  slug: 'mhm-essentials',
  summary: 'Basics of menstrual health, reusable kits, myths & healthy practices.',
  level: 'Beginner',
  tags: ['MHM','Education'],
  cover_image_url: null,
  estimated_minutes_total: lessons.reduce((a,l)=> a + l.duration_minutes, 0),
  lessons_count: lessons.length,
  downloads: [
    { label:'One-pager (PDF)', url:'/files/mhm-onepager.pdf' },
    { label:'Facilitator checklist (PDF)', url:'/files/facilitator-checklist.pdf' }
  ],
  related: [
    { title:'WASH in Schools', slug:'wash-in-schools', summary:'Water & hygiene basics.', stats:'3 lessons • ~22 min', tags:['School','WASH'] },
    { title:'Privacy & Consent', slug:'privacy-consent', summary:'Photos & anonymization.', stats:'2 lessons • ~14 min', tags:['Policy','Privacy'] }
  ],
  is_public: true
};

// Helpers to layer dynamic admin-created lessons over the static seeds
function storePublishedSummaries(): LessonSummary[] {
  return elearningStore
    .list()
    .filter(r => r.status === 'published')
    .map(r => ({
      title: r.title,
      slug: r.slug,
      summary: r.summary,
      level: r.level,
      duration_minutes: r.duration_minutes,
      tags: r.tags,
      topic: r.topic,
      cover_image_url: r.cover_image_url,
      published_at: r.published_at,
      is_public: true,
    } as LessonSummary));
}

function storeDetail(slug: string): LessonDetail | undefined {
  const rec = elearningStore.get(slug);
  if (!rec || !rec.published_at) return undefined;
  return {
    title: rec.title,
    slug: rec.slug,
    summary: rec.summary,
    level: rec.level,
    duration_minutes: rec.duration_minutes,
    tags: rec.tags,
    topic: rec.topic,
    cover_image_url: rec.cover_image_url,
    published_at: rec.published_at,
    updated_at: rec.updated_at || rec.published_at,
    is_public: true,
    body_sections: [ { h2: 'Lesson', html: rec.body_html } ],
  } as LessonDetail;
}

function combinedPublic(): LessonSummary[] {
  return [...lessons, ...storePublishedSummaries()].filter(l => l.is_public).map(l => ({
    title: l.title,
    slug: l.slug,
    summary: (l as any).summary,
    level: l.level,
    duration_minutes: (l as any).duration_minutes,
    tags: (l as any).tags,
    topic: (l as any).topic,
    cover_image_url: (l as any).cover_image_url,
    published_at: (l as any).published_at,
    is_public: true,
  }));
}

// Public outline convenience (would be filtered for public lessons only)
export function getModuleOutline(moduleSlug: string) {
  if (moduleSlug !== moduleRecord.slug) return [];
  const base = lessons.filter(l => l.is_public);
  const store = storePublishedSummaries();
  const merged = [...base, ...store];
  return merged.map((l,idx) => ({
    title: (l.title || '').replace(': period health 101',''),
    slug: l.slug,
    order_index: idx+1,
    is_public: l.is_public,
  }));
}

export function getModule(slug: string): ModuleRecord | undefined {
  return slug === moduleRecord.slug ? moduleRecord : undefined;
}

export function listLessons(params: { q?: string; topic?: string; level?: string; length?: string; sort?: string; page?: number; pageSize: number }) {
  const { q='', topic='', level='', length='', sort='newest', page=1, pageSize } = params;
  let pool: LessonSummary[] = combinedPublic();
  if(q) pool = pool.filter(l => (l.title + l.summary).toLowerCase().includes(q.toLowerCase()));
  if(topic) pool = pool.filter(l => l.topic === topic);
  if(level) pool = pool.filter(l => l.level === level);
  if(length){
    pool = pool.filter(l => {
      if(length==='<=5') return l.duration_minutes <=5;
      if(length==='6-10') return l.duration_minutes >=6 && l.duration_minutes <=10;
      if(length==='11-15') return l.duration_minutes >=11 && l.duration_minutes <=15;
      if(length==='15+') return l.duration_minutes >15;
      return true;
    });
  }
  if(sort==='newest') pool = pool.slice().sort((a,b)=> b.published_at.localeCompare(a.published_at));
  if(sort==='oldest') pool = pool.slice().sort((a,b)=> a.published_at.localeCompare(b.published_at));
  if(sort==='shortest') pool = pool.slice().sort((a,b)=> a.duration_minutes - b.duration_minutes);
  if(sort==='longest') pool = pool.slice().sort((a,b)=> b.duration_minutes - a.duration_minutes);
  const total = pool.length;
  const start = (page-1)*pageSize;
  const items = pool.slice(start, start + pageSize);
  return { items, total, page };
}

export function getLessonDetail(slug: string): LessonDetail | undefined {
  const fromStore = storeDetail(slug);
  if (fromStore) return fromStore;
  return lessons.find(l => l.slug === slug && l.is_public);
}

export function getRelatedLessons(slug: string) {
  // simplified: pick two different lessons
  const pool = combinedPublic();
  const others = pool.filter(l => l.slug !== slug).slice(0,2).map(l => ({ title: l.title, slug: l.slug, level: l.level, duration_minutes: l.duration_minutes, cover_image_url: l.cover_image_url }));
  return others;
}

// Analytics placeholders
export function logEvent(name: string, payload?: any){
  // eslint-disable-next-line no-console
  console.log(name, payload||{});
}
