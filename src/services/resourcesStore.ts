import { ResourceItem as PublicResource } from '../types/resources';

export type ResourceStatus = 'draft'|'published'|'retired';
export type ResourceVisibility = 'public'|'internal';

export interface ResourceRecord {
  id: string;             // stable id
  slug: string;           // public slug
  title: string;
  summary: string;
  category: 'report'|'audit'|'policy'|'template'|'data'|'guide';
  year: number;
  language: 'EN'|'FR'|'EN/FR';
  file_type: 'PDF'|'DOCX'|'CSV'|'ZIP';
  file_size_bytes?: number;
  url?: string;           // download or external link
  tags?: string[];
  checksum_sha256?: string;
  status: ResourceStatus;        // draft|published|retired
  visibility: ResourceVisibility; // public|internal
  published_at?: string; // ISO when first published
  updated_at: string;    // ISO
  views_30d?: number;    // analytics placeholder
  downloads_30d?: number;// analytics placeholder
}

export interface ResourceIndexRow extends Omit<PublicResource,'views'> {
  status: ResourceStatus;
  visibility: ResourceVisibility;
  updated_at?: string;
}

const LS_KEY = 'e4d_resources_v1';

function loadAll(): ResourceRecord[] {
  try { const raw = localStorage.getItem(LS_KEY); if(!raw) return []; const arr = JSON.parse(raw); return Array.isArray(arr)? arr: []; } catch { return []; }
}
function persist(all: ResourceRecord[]) { localStorage.setItem(LS_KEY, JSON.stringify(all)); }

export const resourcesStore = {
  list(): ResourceIndexRow[] {
    return loadAll().map(r => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      category: r.category,
      year: r.year,
      language: r.language,
      file_type: r.file_type,
      file_size_bytes: r.file_size_bytes,
      published_at: r.published_at || '',
      tags: r.tags,
      status: r.status,
      visibility: r.visibility,
      views: r.views_30d,
      updated_at: r.updated_at,
    })).sort((a,b)=> (b.published_at||'').localeCompare(a.published_at||''));
  },
  get(id: string){ return loadAll().find(r=> r.id===id); },
  upsert(rec: ResourceRecord){ const all = loadAll(); const i = all.findIndex(r=> r.id===rec.id); if(i>=0) all[i]=rec; else all.push(rec); persist(all); },
  delete(id: string){ const all = loadAll().filter(r=> r.id!==id); persist(all); },
  publish(id: string){ const all = loadAll(); const r = all.find(x=> x.id===id); if(r){ r.status='published'; if(!r.published_at) r.published_at=new Date().toISOString(); r.updated_at=new Date().toISOString(); persist(all);} },
  unpublish(id: string){ const all = loadAll(); const r = all.find(x=> x.id===id); if(r){ r.status='draft'; r.updated_at=new Date().toISOString(); persist(all);} },
  retire(id: string){ const all = loadAll(); const r = all.find(x=> x.id===id); if(r){ r.status='retired'; r.updated_at=new Date().toISOString(); persist(all);} },
};
