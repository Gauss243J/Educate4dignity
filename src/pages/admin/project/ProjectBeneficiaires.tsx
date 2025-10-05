import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectData } from '../../../hooks/useProjectData';
import { listBeneficiaries } from '../../../mock/db';
import { FileDown } from 'lucide-react';

const ProjectBeneficiaires: React.FC = () => {
  const { id } = useParams();
  const { beneficiaries } = useProjectData(id||'');
  const totalF = beneficiaries.reduce((s,b)=> s+b.females,0);
  const totalM = beneficiaries.reduce((s,b)=> s+b.males,0);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Femmes" value={totalF} />
        <Stat label="Hommes" value={totalM} />
        <Stat label="Total" value={totalF+totalM} />
        <Stat label="Sessions" value={beneficiaries.length} />
      </div>
      <div className="rounded-xl bg-white p-4 border" style={{boxShadow:'var(--elev-1)'}}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[13px]">Sessions</h3>
          <button onClick={()=> downloadProjectCsv(id||'')} className="inline-flex items-center gap-2 text-[12px] underline">
            <FileDown className="w-4 h-4"/> Export CSV
          </button>
        </div>
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Femmes</th>
              <th className="px-3 py-2 font-medium">Hommes</th>
              <th className="px-3 py-2 font-medium">Total</th>
              <th className="px-3 py-2 font-medium text-right">Fichier</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map(b => (
              <tr key={b.id} className="border-t hover:bg-indigo-50/30">
                <td className="px-3 py-1.5 whitespace-nowrap">{b.date}</td>
                <td className="px-3 py-1.5 capitalize">{b.type}</td>
                <td className="px-3 py-1.5">{b.females}</td>
                <td className="px-3 py-1.5">{b.males}</td>
                <td className="px-3 py-1.5 font-medium">{b.females + b.males}</td>
                <td className="px-3 py-1.5 text-right">{b.file? <button onClick={()=> downloadSessionCsv(b)} className="inline-flex items-center gap-1 underline"><FileDown className="w-4 h-4" /> {b.file}</button> : <span className="text-gray-400">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Stat = ({label,value}:{label:string;value:number}) => (
  <div className="rounded-xl bg-white p-4 border flex flex-col" style={{boxShadow:'var(--elev-1)'}}>
    <span className="text-[11px] text-gray-500">{label}</span>
    <span className="text-[22px] font-bold text-[var(--text-primary,#503246)]">{value.toLocaleString()}</span>
  </div>
);
export default ProjectBeneficiaires;

function downloadProjectCsv(projectId: string){
  if(!projectId) return;
  const rows = listBeneficiaries(projectId);
  const headers = ['session_id','date','type','females','males','total'];
  const csv = [headers.join(','), ...rows.map(r=> [r.id, r.date, r.type, String(r.females), String(r.males), String(r.females + r.males)].map(v => '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
  const blob = new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`beneficiaries_${projectId}.csv`; a.click(); URL.revokeObjectURL(a.href);
}

function downloadSessionCsv(b: {id:string; date:string; type:string; females:number; males:number; file?: string}){
  const headers = ['session_id','date','type','females','males','total'];
  const csv = [headers.join(','), ['"'+b.id+'"','"'+b.date+'"','"'+b.type+'"', '"'+b.females+'"', '"'+b.males+'"', '"'+(b.females + b.males)+'"'].join(',')].join('\n');
  const blob = new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=b.file || `beneficiaries_session_${b.id}.csv`; a.click(); URL.revokeObjectURL(a.href);
}
