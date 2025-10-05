// Distributors store (localStorage-backed) for admin demo
// Mirrors patterns used in donorStore/resourcesStore

export type DistributorType = 'ecole' | 'association' | 'ONG' | 'institution';
export type DistributorStatus = 'actif' | 'inactif' | 'en_revue';

export interface DistributorUser {
  id: string;
  name: string;
  email: string;
  role: 'benef_entry' | 'supply_updates' | 'upload_reports' | 'transparency_readonly';
  lastAccess?: string; // ISO
  active?: boolean;
}

export interface Distributor {
  id: string; // slug/uuid
  name: string;
  type: DistributorType;
  country: string;
  address?: string;
  status: DistributorStatus;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  tags?: string[];
  notes?: string;
  agreementFileName?: string; // mock
  agreementFileSize?: number;
  agreementFileType?: string;
  agreementFileDataUrl?: string; // base64 data URL for download/view (demo only)
  createdAt?: string;
  updatedAt?: string;
  // KPIs
  activeProjects?: number;
  volumeDelivered?: number; // kits total
  satisfaction?: number; // /5
  lastReportAt?: string;
  users?: DistributorUser[];
  associatedProjects?: string[];
}

const KEY = 'e4d:distributors';

function readAll(): Distributor[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const arr = JSON.parse(raw) as Distributor[];
    return arr;
  } catch {
    return seed();
  }
}

function writeAll(list: Distributor[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

function seed(): Distributor[] {
  const demo: Distributor[] = [
    {
      id: 'dist-eadn',
      name: 'Ecole Kanyosha',
      type: 'ecole',
      country: 'BI',
      address: 'Kanyosha, Gitega',
      status: 'actif',
      contactName: 'Mme U.',
      contactEmail: 'contact.kanyosha@example.org',
      contactPhone: '+257 62 33 11',
      tags: ['école','pilote'],
      notes: 'Distributeur recommandé par l’inspection locale.',
      createdAt: '2025-03-01',
      updatedAt: '2025-09-02',
      activeProjects: 2,
      volumeDelivered: 2480,
      satisfaction: 4.6,
      lastReportAt: '2025-09-18',
      users: [
        { id: 'u1', name: 'Mme U.', email: 'operateur.kanyosha@example.org', role: 'benef_entry', lastAccess: '2025-09-31T16:11:00Z', active: true },
        { id: 'u2', name: 'Mme S.', email: 'log.kanyosha@example.org', role: 'supply_updates', lastAccess: '2025-09-29T09:40:00Z', active: true }
      ],
      associatedProjects: ['D-2025-0926-001','D-2025-1010-004']
    },
    {
      id: 'dist-sacode',
      name: 'SacoDé Coop',
      type: 'association',
      country: 'BI',
      status: 'actif',
      contactName: 'M. N.',
      contactEmail: 'sacode@example.org',
      contactPhone: '+257 68 20 90',
      activeProjects: 3,
      volumeDelivered: 12480,
      satisfaction: 4.2,
      lastReportAt: '2025-06-22'
    },
    {
      id: 'dist-amahoro-ngo',
      name: 'Amahoro NGO',
      type: 'ONG',
      country: 'BI',
      status: 'actif',
      contactName: 'Mme R.',
      contactEmail: 'amahoro@example.org',
      contactPhone: '+257 67 10 12',
      activeProjects: 1,
      volumeDelivered: 640,
      satisfaction: 4.9,
      lastReportAt: '2025-01-14'
    }
  ];
  writeAll(demo);
  return demo;
}

export const distributorsStore = {
  list(): Distributor[] { return readAll(); },
  get(id: string): Distributor | undefined { return readAll().find(d => d.id === id); },
  upsert(dist: Distributor) {
    const list = readAll();
    const idx = list.findIndex(d => d.id === dist.id);
    const now = new Date().toISOString();
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...dist, updatedAt: now };
    } else {
      list.unshift({ ...dist, createdAt: now, updatedAt: now });
    }
    writeAll(list);
  },
  remove(id: string) { writeAll(readAll().filter(d => d.id !== id)); },
  addUser(distributorId: string, user: DistributorUser) {
    const list = readAll();
    const idx = list.findIndex(d => d.id === distributorId);
    if (idx < 0) return;
    const now = new Date().toISOString();
    const u = { ...user, id: user.id || `u-${Math.random().toString(36).slice(2,8)}` };
    list[idx].users = [...(list[idx].users || []), u];
    list[idx].updatedAt = now;
    writeAll(list);
  },
  updateUser(distributorId: string, userId: string, patch: Partial<DistributorUser>) {
    const list = readAll();
    const idx = list.findIndex(d => d.id === distributorId);
    if (idx < 0) return;
    list[idx].users = (list[idx].users || []).map(u => u.id === userId ? { ...u, ...patch } : u);
    list[idx].updatedAt = new Date().toISOString();
    writeAll(list);
  }
};

export function toCsv(rows: any[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  return [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n');
}
