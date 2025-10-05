// Suppliers store (localStorage-backed)
// Mirrors patterns used in distributorsStore/donorStore

export type SupplierType = 'coop/atelier' | 'fabricant' | 'commerçant';
export type SupplierStatus = 'actif' | 'inactif' | 'en_revue';
export type SupplyMode = 'production' | 'achat' | 'hybride';

export interface SupplierUser {
  id: string;
  name: string;
  email: string;
  role: 'qa_upload' | 'lots_manage' | 'shipment_updates' | 'transparency_readonly';
  active?: boolean;
  lastAccess?: string; // ISO
}

export interface Supplier {
  id: string;
  name: string; // org name
  type: SupplierType;
  country: string; // ISO2
  address?: string;
  status: SupplierStatus;
  mode: SupplyMode; // production/achat/hybride
  // Contact
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  // Production fields
  workers?: number; // emploi (trav.)
  womenPct?: number; // % femmes
  capacityPerMonth?: number; // kits/mois
  leadTimeDays?: number; // jours
  productionNotes?: string;
  purchaseNotes?: string;
  description?: string; // free text supplies description
  notes?: string; // internal
  tags?: string[];
  certifications?: string[]; // chips
  // Contract
  contractFileName?: string;
  contractFileSize?: number;
  contractFileType?: string;
  contractFileDataUrl?: string; // demo only
  // Portal roles and users
  roles?: {
    qa_upload?: boolean;
    lots_manage?: boolean;
    shipment_updates?: boolean;
    transparency_readonly?: boolean;
  };
  users?: SupplierUser[];
  associatedProjects?: string[];
  // KPIs
  lotsCumulative?: number;
  qaAvgPct?: number;
  lastActivityAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const KEY = 'e4d:suppliers';

function readAll(): Supplier[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return JSON.parse(raw) as Supplier[];
  } catch {
    return seed();
  }
}

function writeAll(list: Supplier[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

function seed(): Supplier[] {
  const demo: Supplier[] = [
    {
      id: 'sup-femco',
      name: 'FemCo Atelier',
      type: 'coop/atelier',
      country: 'BI',
      address: 'Gitega, Zone Kanyosha',
      status: 'actif',
      mode: 'production',
      contactName: 'Mme T.',
      contactEmail: 'contact@femco.bi',
      contactPhone: '+257 62 20 21',
      workers: 32,
      womenPct: 78,
      capacityPerMonth: 1200,
      leadTimeDays: 14,
      description: 'Kits menstruels réutilisables; inserts; emballages; options de personnalisation.',
      notes: 'Coop locale; 4 postes de couture; 1 QA; 1 logistique; bonne réputation.',
      tags: ['fournisseur','coop','local'],
      certifications: ['ISO 9001','Coop agréée','Audit social 2024'],
      roles: { qa_upload:true, lots_manage:true, shipment_updates:true, transparency_readonly:true },
      users: [
        { id:'u1', name:'user1', email:'user1@femco.bi', role:'qa_upload', active:true },
        { id:'u2', name:'user2', email:'user2@femco.bi', role:'lots_manage', active:true }
      ],
      associatedProjects: ['D-2025-0926-001','D-2025-1010-004'],
      lotsCumulative: 3940,
      qaAvgPct: 97.3,
      lastActivityAt: '2025-09-22',
      createdAt: '2025-03-15',
      updatedAt: '2025-09-22'
    },
    {
      id: 'sup-sacode',
      name: 'SacoDé Fabricant',
      type: 'fabricant',
      country: 'BI',
      status: 'actif',
      mode: 'production',
      workers: 54,
      lotsCumulative: 2610,
      qaAvgPct: 96.1,
      lastActivityAt: '2025-09-18'
    },
    {
      id: 'sup-klimarket',
      name: 'KliMarket SARL',
      type: 'commerçant',
      country: 'RW',
      status: 'actif',
      mode: 'achat'
    },
    {
      id: 'sup-hopetex',
      name: 'HopeTex Global Manufacturing Ltd.',
      type: 'fabricant',
      country: 'TZ',
      status: 'actif',
      mode: 'hybride',
      workers: 40
    },
    {
      id: 'sup-local-gitega',
      name: 'Local Shop Gitega — Marché central',
      type: 'commerçant',
      country: 'BI',
      status: 'inactif',
      mode: 'achat'
    }
  ];
  writeAll(demo);
  return demo;
}

export const suppliersStore = {
  list(): Supplier[] { return readAll(); },
  get(id: string): Supplier | undefined { return readAll().find(s => s.id===id); },
  upsert(s: Supplier) {
    const list = readAll();
    const idx = list.findIndex(x=> x.id===s.id);
    const now = new Date().toISOString();
    if(idx>=0) list[idx] = { ...list[idx], ...s, updatedAt: now };
    else list.unshift({ ...s, createdAt: now, updatedAt: now });
    writeAll(list);
  },
  remove(id: string){ writeAll(readAll().filter(s=> s.id!==id)); },
  addUser(supplierId: string, user: SupplierUser){
    const list = readAll();
    const idx = list.findIndex(s=> s.id===supplierId);
    if(idx<0) return;
    const now = new Date().toISOString();
    const u = { ...user, id: user.id || `u-${Math.random().toString(36).slice(2,8)}` };
    list[idx].users = [...(list[idx].users||[]), u];
    list[idx].updatedAt = now;
    writeAll(list);
  },
  updateUser(supplierId: string, userId: string, patch: Partial<SupplierUser>){
    const list = readAll();
    const idx = list.findIndex(s=> s.id===supplierId);
    if(idx<0) return;
    list[idx].users = (list[idx].users||[]).map(u=> u.id===userId? {...u, ...patch}: u);
    list[idx].updatedAt = new Date().toISOString();
    writeAll(list);
  }
};

export function suppliersToCsv(rows: any[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g,'""') + '"';
    return s;
  };
  return [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n');
}
