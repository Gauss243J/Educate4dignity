import React, { useState, useMemo } from 'react';
import type { ProjectActivity, ProjectMilestone } from '../../../mock/db';

interface Props {
  activity: ProjectActivity | null;
  open: boolean;
  onClose: () => void;
  onSave: (id:string, data: Partial<ProjectActivity>) => void;
  milestones?: ProjectMilestone[];
}

export const ActivityDetailModal: React.FC<Props> = ({activity, open, onClose, onSave, milestones = []}) => {
  const [editing,setEditing] = useState(false);
  const [local,setLocal] = useState<Partial<ProjectActivity>>({});

  React.useEffect(()=>{ if(activity){ setLocal(activity); setEditing(false);} },[activity]);
  if(!open || !activity) return null;
  const a = activity;
  const update = (k:keyof ProjectActivity, v:any)=> setLocal(l=>({...l,[k]:v}));
  const relatedMilestones = useMemo(()=> milestones.filter(m=> m.activityId === activity?.id),[milestones,activity]);
  const save = ()=>{ onSave(a.id, local); setEditing(false); };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 space-y-5 border" style={{boxShadow:'var(--elev-3)'}}>
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold">Activité — {a.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {!editing && <p className="text-[12px] text-gray-600 whitespace-pre-wrap">{a.description || '—'}</p>}
        {!editing && (
          <div className="flex flex-wrap gap-2 text-[10px]">
            {a.assignee && <span className="px-2 py-1 rounded-full border bg-gray-50 text-gray-700" title="Organisation">{a.assignee}</span>}
            {a.assigneeType && <span className="px-2 py-1 rounded-full border bg-indigo-50 text-indigo-600 capitalize" title="Type entité">{a.assigneeType}</span>}
            {a.type && <span className="px-2 py-1 rounded-full border bg-pink-50 text-pink-600 uppercase tracking-wide" title="Type activité">{a.type}</span>}
            {a.category && <span className="px-2 py-1 rounded-full border bg-purple-50 text-purple-600" title="Catégorie">{a.category}</span>}
            {a.priority && <span className="px-2 py-1 rounded-full border bg-amber-50 text-amber-600" title="Priorité">{a.priority}</span>}
          </div>
        )}
        {editing && (
          <div className="space-y-3 text-[12px]">
            <input className="w-full border rounded px-3 py-2" value={local.title as string||''} onChange={e=>update('title', e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" value={local.description as string||''} onChange={e=>update('description', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><label className="block text-[10px] font-medium">Début</label><input type="date" className="w-full border rounded px-2 py-1" value={local.startDate||''} onChange={e=>update('startDate', e.target.value)} /></div>
              <div className="space-y-1"><label className="block text-[10px] font-medium">Fin</label><input type="date" className="w-full border rounded px-2 py-1" value={local.endDate||''} onChange={e=>update('endDate', e.target.value)} /></div>
            </div>
            <div className="grid md:grid-cols-4 gap-3">
              <div className="space-y-1"><label className="block text-[10px] font-medium">Échéance</label><input type="date" className="w-full border rounded px-2 py-1" value={local.due||''} onChange={e=>update('due', e.target.value)} /></div>
              <div className="space-y-1"><label className="block text-[10px] font-medium">Organisation</label><input className="w-full border rounded px-2 py-1" value={local.assignee||''} onChange={e=>update('assignee', e.target.value)} placeholder="Organisation" /></div>
              <div className="space-y-1"><label className="block text-[10px] font-medium">Type entité</label><select className="w-full border rounded px-2 py-1" value={local.assigneeType||''} onChange={e=>update('assigneeType', e.target.value as any)}><option value="">—</option><option value="distributeur">distributeur</option><option value="producteur">producteur</option><option value="fournisseur">fournisseur</option><option value="formateur">formateur</option><option value="autre">autre</option></select></div>
              <div className="space-y-1"><label className="block text-[10px] font-medium">Priorité</label><select className="w-full border rounded px-2 py-1" value={local.priority||''} onChange={e=>update('priority', e.target.value as any)}><option value="">—</option><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select></div>
            </div>
            <div className="grid md:grid-cols-4 gap-3">
              <div className="space-y-1"><label className="block text-[10px] font-medium">Budget planifié</label><input type="number" className="w-full border rounded px-2 py-1" value={local.plannedBudget||''} onChange={e=>update('plannedBudget', Number(e.target.value)||undefined)} /></div>
              <div className="space-y-1 md:col-span-2"><label className="block text-[10px] font-medium">Type activité</label><select className="w-full border rounded px-2 py-1" value={local.type||''} onChange={e=>update('type', e.target.value as any)}><option value="">—</option><option value="distribution">distribution</option><option value="formation">formation</option><option value="recherche_dev">recherche_dev</option><option value="achat">achat</option><option value="hybride">hybride</option><option value="blank">blank</option></select></div>
              <div className="space-y-1"><label className="block text-[10px] font-medium">Catégorie</label><input className="w-full border rounded px-2 py-1" value={local.category||''} onChange={e=>update('category', e.target.value)} placeholder="catégorie" /></div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="space-y-1"><label className="block text-[10px] font-medium">KPI valeur</label><input type="number" className="w-full border rounded px-2 py-1" value={local.kpiTargetValue||''} onChange={e=>update('kpiTargetValue', Number(e.target.value)||undefined)} /></div>
              <div className="space-y-1"><label className="block text-[10px] font-medium">KPI unité</label><input className="w-full border rounded px-2 py-1" value={local.kpiUnit||''} onChange={e=>update('kpiUnit', e.target.value)} /></div>
              <div className="space-y-1"><label className="block text-[10px] font-medium">Progress (%)</label><input type="number" className="w-full border rounded px-2 py-1" value={local.progress??''} onChange={e=>update('progress', Number(e.target.value)||0)} min={0} max={100} /></div>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-4 text-[11px]">
          <Info label="Statut" value={a.status} />
          <Info label="Progress" value={(a.progress??0)+'%'} />
          <Info label="Dates" value={(a.startDate||'—')+' → '+(a.endDate||'—')} />
          <Info label="Échéance" value={a.due||'—'} />
          <Info label="Budget" value={a.plannedBudget? ('$ '+a.plannedBudget.toLocaleString()):'—'} />
            <Info label="KPI" value={a.kpiTargetValue? a.kpiTargetValue + ' ' + (a.kpiUnit||''): '—'} />
            <Info label="Organisation" value={a.assignee||'—'} />
            <Info label="Type entité" value={a.assigneeType||'—'} />
            <Info label="Catégorie" value={a.category||'—'} />
            <Info label="Type activité" value={a.type||'—'} />
            <Info label="Priorité" value={a.priority||'—'} />
        </div>
        {a.attachments && a.attachments.length>0 && (
          <div className="text-[10px] space-y-2">
            <div className="font-semibold text-[11px]">Pièces jointes ({a.attachments.length})</div>
            <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {a.attachments.map(att => (
                <li key={att.id} className="flex items-center justify-between gap-2 px-2 py-1 rounded border text-[10px] bg-gray-50">
                  <span className="truncate flex-1" title={att.name}>{att.name}</span>
                  <span className="text-gray-400">{Math.round(att.size/1024)}kb</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="text-[10px] space-y-2">
          <div className="font-semibold text-[11px] flex items-center gap-2">Milestones liés <span className="px-1.5 py-0.5 rounded-full bg-gray-100 border text-[9px]">{relatedMilestones.length}</span></div>
          {relatedMilestones.length===0 && <div className="text-gray-400 italic">Aucun milestone associé.</div>}
          {relatedMilestones.length>0 && (
            <ul className="space-y-1">
              {relatedMilestones.map(m=> (
                <li key={m.id} className="flex justify-between items-center px-2 py-1 rounded border bg-white text-[10px]">
                  <span className="truncate" title={m.label}>{m.label}</span>
                  <span className="text-gray-500 flex items-center gap-1">{m.targetDate||'—'} {m.status && <StatusBadge status={m.status} />}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end gap-2 text-[12px] pt-2">
          {!editing && <button onClick={()=>setEditing(true)} className="px-4 py-2 rounded-full border bg-white hover:bg-gray-50">Éditer</button>}
          {editing && <button onClick={save} className="px-4 py-2 rounded-full bg-indigo-600 text-white">Enregistrer</button>}
          {editing && <button onClick={()=>{setEditing(false); setLocal(activity);}} className="px-4 py-2 rounded-full border bg-white">Annuler</button>}
          <button onClick={onClose} className="px-4 py-2 rounded-full border bg-white">Fermer</button>
        </div>
        <p className="text-[10px] text-gray-500">Dernière mise à jour: {new Date(a.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

const Info: React.FC<{label:string; value:React.ReactNode}> = ({label,value}) => (
  <div className="space-y-1"><div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div><div className="text-[11.5px] text-gray-800 break-words">{value}</div></div>
);

const StatusBadge: React.FC<{status:ProjectMilestone['status']}> = ({status}) => {
  const map: Record<ProjectMilestone['status'], string> = {
    not_started:'bg-gray-100 text-gray-600 border-gray-200',
    on_track:'bg-green-100 text-green-700 border-green-200',
    at_risk:'bg-amber-100 text-amber-700 border-amber-200',
    completed:'bg-indigo-100 text-indigo-700 border-indigo-200'
  };
  const labels: Record<ProjectMilestone['status'], string> = {
    not_started:'NS', on_track:'OK', at_risk:'Risque', completed:'Fin'
  };
  return <span className={`px-1.5 py-0.5 rounded-full border text-[9px] font-medium ${map[status]}`}>{labels[status]}</span>;
};

export default ActivityDetailModal;
