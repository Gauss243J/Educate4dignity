import React, { useState } from 'react';
import { NewMilestoneInput } from '../../../services/projectService';
import type { ProjectActivity } from '../../../mock/db';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Omit<NewMilestoneInput,'projectId'>) => void;
  activities: ProjectActivity[];
  presetActivityId?: string;
}

export const NewMilestoneModal: React.FC<Props> = ({open,onClose,onCreate,activities,presetActivityId}) => {
  const [label,setLabel] = useState('');
  const [activityId,setActivityId] = useState(presetActivityId||'');
  const [targetDate,setTargetDate] = useState('');
  const [plannedBudget,setPlannedBudget] = useState<string>('');
  const activity = activities.find(a=>a.id===activityId);
  const numericBudget = plannedBudget ? Number(plannedBudget) : 0;
  const overActivity = activity && activity.plannedBudget && numericBudget > activity.plannedBudget;
  if(!open) return null;
  const submit = ()=>{ if(!label) return; onCreate({ label: label.trim(), targetDate, activityId: activityId||undefined, plannedBudget: numericBudget||undefined }); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-5 border" style={{boxShadow:'var(--elev-3)'}}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Nouveau Milestone</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="space-y-4 text-[12px]">
          <div className="space-y-1">
            <label className="font-medium text-[11px]">Activité (optionnel)</label>
            <select value={activityId} onChange={e=>setActivityId(e.target.value)} className="w-full border rounded px-2 py-2">
              <option value="">—</option>
              {activities.map(a=> <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-medium text-[11px]">Titre *</label>
            <input value={label} onChange={e=>setLabel(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="ex: P-01 — 2 000 kits produits" />
          </div>
          <div className="space-y-1">
            <label className="font-medium text-[11px]">Échéance</label>
            <input type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="space-y-1">
            <label className="font-medium text-[11px]">Budget jalon (option)</label>
            <input type="number" value={plannedBudget} onChange={e=>setPlannedBudget(e.target.value)} className={`w-full border rounded px-3 py-2 ${overActivity?'border-red-500':''}`} placeholder={activity?.plannedBudget?`<= ${activity.plannedBudget}`:'ex: 5000'} />
            {overActivity && <p className="text-[10px] text-red-600">Dépasse le budget activité.</p>}
          </div>
        </div>
        <div className="flex justify-end gap-2 text-[12px]">
          <button onClick={onClose} className="px-4 py-2 rounded-full border bg-white">Annuler</button>
          <button onClick={submit} disabled={(!label) || !!overActivity} className="px-4 py-2 rounded-full bg-indigo-600 text-white disabled:opacity-50">Créer</button>
        </div>
        <p className="text-[10px] text-gray-500">Milestone générique utilisable pour tout type de projet.</p>
      </div>
    </div>
  );
};

export default NewMilestoneModal;
