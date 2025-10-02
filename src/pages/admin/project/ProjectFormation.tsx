import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectData } from '../../../hooks/useProjectData';
import { ActivityCard } from '../../../components/admin/plan/ActivityCard';

const ProjectFormation: React.FC = () => {
  const { id } = useParams();
  const { activities } = useProjectData(id||'');
  const list = activities.filter(a=> (a.category||'').includes('formation') || a.title.toLowerCase().includes('former'));
  return (
    <div className="space-y-5">
      <Header count={list.length} label="Formation" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(a=> <ActivityCard key={a.id} activity={a} />)}
        {list.length===0 && <Empty label="Aucune activité formation" />}
      </div>
    </div>
  );
};
export default ProjectFormation;

const Header = ({count,label}:{count:number;label:string}) => (
  <div className="flex items-center justify-between">
    <h2 className="font-semibold text-[15px]">{label}</h2>
    <span className="text-[11px] text-gray-500">{count} items</span>
  </div>
);
const Empty = ({label}:{label:string}) => (
  <div className="col-span-full text-center text-[12px] text-gray-500 border rounded-lg py-8" style={{boxShadow:'var(--elev-1)'}}> {label} </div>
);
