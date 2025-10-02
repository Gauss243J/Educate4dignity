import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectPlan } from '../../hooks/useProjectPlan';
import { PlanKanbanBoard } from '../../components/admin/plan/PlanKanbanBoard';
import { PlanGanttMini } from '../../components/admin/plan/PlanGanttMini';
import { fetchProjectById } from '../../services/projectService';
import { NewActivityModal } from '../../components/admin/plan/NewActivityModal';
import { NewMilestoneModal } from '../../components/admin/plan/NewMilestoneModal';
import { ActivityDetailModal } from '../../components/admin/plan/ActivityDetailModal';

const ProjectPlanMilestonesPage: React.FC = () => {
  const { id } = useParams();
  const project = id ? fetchProjectById(id) : undefined;
  const { activities, phases, setActivityStatus, addActivity, addMilestone, editActivity } = useProjectPlan(id || '');
  const [view, setView] = useState<'kanban'|'timeline'>('kanban');
  const [showNew,setShowNew] = useState(false);
  const [showNewMilestone,setShowNewMilestone] = useState(false);
  const [presetActivity,setPresetActivity] = useState<string|undefined>();
  const [dirty,setDirty] = useState(false);
  const [savedFlag,setSavedFlag] = useState(false);
  const [detailOpen,setDetailOpen] = useState(false);
  const [selectedId,setSelectedId] = useState<string|undefined>();

  function onStatusChange(activityId: string, status: any){
    setActivityStatus(activityId,status);
    setDirty(true);
  }
  function onCreateActivity(data: any){
    addActivity(data);
    setDirty(true);
  }
  function saveChanges(){
    // Mock save (activities already in memory). Just reset dirty and flash confirmation.
    setSavedFlag(true);
    setTimeout(()=> setSavedFlag(false), 2000);
    setDirty(false);
  }

  function onAddMilestone(activityId?:string){
    setPresetActivity(activityId);
    setShowNewMilestone(true);
  }
  function onCreateMilestone(data:any){
    addMilestone(data);
    setDirty(true);
  }

  function openDetails(id:string){ setSelectedId(id); setDetailOpen(true); }
  function editDetails(id:string){ setSelectedId(id); setDetailOpen(true); }
  function saveDetails(id:string,data:any){ editActivity(id,data); setDirty(true); }

  if(!project) return <div className="p-4 text-sm">Projet introuvable.</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-4 bg-white flex flex-wrap items-center gap-3 text-xs" style={{boxShadow:'var(--elev-1)'}}>
        <div className="text-sm font-semibold mr-4">Plan & Milestones</div>
        <div className="flex gap-2">
          <button onClick={()=>setView('kanban')} className={`px-3 py-1 rounded border text-xs ${view==='kanban'?'bg-indigo-600 text-white border-indigo-600':'bg-white'}`}>Kanban</button>
          <button onClick={()=>setView('timeline')} className={`px-3 py-1 rounded border text-xs ${view==='timeline'?'bg-indigo-600 text-white border-indigo-600':'bg-white'}`}>Gantt</button>
        </div>
        <div className="ml-auto flex gap-2 items-center">
          {dirty && <button onClick={saveChanges} className="px-3 py-1 rounded-md bg-green-600 text-white text-xs hover:bg-green-500" title="Sauvegarder les modifications du plan">Enregistrer modifications</button>}
          {savedFlag && !dirty && <span className="text-[10px] text-green-600">Modifications enregistrées</span>}
          <button className="px-3 py-1 rounded-md border bg-white text-xs hover:bg-indigo-50" onClick={()=>setShowNew(true)}>+ Activité</button>
        </div>
      </div>
      <div className="space-y-6">
    {view==='kanban' && <PlanKanbanBoard activities={activities} onStatusChange={onStatusChange} onAddMilestone={onAddMilestone} onOpenActivity={openDetails} onEditActivity={editDetails} />}
        {view==='timeline' && <PlanGanttMini phases={phases} />}
      </div>
  <NewActivityModal open={showNew} onClose={()=>setShowNew(false)} onCreate={(data)=> onCreateActivity(data)} projectType={project.type} operators={project.operators||[]} projectBudget={project.budget} existingActivitiesTotal={activities.reduce((s,a)=> s + (a.plannedBudget||0),0)} />
  <NewMilestoneModal open={showNewMilestone} onClose={()=>setShowNewMilestone(false)} onCreate={(data)=> onCreateMilestone(data)} activities={activities} presetActivityId={presetActivity} />
  <ActivityDetailModal open={detailOpen} onClose={()=>setDetailOpen(false)} activity={activities.find(a=>a.id===selectedId)||null} onSave={saveDetails} milestones={[]} />
      <div className="text-[10px] text-gray-500 pt-4 border-t">Règles: Production & Distribution obligatoires (projet distribution). Achat optionnel. Chaque dépense doit référencer une Activité + (Milestone) + Catégorie.</div>
    </div>
  );
};

export default ProjectPlanMilestonesPage;
