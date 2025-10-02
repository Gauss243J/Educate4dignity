import { useEffect, useState, useCallback } from 'react';
import { fetchProjectPlan, changeActivityStatus, changeMilestoneStatus, createActivity, createMilestone, NewActivityInput, NewMilestoneInput, updateActivity } from '../services/projectService';

export interface UseProjectPlanState {
  activities: ReturnType<typeof fetchProjectPlan>['activities'];
  milestones: ReturnType<typeof fetchProjectPlan>['milestones'];
  phases: ReturnType<typeof fetchProjectPlan>['phases'];
  reload: () => void;
  setActivityStatus: (id: string, status: 'todo' | 'in_progress' | 'done' | 'blocked') => void;
  setMilestoneStatus: (id: string, status: 'not_started' | 'on_track' | 'at_risk' | 'completed', progress?: number) => void;
  addActivity: (data: Omit<NewActivityInput,'projectId'>) => void;
  addMilestone: (data: Omit<NewMilestoneInput,'projectId'>) => void;
  editActivity: (id:string, data:any)=> void;
}

export function useProjectPlan(projectId: string): UseProjectPlanState {
  const [activities, setActivities] = useState<UseProjectPlanState['activities']>([]);
  const [milestones, setMilestones] = useState<UseProjectPlanState['milestones']>([]);
  const [phases, setPhases] = useState<UseProjectPlanState['phases']>([]);

  const load = useCallback(() => {
    if (!projectId) return;
    const data = fetchProjectPlan(projectId);
    setActivities(data.activities);
    setMilestones(data.milestones);
    setPhases(data.phases);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const setActivityStatus = useCallback((id: string, status: 'todo' | 'in_progress' | 'done' | 'blocked') => {
    changeActivityStatus(id, status);
    load();
  }, [load]);

  const setMilestoneStatus = useCallback((id: string, status: 'not_started' | 'on_track' | 'at_risk' | 'completed', progress?: number) => {
    changeMilestoneStatus(id, status, progress);
    load();
  }, [load]);

  const addActivity = useCallback((data: Omit<NewActivityInput,'projectId'>) => {
    createActivity({ ...data, projectId });
    load();
  }, [projectId, load]);

  const addMilestone = useCallback((data: Omit<NewMilestoneInput,'projectId'>) => {
    createMilestone({ ...data, projectId });
    load();
  }, [projectId, load]);

  const editActivity = useCallback((id:string,data:any)=>{ updateActivity(id,data); load(); },[load]);

  return { activities, milestones, phases, reload: load, setActivityStatus, setMilestoneStatus, addActivity, addMilestone, editActivity };
}
