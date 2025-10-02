// Service d'accès aux données du dashboard admin
// Abstraction unique: si une API REST existe -> utiliser l'endpoint, sinon fallback mock.
// Permettra de remplacer facilement la source (ex: GraphQL, Supabase, etc.)

export interface DashboardKpis {
  projects_active: number;
  collected_month: number;
  collected_total: number;
  spent_month: number;
  spent_total: number;
  beneficiaries_month: number;
  beneficiaries_total: number;
  distribution_bar: number[]; // [distribution, formation, blank]
}

export interface DashboardCharts {
  months: string[];
  bar: Record<string, number[]>; // {Collecte:number[], Planifié:number[], Dépensé:number[]}
  milestones_percent: number[];
  pie_spending: { label: string; value: number; color?: string }[];
}

export interface DashboardRecentItem {
  date: string;
  type: string;
  ref: string;
  statut: string;
  montant: number | null | undefined;
  action: string;
}

export interface DashboardData {
  kpis: DashboardKpis;
  charts: DashboardCharts;
  recent: DashboardRecentItem[];
}

// URL configurable (variable d'env Vite: VITE_API_URL)
const API_BASE = import.meta.env.VITE_API_URL;
import { cloneDashboard } from '../mock/db';

async function fetchFromApi(signal?: AbortSignal): Promise<DashboardData> {
  if (!API_BASE) throw new Error('API non configurée');
  const res = await fetch(`${API_BASE}/admin/dashboard`, { signal });
  if (!res.ok) throw new Error(`Erreur API ${res.status}`);
  return res.json();
}

// Fallback mock (reprend les données actuelles)
function mockData(): DashboardData { return cloneDashboard(); }

export async function getDashboardData(options?: { signal?: AbortSignal; forceMock?: boolean }): Promise<DashboardData> {
  const { signal, forceMock } = options || {};
  if (forceMock) return mockData();
  try {
    return await fetchFromApi(signal);
  } catch (e) {
    console.warn('[dashboardService] fallback mock après erreur:', e);
    return mockData();
  }
}
