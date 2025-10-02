import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectData } from '../../../hooks/useProjectData';

const ProjectDepenses: React.FC = () => {
  const { id } = useParams();
  const { expenses } = useProjectData(id||'');
  const [sort,setSort] = useState<'date'|'amount'>('date');
  const sorted = [...expenses].sort((a,b)=> sort==='date'? a.date.localeCompare(b.date) : (b.amount - a.amount));
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[11px]">
        <button onClick={()=>setSort('date')} className={`px-3 py-1 rounded-full border ${sort==='date'?'bg-indigo-600 text-white border-indigo-600':'bg-white'}`}>Tri Date</button>
        <button onClick={()=>setSort('amount')} className={`px-3 py-1 rounded-full border ${sort==='amount'?'bg-indigo-600 text-white border-indigo-600':'bg-white'}`}>Tri Montant</button>
      </div>
      <div className="rounded-xl bg-white border overflow-hidden" style={{boxShadow:'var(--elev-1)'}}>
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Activité</th>
              <th className="px-3 py-2 font-medium">Catégorie</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">Payé à</th>
              <th className="px-3 py-2 font-medium">Devise</th>
              <th className="px-3 py-2 font-medium text-right">Montant</th>
              <th className="px-3 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(e => (
              <tr key={e.id} className="border-t hover:bg-indigo-50/30">
                <td className="px-3 py-1.5 whitespace-nowrap">{e.date}</td>
                <td className="px-3 py-1.5">{e.activityId}</td>
                <td className="px-3 py-1.5 capitalize">{e.category}</td>
                <td className="px-3 py-1.5 truncate max-w-[220px]">{e.description}</td>
                <td className="px-3 py-1.5">{e.payee}</td>
                <td className="px-3 py-1.5">{e.currency}</td>
                <td className="px-3 py-1.5 text-right">{e.amount.toLocaleString()}</td>
                <td className="px-3 py-1.5"><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{status:string}> = ({status}) => {
  const map: Record<string,string> = {
    validé: 'bg-green-100 text-green-700 border-green-300',
    soumis: 'bg-amber-100 text-amber-700 border-amber-300',
    brouillon: 'bg-gray-100 text-gray-600 border-gray-300',
    rejeté: 'bg-red-100 text-red-700 border-red-300'
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] border ${map[status]||'bg-gray-100 border-gray-300'}`}>{status}</span>;
};
export default ProjectDepenses;
