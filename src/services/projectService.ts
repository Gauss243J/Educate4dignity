import { listProjects, addProject, ProjectRow, listProjectActivities, listProjectMilestones, listProjectPhases, updateActivityStatus, updateMilestoneStatus, addProjectActivity, addProjectMilestone, getProjectById, updateProject, patchActivity } from '../mock/db';

export interface ProjectKpis {
  total: number;
  active: number;
  paused: number;
  closed: number;
  plannedBudget: number;
  collected: number;
  spent: number;
}

export function fetchProjects(): { rows: ProjectRow[]; kpis: ProjectKpis } {
  const rows = listProjects();
  const kpis: ProjectKpis = rows.reduce((acc, p) => {
    acc.total += 1;
    if (p.status === 'actif') acc.active += 1;
    if (p.status === 'en pause') acc.paused += 1;
    if (p.status === 'clos') acc.closed += 1;
    acc.plannedBudget += p.budget;
    acc.collected += p.collected;
    acc.spent += p.spent;
    return acc;
  }, { total:0, active:0, paused:0, closed:0, plannedBudget:0, collected:0, spent:0 });
  return { rows, kpis };
}

export type { ProjectRow };

// Simple ID generator (prefix letter + random 2 digits + sequence)
function generateProjectId(name: string): string {
  const base = name.replace(/[^A-Za-z]/g,'').slice(0,1).toUpperCase() || 'P';
  const rnd = Math.floor(Math.random()*90+10); // 10-99
  return `${base}${rnd}`;
}

export interface NewProjectInput {
  name: string;
  type: ProjectRow['type'];
  organisation: string;
  orgType?: ProjectRow['orgType'];
  location: string;
  start: string; // ISO
  status: ProjectRow['status'];
  budget: number;
  shortDescription?: string;
  longDescription?: string;
  coverImage?: string;
  videoUrl?: string;
  collected?: number;
  operators?: string[];
  primaryOperator?: string;
}

export function createProject(input: NewProjectInput): ProjectRow {
  const id = generateProjectId(input.name);
  const row: ProjectRow = {
    id,
    name: input.name,
    type: input.type,
  organisation: input.organisation,
  orgType: input.orgType,
    location: input.location,
    start: input.start,
    status: input.status,
    budget: input.budget,
    collected: input.collected ?? 0,
    spent: 0,
    shortDescription: input.shortDescription,
  longDescription: input.longDescription,
    coverImage: input.coverImage,
  videoUrl: input.videoUrl,
  operators: input.operators,
  primaryOperator: input.primaryOperator
  };
  addProject(row);
  seedDefaultActivities(row);
  return row;
}

// --- Default Activity Templates per project type ---
const defaultActivityTemplates: Record<ProjectRow['type'], string[]> = {
  blank: [],
  distribution: [
    'Confirmer fournisseurs et quantités',
    'Plan logistique / itinéraires',
    'Préparer entrepôt & stockage',
    'Former équipe de distribution',
    'Lancer première vague',
    'Collecter feedback bénéficiaires'
  ],
  formation: [
    'Finaliser modules curriculum',
    'Planifier calendrier sessions',
    'Former formateurs locaux',
    "Session pilote", 
    'Évaluer retours et ajuster',
    'Déployer sessions complètes'
  ],
  recherche_dev: [
    'Définir hypothèses R&D',
    'Préparer prototypes V1',
    'Tests terrain / collecte données',
    'Analyser résultats',
    'Itération design V2',
    'Validation finale'
  ],
  achat: [
    'Lister besoins & specs',
    'Sourcer fournisseurs',
    'Négocier prix & délais',
    'Émettre bons de commande',
    'Réception & contrôle qualité'
  ],
  hybride: [
    'Atelier cadrage multi-équipe',
    'Valider plan distribution',
    'Former équipe locale',
    'Pilote combiné',
    'Analyse intégrée',
    'Déploiement élargi'
  ]
};

function seedDefaultActivities(project: ProjectRow) {
  const templates = defaultActivityTemplates[project.type];
  if(!templates || !templates.length) return;
  templates.forEach(title => {
  addProjectActivity({ projectId: project.id, title, status:'todo', category: project.type });
  });
}

// === Plan & Milestones service helpers ===
export function fetchProjectById(id: string): ProjectRow | undefined {
  return getProjectById(id);
}

export function fetchProjectPlan(id: string) {
  let activities = listProjectActivities(id);
  // Auto-seed for anciens projets sans activités
  if(activities.length === 0) {
    const p = getProjectById(id);
    if(p) {
      seedDefaultActivities(p);
      activities = listProjectActivities(id);
    }
  }
  return {
    activities,
    milestones: listProjectMilestones(id),
    phases: listProjectPhases(id),
  };
}

export function changeActivityStatus(activityId: string, status: 'todo' | 'in_progress' | 'done' | 'blocked') {
  return updateActivityStatus(activityId, status);
}

export function updateActivity(activityId: string, data: any) {
  return patchActivity(activityId, data);
}

export function changeMilestoneStatus(milestoneId: string, status: 'not_started' | 'on_track' | 'at_risk' | 'completed', progress?: number) {
  return updateMilestoneStatus(milestoneId, status, progress);
}

export function updateProjectStatus(id: string, status: ProjectRow['status']) {
  return updateProject(id, { status });
}

export function patchProject(id: string, data: Partial<ProjectRow>) {
  return updateProject(id, data);
}

export interface NewActivityInput {
  projectId: string;
  title: string;
  description?: string;
  type?: 'achat'|'production'|'distribution'|'formation'|'recherche_dev'|'autre';
  assignee?: string;
  assigneeType?: 'distributeur' | 'producteur' | 'fournisseur' | 'autre';
  priority?: 'low'|'medium'|'high';
  due?: string;
  startDate?: string;
  endDate?: string;
  plannedBudget?: number;
  allocated?: number;
  kpiTargetValue?: number;
  kpiUnit?: string;
  sessionsPlanned?: number;
  participantsExpectedF?: number;
  participantsExpectedM?: number;
  attachments?: { id:string; name:string; size:number; type:string }[];
}
export function createActivity(input: NewActivityInput) {
  return addProjectActivity({
    projectId: input.projectId,
    title: input.title,
    description: input.description,
    type: input.type,
    assignee: input.assignee,
  assigneeType: input.assigneeType,
    status:'todo',
    priority: input.priority,
    due: input.due,
    startDate: input.startDate,
    endDate: input.endDate,
    plannedBudget: input.plannedBudget,
    allocated: input.allocated,
    kpiTargetValue: input.kpiTargetValue,
    kpiUnit: input.kpiUnit,
    sessionsPlanned: input.sessionsPlanned,
    participantsExpectedF: input.participantsExpectedF,
    participantsExpectedM: input.participantsExpectedM,
  attachments: input.attachments,
    category: input.type
  });
}

export interface NewMilestoneInput { projectId: string; label: string; targetDate?: string; activityId?: string; plannedBudget?: number; }
export function createMilestone(input: NewMilestoneInput) {
  return addProjectMilestone({ projectId: input.projectId, label: input.label, targetDate: input.targetDate, activityId: input.activityId, plannedBudget: input.plannedBudget, status:'not_started', progress:0 });
}
