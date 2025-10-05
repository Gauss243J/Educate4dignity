// teamStore: local in-memory/localStorage store for Team module

export type TeamRole = 'manager' | 'operator';
export type TeamStatus = 'invited' | 'active' | 'suspended';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: TeamRole;
  country: string; // e.g., BI, RW, TZ
  projectsCount?: number;
  assignedProjects?: string[]; // project IDs
  lastAccess?: string; // ISO datetime
  status: TeamStatus;
  skills?: string[];
  notes?: string;
  avatarDataUrl?: string; // optional base64 avatar
  documents?: { id:string; name:string; size:number; type:string }[];
}

const STORAGE_KEY = 'e4d.team.v1';

function seed(): TeamMember[] {
  const now = new Date();
  const fmt = (d:Date)=> new Date(d).toISOString().slice(0,16);
  const add = (days:number, hours=0)=> new Date(now.getTime() - (days*24+hours)*3600_000);
  const data: TeamMember[] = [
    { id:'U1', name:'Alice M.', email:'alice@e4d.org', phone:'+257 67 11 22 33', role:'manager', country:'BI', projectsCount:4, lastAccess: fmt(add(0,2)), status:'active', skills:['MHM/WASH','PWA Scanner'] },
    { id:'U2', name:'Chantal N.', email:'chantal@e4d.org', phone:'+257 71 22 66 44', role:'operator', country:'BI', projectsCount:2, lastAccess: fmt(add(1,3)), status:'active', skills:['MHM/WASH'] },
    { id:'U3', name:'Eric D.', email:'eric@e4d.org', phone:'+250 72 44 55 11', role:'operator', country:'RW', projectsCount:5, lastAccess: fmt(add(4,15)), status:'active' },
    { id:'U4', name:'Fatma K.', email:'fatma@e4d.org', phone:'+257 79 33 22 11', role:'manager', country:'BI', projectsCount:1, lastAccess: fmt(add(2,8)), status:'active' },
    { id:'U5', name:'Grace P.', email:'grace@e4d.org', phone:'+255 71 88 66 22', role:'operator', country:'TZ', projectsCount:2, lastAccess: fmt(add(0,21)), status:'active' },
    { id:'U6', name:'Jean M.', email:'jean@e4d.org', phone:'+257 79 55 44 33', role:'manager', country:'BI', projectsCount:3, lastAccess: fmt(add(0,7)), status:'active' },
    { id:'U7', name:'Mireille A.', email:'mireille@e4d.org', phone:'+257 76 88 99 00', role:'operator', country:'BI', projectsCount:1, lastAccess: fmt(add(6,10)), status:'active' },
    { id:'U8', name:'Yusuf R.', email:'yusuf@e4d.org', phone:'+257 78 12 34 56', role:'operator', country:'BI', projectsCount:2, lastAccess: undefined, status:'invited' },
    { id:'U9', name:'Wendy C.', email:'wendy@e4d.org', phone:'+250 73 22 44 55', role:'manager', country:'RW', projectsCount:2, lastAccess: fmt(add(0,12)), status:'active' },
    { id:'U10', name:'Zawadi T.', email:'zawadi@e4d.org', phone:'+255 76 44 55 66', role:'operator', country:'TZ', projectsCount:1, lastAccess: fmt(add(4,9)), status:'active' },
  ];
  return data;
}

function load(): TeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return persist(seed());
    const arr = JSON.parse(raw) as TeamMember[];
    return arr;
  } catch {
    return persist(seed());
  }
}

function persist(arr: TeamMember[]): TeamMember[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  return arr;
}

export const teamStore = {
  list(): TeamMember[] { return load().map(x=>({...x})); },
  get(id: string): TeamMember | undefined { return load().find(x=>x.id===id); },
  add(m: Omit<TeamMember,'id'> & { id?: string }): TeamMember {
    const id = m.id || 'U' + Math.floor(Math.random()*90000+10000);
    const all = load();
    const full: TeamMember = { projectsCount:0, ...m, id, documents: m.documents||[] };
    persist([full, ...all]);
    return full;
  },
  update(id: string, patch: Partial<TeamMember>): TeamMember | undefined {
    const all = load();
    const idx = all.findIndex(x=>x.id===id);
    if (idx===-1) return undefined;
    all[idx] = { ...all[idx], ...patch };
    persist(all);
    return all[idx];
  },
  removeMany(ids: string[]) {
    const set = new Set(ids);
    persist(load().filter(x=> !set.has(x.id)));
  },
  toCsv(rows?: TeamMember[]): string {
    const arr = rows ?? load();
    const headers = ['id','name','email','phone','role','country','status','projectsCount','lastAccess','skills'];
    const esc = (s:any)=> '"'+String(s??'').replace(/"/g,'""')+'"';
    return [headers.join(','), ...arr.map(r=> [r.id,r.name,r.email,r.phone||'',r.role,r.country,r.status,String(r.projectsCount??0),r.lastAccess||'', (r.skills||[]).join('|')].map(esc).join(','))].join('\n');
  },
  importCsv(text: string): { inserted: number } {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length<=1) return { inserted: 0 };
    const headers = lines[0].split(',').map(s=> s.trim().replace(/^"|"$/g,''));
    const idx = (k:string)=> headers.indexOf(k);
    const req = ['id','name','email','role','country'];
    if (req.some(k=> idx(k)===-1)) return { inserted: 0 };
    const arr: TeamMember[] = [];
    for (let i=1;i<lines.length;i++){
      const cols = lines[i].match(/\"([^\"]|\"\")*\"|[^,]+/g)?.map(c=> c.replace(/^"|"$/g,'').replace(/""/g,'"')) || [];
      const r: TeamMember = {
        id: cols[idx('id')],
        name: cols[idx('name')],
        email: cols[idx('email')],
        phone: cols[idx('phone')]||'',
        role: (cols[idx('role')] as TeamRole)||'operator',
        country: cols[idx('country')]||'BI',
        status: (cols[idx('status')] as TeamStatus)||'active',
        projectsCount: Number(cols[idx('projectsCount')]||0),
        lastAccess: cols[idx('lastAccess')]||'',
        skills: (cols[idx('skills')]||'').split('|').filter(Boolean),
        assignedProjects: [],
        documents: [],
      };
      arr.push(r);
    }
    // Upsert by id
    const existing = load();
    const map = new Map(existing.map(x=>[x.id,x] as const));
    for (const r of arr){ map.set(r.id, r); }
    persist(Array.from(map.values()));
    return { inserted: arr.length };
  }
};
