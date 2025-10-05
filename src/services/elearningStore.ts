import { LessonSummary } from '../data/elearning';

// Local storage store for E-learning lessons created in Admin
// We store a simplified record including rich HTML body produced by the TipTap editor

export type ElearnStatus = 'draft'|'published';

export interface ElearnLessonRecord {
  title: string;
  slug: string;
  summary: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_minutes: number;
  tags?: string[];
  topic?: string;
  cover_image_url?: string | null;
  published_at: string; // ISO when published; '' when draft
  updated_at: string;   // ISO last update
  body_html: string;    // Rich HTML from admin editor
}

export interface ElearnIndexRow extends LessonSummary {
  status: ElearnStatus;
}

const LS_KEY = 'e4d_elearning_lessons_v1';

function loadAll(): ElearnLessonRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as ElearnLessonRecord[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function persist(all: ElearnLessonRecord[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

export const elearningStore = {
  list(): ElearnIndexRow[] {
    const all = loadAll();
    return all
      .map(l => ({
        title: l.title,
        slug: l.slug,
        summary: l.summary,
        level: l.level,
        duration_minutes: l.duration_minutes,
        tags: l.tags,
        topic: l.topic,
        cover_image_url: l.cover_image_url,
        published_at: l.published_at,
        is_public: !!l.published_at,
        status: (l.published_at ? 'published' : 'draft') as ElearnStatus,
      }))
      .sort((a,b)=> (b.published_at||'').localeCompare(a.published_at||''));
  },
  get(slug: string): ElearnLessonRecord | undefined {
    return loadAll().find(l => l.slug === slug);
  },
  upsert(rec: ElearnLessonRecord) {
    const all = loadAll();
    const i = all.findIndex(l => l.slug === rec.slug);
    if (i >= 0) all[i] = rec; else all.push(rec);
    persist(all);
  },
  delete(slug: string) {
    const all = loadAll().filter(l => l.slug !== slug);
    persist(all);
  },
  publish(slug: string) {
    const all = loadAll();
    const l = all.find(x=> x.slug===slug);
    if (l) { l.published_at = new Date().toISOString(); persist(all); }
  },
  unpublish(slug: string) {
    const all = loadAll();
    const l = all.find(x=> x.slug===slug);
    if (l) { l.published_at = ''; persist(all); }
  }
};
