import { useCallback, useEffect, useState } from 'react';
import { listProjectActivities, listProjectExpenses, listProjectReports, listBeneficiaries, listProjectMilestones } from '../mock/db';

export interface ProjectKPIs {
  totalBudget: number;
  spent: number;
  executionPct: number; // spent / budget
  adminSharePct: number; // admin expenses / spent
  reportsValid: number;
  reportsPending: number;
  beneficiariesTotal: number;
}

export function useProjectData(projectId: string) {
  const [activities,setActivities] = useState<any[]>([]);
  const [expenses,setExpenses] = useState<any[]>([]);
  const [reports,setReports] = useState<any[]>([]);
  const [beneficiaries,setBeneficiaries] = useState<any[]>([]);
  const [milestones,setMilestones] = useState<any[]>([]);
  const [kpis,setKpis] = useState<ProjectKPIs | null>(null);

  const load = useCallback(()=> {
    if(!projectId) return;
    const acts = listProjectActivities(projectId);
    const exps = listProjectExpenses(projectId);
    const reps = listProjectReports(projectId);
    const bens = listBeneficiaries(projectId);
    const mls = listProjectMilestones(projectId);

    setActivities(acts); setExpenses(exps); setReports(reps); setBeneficiaries(bens); setMilestones(mls);

    // KPIs
    const budget =  acts.length ? acts.length * 5000 + 70000 : 120000; // placeholder logic
    const spent = exps.reduce((s,e)=> s + (e.currency==='USD'? e.amount : (e.amount * (e.fx||0))),0);
    const adminSpent = exps.filter(e=> e.category==='admin').reduce((s,e)=> s + (e.currency==='USD'? e.amount : (e.amount * (e.fx||0))),0);
    const beneficiariesTotal = bens.reduce((s,b)=> s + b.females + b.males,0);
    const reportsValid = reps.filter(r=> r.status==='validé').length;
    const reportsPending = reps.filter(r=> r.status==='soumis').length;

    setKpis({ totalBudget: budget, spent, executionPct: budget? (spent/budget)*100:0, adminSharePct: spent? (adminSpent/spent)*100:0, reportsValid, reportsPending, beneficiariesTotal });
  },[projectId]);

  useEffect(()=> { load(); },[load]);

  return { activities, expenses, reports, beneficiaries, milestones, kpis, reload: load };
}
