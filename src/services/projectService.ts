import { listProjects, ProjectRow } from '../mock/db';

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
