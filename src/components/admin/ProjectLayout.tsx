import React from 'react';
import { NavLink, Outlet, useParams, Link } from 'react-router-dom';
import { fetchProjectById } from '../../services/projectService';
import { listProjectActivities } from '../../mock/db';
import AdminPage from './AdminPage';
import { useTranslation } from 'react-i18next';

const tabKeys = ['resume','plan','production','distribution','formation','transparency','depenses','rapports','beneficiaires'] as const;

export const ProjectLayout: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const project = id ? fetchProjectById(id) : undefined;
  if(!project) return <AdminPage title={t('admin.ui.projects.detail_not_found') || 'Projet introuvable'}><div className="p-6 text-sm">Projet introuvable.</div></AdminPage>;

  const labels: Record<string,string> = {
    resume: t('admin.ui.projects.create.detail_tabs_resume'),
    plan: t('admin.ui.projects.create.detail_tabs_plan'),
    production: t('admin.ui.projects.create.detail_tabs_production'),
    distribution: t('admin.ui.projects.create.detail_tabs_distribution'),
    formation: t('admin.ui.projects.create.detail_tabs_formation'),
    transparency: t('admin.ui.projects.create.detail_tabs_transparency'),
    depenses: t('admin.ui.projects.create.detail_tabs_depenses'),
    rapports: t('admin.ui.projects.create.detail_tabs_rapports'),
    beneficiaires: t('admin.ui.projects.create.detail_tabs_beneficiaires'),
  } as any;

  // Aggregate budgets: project total (planned), sum of activities (planned), spent (project.spent placeholder for now)
  // When we have per-activity spent, can aggregate similarly.
  const activitiesPlanned = listProjectActivities(project.id).reduce((s:number,a:any)=> s + (a.plannedBudget||0),0);
  const projectPlanned = project.budget || 0;
  const spent = project.spent || 0; // fallback
  const overPlanned = activitiesPlanned > projectPlanned;
  const spentOver = spent > projectPlanned;

  return (
    <AdminPage title={`${project.name} (${project.id})`}>
      <div className="mb-4 flex items-center gap-3 text-xs">
        <Link to="/admin/projects" className="text-indigo-600 hover:underline">← {t('admin.ui.back','Retour')}</Link>
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-2 w-full">
        <div className="flex flex-wrap gap-1 flex-1 min-w-[260px]">
          {tabKeys.map(tab => (
            <NavLink key={tab} to={tab} className={({isActive})=> `px-3 py-1.5 rounded-full text-[11px] border transition ${isActive? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]':'bg-white border border-[var(--color-border)] hover:bg-[var(--color-primary-light)]'}`}>{labels[tab]}</NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium bg-white rounded-full border px-3 py-1.5 shadow-sm whitespace-nowrap">
          <BudgetPill label="Projet" value={projectPlanned} />
          <span className="text-slate-400">·</span>
          <BudgetPill label="Activités" value={activitiesPlanned} warn={overPlanned} />
          <span className="text-slate-400">·</span>
          <BudgetPill label="Dépensé" value={spent} warn={spentOver} tone="amber" danger={spentOver} />
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </AdminPage>
  );
};

interface BudgetPillProps { label:string; value:number; warn?:boolean; tone?:'rose'|'amber'; danger?:boolean; }
const toneMap: Record<string,string> = {
  rose: 'bg-rose-50 border-rose-200 text-rose-700',
  amber: 'bg-amber-50 border-amber-200 text-amber-700'
};
const BudgetPill: React.FC<BudgetPillProps> = ({label,value,warn,tone='rose',danger}) => {
  const baseTone = toneMap[tone] || toneMap.rose;
  const colorBase = danger? 'bg-red-600 text-white border-red-600' : warn? 'bg-amber-500 text-white border-amber-500' : baseTone;
  return (
    <span className={`px-2 py-1 rounded-full border text-[10px] flex items-center gap-1 ${colorBase}`} title={`${label}: ${value.toLocaleString()} USD`}>{label}: <strong className="font-semibold">{Intl.NumberFormat('fr-FR').format(value)}</strong></span>
  );
};

export default ProjectLayout;
