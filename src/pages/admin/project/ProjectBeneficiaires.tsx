import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectData } from '../../../hooks/useProjectData';

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
        <h3 className="font-semibold mb-3 text-[13px]">Sessions</h3>
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Femmes</th>
              <th className="px-3 py-2 font-medium">Hommes</th>
              <th className="px-3 py-2 font-medium">Total</th>
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
