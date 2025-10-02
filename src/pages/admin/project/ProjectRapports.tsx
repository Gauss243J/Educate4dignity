import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectData } from '../../../hooks/useProjectData';

const ProjectRapports: React.FC = () => {
  const { id } = useParams();
  const { reports } = useProjectData(id||'');
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-white border overflow-hidden" style={{boxShadow:'var(--elev-1)'}}>
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Période/Milestone</th>
              <th className="px-3 py-2 font-medium">Auteur</th>
              <th className="px-3 py-2 font-medium">Soumis le</th>
              <th className="px-3 py-2 font-medium">Statut</th>
              <th className="px-3 py-2 font-medium">Fichier</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-t hover:bg-indigo-50/30">
                <td className="px-3 py-1.5 capitalize">{r.type}</td>
                <td className="px-3 py-1.5">{r.period || r.milestoneId || '—'}</td>
                <td className="px-3 py-1.5">{r.author}</td>
                <td className="px-3 py-1.5">{r.submittedAt || '—'}</td>
                <td className="px-3 py-1.5"><ReportStatus status={r.status} /></td>
                <td className="px-3 py-1.5 text-indigo-600 underline cursor-pointer">{r.file || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportStatus: React.FC<{status:string}> = ({status}) => {
  const map: Record<string,string> = {
    validé: 'bg-green-100 text-green-700 border-green-300',
    soumis: 'bg-amber-100 text-amber-700 border-amber-300',
    brouillon: 'bg-gray-100 text-gray-600 border-gray-300',
    rejeté: 'bg-red-100 text-red-700 border-red-300'
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] border ${map[status]||'bg-gray-100 border-gray-300'}`}>{status}</span>;
};
export default ProjectRapports;
