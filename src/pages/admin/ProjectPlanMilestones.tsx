import React from 'react';
import AdminPage from '../../components/admin/AdminPage';
import { useParams } from 'react-router-dom';
import { fetchProjects } from '../../services/projectService';
import { useTranslation } from 'react-i18next';

// Minimal fake data for Kanban + milestones timeline (local only)
interface Activity { id:string; title:string; status:'todo'|'in_progress'|'done'; type:'achat'|'production'|'distribution'|'formation'|'autre'; owner?:string; start?:string; end?:string; progress:number; }

const sampleActivities: Activity[] = [
  { id:'a1', title:'Achat matière', status:'todo', type:'achat', owner:'Chantal N.', start:'2025-01-05', end:'2025-02-15', progress:10 },
  { id:'a2', title:'Production lots #01 à #04', status:'in_progress', type:'production', owner:'Umoja Coop', start:'2025-02-02', end:'2025-05-05', progress:44 },
  { id:'a3', title:'Kickoff projet', status:'done', type:'autre', owner:'Chantal N.', start:'2025-01-02', end:'2025-01-10', progress:100 },
  { id:'a4', title:'Distribution pilotes', status:'in_progress', type:'distribution', owner:'SaCoDé', start:'2025-03-02', end:'2025-04-26', progress:28 },
  { id:'a5', title:'Template distribution', status:'done', type:'distribution', owner:'Admin', start:'2025-01-15', end:'2025-01-25', progress:100 },
  { id:'a6', title:'Plan sessions formation', status:'todo', type:'formation', owner:'Alice M.', start:'2025-03-02', end:'2025-04-05', progress:0 },
];

const ProjectPlanMilestones: React.FC = () => {
  const { id } = useParams();
  const { rows } = fetchProjects();
  const project = rows.find(p=> p.id === id);
  const { t } = useTranslation();

  if(!project){
    return <AdminPage title={t('admin.ui.projects.detail_not_found') || 'Projet introuvable'}>Projet non trouvé</AdminPage>;
  }

  const columns = [
    { key:'todo', label:t('admin.ui.projects.plan.col_todo') },
    { key:'in_progress', label:t('admin.ui.projects.plan.col_in_progress') },
    { key:'done', label:t('admin.ui.projects.plan.col_done') }
  ];

  return (
    <AdminPage title={`${t('admin.ui.projects.plan.title')} — ${project.name} (${project.id})`}>
      <div className="flex flex-wrap gap-2 mb-4">
        <Toggle label={t('admin.ui.projects.plan.view_kanban')} active />
        <Toggle label={t('admin.ui.projects.plan.view_gantt')} />
        <div className="flex-1"></div>
        <button className="btn-small">+ {t('admin.ui.projects.plan.add_milestone')}</button>
        <button className="btn-small">{t('admin.ui.projects.plan.import_budget')}</button>
        <button className="btn-small">+ {t('admin.ui.projects.plan.add_activity')}</button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {columns.map(col=> <KanbanColumn key={col.key} title={col.label} activities={sampleActivities.filter(a=> a.status===col.key)} />)}
      </div>
      <Timeline activities={sampleActivities} />
    </AdminPage>
  );
};

const Toggle:React.FC<{label:string;active?:boolean}> = ({label,active}) => (
  <button className={`px-4 py-1.5 rounded-full text-[11px] border transition ${active? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]':'bg-white border-[var(--color-border)] hover:bg-[var(--color-primary-light)]'}`}>{label}</button>
);

const KanbanColumn:React.FC<{title:string;activities:Activity[]}> = ({title,activities}) => (
  <div className="rounded-xl bg-white p-3 flex flex-col min-h-[320px]" style={{boxShadow:'var(--elev-1)'}}>
    <h3 className="font-semibold mb-2 text-[13px]">{title}</h3>
    <div className="space-y-3 flex-1">
      {activities.map(a=> <KanbanCard key={a.id} a={a} />)}
      {activities.length===0 && <div className="text-[11px] text-[var(--muted-color)]">—</div>}
    </div>
  </div>
);

const KanbanCard:React.FC<{a:Activity}> = ({a}) => {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white p-2 text-[10.5px] space-y-1" style={{boxShadow:'var(--elev-1)'}}>
      <div className="flex justify-between items-start gap-2"><span className="font-medium text-[11.5px] leading-tight">{a.title}</span><TypeBadge type={a.type} /></div>
      <div className="text-[10px]">Dates: {a.start} → {a.end}</div>
      <div className="text-[10px]">Resp.: {a.owner}</div>
      <div className="text-[10px]">Progress: {a.progress}%</div>
      <div className="h-1.5 rounded bg-[var(--color-primary-light)] overflow-hidden"><div className="h-full bg-[var(--color-primary)]" style={{width:`${a.progress}%`}}/></div>
      <div className="flex gap-1 pt-1"><button className="px-2 py-0.5 rounded-md border border-[var(--color-border)] bg-white hover:bg-[var(--color-primary-light)]">Edit</button><button className="px-2 py-0.5 rounded-md border border-[var(--color-border)] bg-white hover:bg-[var(--color-primary-light)]">Milestones</button></div>
    </div>
  );
};

const TypeBadge:React.FC<{type:Activity['type']}> = ({type}) => {
  const map:Record<string,string> = { achat:'Achat', production:'Production', distribution:'Distribution', formation:'Formation', autre:'Autre' };
  return <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[10px]">{map[type]||type}</span>;
};

// Simplified timeline (stacked bars) — placeholder only
const Timeline:React.FC<{activities:Activity[]}> = ({activities}) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl bg-white p-4 mb-10" style={{boxShadow:'var(--elev-1)'}}>
      <h3 className="font-semibold mb-3 text-[13px]">{t('admin.ui.projects.plan.timeline_title')}</h3>
      <div className="space-y-3">
        {activities.slice(0,4).map(a=> <div key={a.id} className="text-[11px]">
          <div className="flex justify-between"><span>{a.title}</span><span>{a.progress}%</span></div>
          <div className="h-2 rounded bg-[var(--color-primary-light)] overflow-hidden"><div className="h-full bg-[var(--color-primary)]" style={{width:`${a.progress}%`}} /></div>
        </div>)}
      </div>
    </div>
  );
};

export default ProjectPlanMilestones;
