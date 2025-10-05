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
  cover_image_url: '/photos/course/Generated Image October 03, 2025 - 9_00AM.png',
    published_at: '2025-05-10',
    updated_at: '2025-05-01',
    is_public: true,
    body_sections: [
      { h2: 'What is MHM?', html: `
        <p>Menstrual Hygiene Management (MHM) means having the information, materials, and privacy to manage your period with dignity at home, at school, and at work.</p>
        <ul>
          <li>Reliable materials (for example, reusable pads)</li>
          <li>Clean water and soap for washing hands and pads</li>
          <li>A private space for changing and cleaning</li>
          <li>Simple, age‑appropriate information and support</li>
        </ul>
      ` },
      { h2: 'A real moment from class', html: `
        <p>“I didn’t come to school yesterday because I was afraid I would stain my dress.” When Amina said this, half the girls nodded. We paused, breathed, and listed three things that make school days easier: a spare pad, a small pouch, and a friendly adult to ask for help. By the end, Amina smiled and said, “I can try tomorrow.”</p>
      ` },
      { h2: 'Materials and safe use', html: `
        <p>Reusable pads feel soft and can be used for many months when cleaned well. Show how to position the pad, how to check absorbency, and where to keep a spare.</p>
        <p><strong>Cleaning basics:</strong> wash with soap and clean water, rinse until clear, and dry fully in sunlight or a ventilated space. Sunlight helps kill germs.</p>
      ` },
      { h2: 'Healthy practices', html: `
        <p>Change pads every 4–6 hours (or sooner if heavy flow). Wash hands before and after changing. If there is persistent pain, rash, or strong odor, talk to a health worker.</p>
      ` },
      { h2: 'Try it together', html: `
        <ol>
          <li>Pack a small period pouch: pad, soap, tissue, and bag.</li>
          <li>Practise how to fold and store a used pad discreetly.</li>
          <li>Choose three supportive people you can ask for help.</li>
        </ol>
      ` },
      { h2: 'Download & reference', links: [ { label:'One-pager (PDF)', url:'/files/mhm-onepager.pdf' }, { label:'Facilitator checklist (PDF)', url:'/files/facilitator-checklist.pdf' }, { label:'WHO — Menstruation', url:'https://www.who.int/health-topics/menstruation' } ] }
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
  cover_image_url: '/photos/course/Generated Image October 03, 2025 - 9_15AM.png',
    published_at: '2025-05-12',
    updated_at: '2025-05-12',
    is_public: true,
    body_sections: [
      { h2: 'Choosing materials', html: `
        <p>Look for soft, breathable layers and a comfortable shape. A practical kit includes two or more pads, a leak‑resistant base, and a small pouch.</p>
      ` },
      { h2: 'Cleaning process', html: `
        <ol>
          <li>Rinse with cool water (this helps release blood without setting stains).</li>
          <li>Wash with soap; gently rub the fabric—no need to scrub hard.</li>
          <li>Rinse until water runs clear.</li>
          <li>Dry fully in the sun or a well‑ventilated space.</li>
        </ol>
      ` },
      { h2: 'Story: first reusable kit', html: `
        <p>Grace said, “I thought washing would be hard. It took ten minutes, and it dried by afternoon.” She liked that the pad felt soft and didn’t itch.</p>
      ` },
      { h2: 'Safe storage', html: `<p>Use a clean, breathable bag. Avoid sealing damp pads in plastic—moisture can cause irritation or odor.</p>` },
      { h2: 'Troubleshooting', html: `
        <ul>
          <li><strong>Itchy skin?</strong> Rinse soap out completely and ensure full drying.</li>
          <li><strong>Leaks?</strong> Try a thicker pad or change a bit sooner.</li>
          <li><strong>Stains?</strong> Soak briefly in cool water before washing.</li>
        </ul>
      ` },
      { h2: 'Download & reference', links: [ { label:'Care & washing card (PDF)', url:'/files/care-card.pdf' } ] }
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
  cover_image_url: '/photos/course/Generated Image October 02, 2025 - 9_21AM.png',
    published_at: '2025-05-14',
    updated_at: '2025-05-14',
    is_public: true,
    body_sections: [
      { h2: 'Common myths', html: `<p>Examples: “You cannot attend class,” “You should not cook,” or “Periods are dirty.” Replace each with a short fact: periods are healthy, you can study, and you can help at home safely.</p>` },
      { h2: 'Story: talking with family', html: `<p>Esperance told her brother why she sometimes carried a pouch. He said, “Okay—how can I help?” Small conversations reduce shame and build support.</p>` },
      { h2: 'Addressing stigma', html: `<p>Use simple, respectful words. Create routines that protect privacy (spare pads in the office, a sign‑out system for bathroom breaks).</p>` },
      { h2: 'Facilitation prompts', html: `<ul><li>“What helps you feel confident on period days?”</li><li>“Who could be an ally at school?”</li><li>“What myth have you heard that we can replace with a fact?”</li></ul>` },
      { h2: 'Cultural sensitivity', html: `<p>Listen first. Keep health guidance accurate while adapting examples to local realities. Invite caregivers to ask questions without judgement.</p>` },
      { h2: 'Download & reference', links: [ { label:'UNICEF — MHH resources', url:'https://www.unicef.org/wash/menstrual-hygiene-management' } ] }
    ],
    quick_tip: 'Start with one myth at a time. Replace it with a short, memorable fact.'
  },
  {
    title: 'Healthy practices',
    slug: 'healthy-practices',
    summary: 'Frequency, hygiene, safe disposal.',
    level: 'Beginner',
    duration_minutes: 7,
    tags: ['MHM'],
    topic: 'MHM',
  cover_image_url: '/photos/course/Generated Image October 03, 2025 - 9_04AM (1).png',
    published_at: '2025-05-16',
    updated_at: '2025-05-16',
    is_public: true,
    body_sections: [
      { h2: 'Change frequency', html: `<p>Change every 4–6 hours or sooner if needed. Keep a spare pad and a small bag for used pads. Plan ahead for long trips or exams.</p>` },
      { h2: 'Handwashing', html: `<p>Wash with soap and water before and after changing. If water is limited, carry a small soap and use a tippy‑tap or sanitizer as a backup.</p>` },
      { h2: 'Disposal', html: `<p>Follow local guidance. For disposables: wrap and place in a bin or pit—do not flush. For reusables: wash and reuse; dispose only if damaged.</p>` },
      { h2: 'Cramps & self‑care', html: `<p>Warmth, gentle movement, and hydration help. If pain is severe or doesn’t improve, seek advice from a health worker.</p>` },
      { h2: 'Seeking care', html: `<p>Go to a clinic for persistent pain, rash, fever, or unusual bleeding. It’s okay to ask for help.</p>` },
      { h2: 'Download & reference', links: [ { label:'Classroom quick poster (PDF)', url:'/files/classroom-quick-poster.pdf' } ] }
    ],
    quick_tip: 'A small “comfort plan” (water, warm cloth, quiet corner) reassures learners on tough days.'
  },
  {
    title: 'Packing a discreet school kit',
    slug: 'packing-discreet-school-kit',
    summary: 'What to pack, where to store, and how to plan handwashing at school.',
    level: 'Beginner',
    duration_minutes: 5,
    tags: ['MHM','School'],
    topic: 'MHM',
  cover_image_url: '/photos/Dossier/Generated Image October 02, 2025 - 8_50AM (1).png',
    published_at: '2025-05-18',
    updated_at: '2025-05-18',
    is_public: true,
    body_sections: [
      { h2: 'Checklist', html: `<ul><li>Reusable pad (x2)</li><li>Small breathable pouch</li><li>Wipes or tissue</li><li>Small soap bar</li><li>Bag for used pads</li></ul>` },
      { h2: 'Privacy routine', html: `<p>Agree on a simple signal with a teacher. Use known private spots. Keep one spare pad in a pocket you can reach quickly.</p>` },
      { h2: 'Handwashing plan', html: `<p>Know where water and soap are available. If none, carry a small soap and use a tippy‑tap or sanitizer as a backup.</p>` },
      { h2: 'If things go wrong', html: `<p>If a stain happens, wrap a spare cloth around the waist, change into a fresh pad, and take three calm breaths. It happens—and it’s okay.</p>` }
    ],
    quick_tip: 'Keep the kit in the same pocket every day—less to think about when you need it fast.'
  },
  {
    title: 'Care guide for caregivers',
    slug: 'care-guide-caregivers',
    summary: 'Simple support at home: laundering, drying, and talking about periods.',
    level: 'Beginner',
    duration_minutes: 6,
    tags: ['Caregivers','Home'],
    topic: 'MHM',
  cover_image_url: '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
    published_at: '2025-05-19',
    updated_at: '2025-05-19',
    is_public: true,
    body_sections: [
      { h2: 'Laundry routine', html: `<p>Rinse first, wash with soap, rinse clear, and dry fully. Help set up a drying line where air and sunlight can reach.</p>` },
      { h2: 'Conversation starters', html: `<ul><li>“How did this month go? Anything that felt hard?”</li><li>“Do you have enough pads for next week?”</li><li>“What would make school days easier?”</li></ul>` },
      { h2: 'Money‑smart view', html: `<p>Reusable pads save money across the year when cleaned well. Plan a small monthly budget for soap and replacements.</p>` },
      { h2: 'When to seek care', html: `<p>Persistent pain, rash, strong odor, or unusual bleeding warrant a clinic visit. Trust your instincts as a caregiver.</p>` }
    ],
    quick_tip: 'Praise small wins (washing well, packing a pouch). Confidence grows from consistency.'
  }
];

const moduleRecord: ModuleRecord = {
  title: 'MHM Essentials',
  slug: 'mhm-essentials',
  summary: 'Basics of menstrual health, reusable kits, myths & healthy practices.',
  level: 'Beginner',
  tags: ['MHM','Education'],
  cover_image_url: null,
  // Optional module cover can use a generic placeholder
  // cover_image_url: '/images/placeholder-generic.svg',
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
