// Base de données mock centralisée pour tout le frontend
// Étendre ici (projects, donors, users, etc.) afin de simuler un backend unique.

import type { DashboardData } from '../services/dashboardService';

export interface ProjectRow {
  id: string; // short code
  name: string;
  type: 'distribution' | 'production' | 'formation' | 'achat';
  organisation: string;
  location: string; // Country • City or region
  start: string; // ISO date
  status: 'actif' | 'en pause' | 'clos' | 'draft';
  budget: number; // planned budget
  collected: number; // collected amount
  spent: number; // spent amount
}

export interface MockDB {
  dashboard: DashboardData;
  projects: ProjectRow[];
}

export const db: MockDB = {
  dashboard: {
    kpis: {
      projects_active: 28,
      collected_month: 42300,
      collected_total: 284900,
      spent_month: 28900,
      spent_total: 196400,
      beneficiaries_month: 1420,
      beneficiaries_total: 12960,
      distribution_bar: [35, 15, 50],
    },
    charts: {
      // Codes mois (jan..dec) pour traduction via i18n
      months: ['jan','feb','mar','apr','may','jun'],
      bar: {
        collecte: [22, 26, 24, 28, 30, 32],
        planifié: [24, 28, 27, 30, 32, 34],
        dépensé: [18, 22, 21, 25, 26, 28],
      },
      milestones_percent: [20, 35, 50, 65, 78, 86],
      pie_spending: [
        { label: 'Production', value: 45 },
        { label: 'Distribution', value: 32 },
        { label: 'Formation', value: 18 },
        { label: 'Admin', value: 5 },
      ],
    },
    recent: [
      { date: '2025-09-24', type: 'don', ref: 'P#R45S-DON-8932', statut: 'réussi', montant: 1200, action: 'voir' },
      { date: '2025-09-23', type: 'rapport', ref: 'D123-final', statut: 'soumis', montant: null, action: 'valider' },
      { date: '2025-09-22', type: 'don', ref: 'P#G22-DON-1121', statut: 'réussi', montant: 600, action: 'voir' },
      { date: '2025-09-22', type: 'don', ref: 'P#G22-DON-1120', statut: 'réussi', montant: 200, action: 'voir' },
      { date: '2025-09-21', type: 'projet', ref: 'RS6', statut: 'draft', montant: null, action: 'éditer' },
      { date: '2025-09-20', type: 'rapport', ref: 'RS6-m1', statut: 'validé', montant: null, action: 'voir' },
      { date: '2025-09-19', type: 'don', ref: 'P#B17-DON-7001', statut: 'remboursé', montant: -200, action: 'voir' },
      { date: '2025-09-19', type: 'rapport', ref: 'G33-m2', statut: 'rejeté', montant: null, action: 'voir' },
      { date: '2025-09-18', type: 'projet', ref: 'G33', statut: 'actif', montant: null, action: 'voir' },
    ],
  },
  projects: [
    { id:'D123', name:'Gitega School Kits', type:'distribution', organisation:'SaCoDó', location:'Burundi • Gitega', start:'2025-01-20', status:'actif', budget:120000, collected:92000, spent:61000 },
    { id:'R56', name:'Kigali Coop Scale-up', type:'production', organisation:'Umoja Coop', location:'Rwanda • Kigali', start:'2025-02-02', status:'en pause', budget:180000, collected:140000, spent:90000 },
    { id:'G33', name:'MHM + Wash Edu', type:'formation', organisation:'CRES', location:'DRC • Goma', start:'2025-03-22', status:'actif', budget:95000, collected:64000, spent:36000 },
    { id:'B17', name:'Last-mile Distribution', type:'distribution', organisation:'PHC', location:'Burundi • Rural', start:'2025-04-02', status:'clos', budget:98000, collected:96000, spent:96000 },
    { id:'Z09', name:'Boarding Kits', type:'distribution', organisation:'Mof Relapur', location:'India • Raipur', start:'2025-03-01', status:'actif', budget:160000, collected:118000, spent:68000 },
    { id:'Q21', name:'Supplier Onboarding', type:'achat', organisation:'Central Proc', location:'Sénégal • Dakar', start:'2025-01-14', status:'actif', budget:60000, collected:26000, spent:12000 },
    { id:'E21', name:'Teacher Training', type:'formation', organisation:'School Board', location:'Tanzania • Mwanza', start:'2025-05-02', status:'actif', budget:60000, collected:18000, spent:6000 },
    { id:'Q77', name:'Pad Production Lots', type:'production', organisation:'Umoja Coop', location:'Rwanda • Kigali', start:'2025-01-22', status:'actif', budget:82000, collected:51000, spent:22000 },
    { id:'M12', name:'WASH Sessions', type:'formation', organisation:'CRES', location:'DRC • Goma', start:'2025-02-02', status:'en pause', budget:70000, collected:19000, spent:8000 },
    { id:'A05', name:'Emergency Refill', type:'achat', organisation:'Central Proc', location:'Burundi • Gitega', start:'2025-06-02', status:'actif', budget:30000, collected:22000, spent:9000 },
  ]
};

// Utilitaires évolutifs
export function cloneDashboard(): DashboardData {
  return JSON.parse(JSON.stringify(db.dashboard));
}

export function listProjects(): ProjectRow[] { return JSON.parse(JSON.stringify(db.projects)); }
