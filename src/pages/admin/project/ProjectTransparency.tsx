import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectData } from '../../../hooks/useProjectData';

const num = (n:number)=> '$ ' + n.toLocaleString(undefined,{maximumFractionDigits:0});

const ProjectTransparency: React.FC = () => {
  const { id } = useParams();
  const { kpis, expenses, reports } = useProjectData(id||'');
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi title="Budget planifié" value={kpis? num(kpis.totalBudget):'—'} subtitle="Toutes activités" pct={100} />
        <Kpi title="Dépensé" value={kpis? num(kpis.spent):'—'} subtitle="Toutes activités" pct={kpis? (kpis.executionPct):0} />
        <Kpi title="% Exécution" value={kpis? kpis.executionPct.toFixed(0)+'%':'—'} subtitle="Dépensé / Planifié" pct={kpis? kpis.executionPct:0} barTint="#c026d3" />
        <Kpi title="Part admin" value={kpis? kpis.adminSharePct.toFixed(0)+'%':'—'} subtitle="Cap 10%" pct={kpis? kpis.adminSharePct:0} barTint={ (kpis&&kpis.adminSharePct>10)? '#dc2626':'#16a34a'} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Panel title="Rapports">
          <div className="text-[12px] leading-relaxed">
            <div><span className="font-semibold">Validés:</span> {kpis?.reportsValid}</div>
            <div><span className="font-semibold">Soumis:</span> {kpis?.reportsPending}</div>
            <div><span className="font-semibold">Total:</span> {reports.length}</div>
          </div>
        </Panel>
        <Panel title="Dépenses (Top 5)">
          <ul className="text-[12px] divide-y">
            {expenses.slice(0,5).map(e=> <li key={e.id} className="py-1 flex justify-between gap-2"><span className="truncate">{e.description}</span><span className="text-gray-600">{e.currency==='USD'? '$'+e.amount.toLocaleString(): (e.amount * (e.fx||0)).toFixed(0)+'$'}</span></li>)}
          </ul>
        </Panel>
        <Panel title="Qualité & Intégrité">
          <p className="text-[12px] text-gray-600">Placeholders: % dépenses validées, délais validation, anomalies. Implémentation future.</p>
        </Panel>
      </div>
    </div>
  );
};

const Kpi = ({title,value,subtitle,pct,barTint}:{title:string;value:string;subtitle:string;pct:number;barTint?:string}) => (
  <div className="rounded-xl bg-white p-4 border flex flex-col gap-2" style={{boxShadow:'var(--elev-1)'}}>
    <div className="text-[12px] font-semibold">{title}</div>
    <div className="text-[22px] font-bold text-[var(--text-primary,#503246)] leading-none">{value}</div>
    <div className="text-[11px] text-[var(--muted-color,#7a6d7b)]">{subtitle}</div>
    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full transition-all" style={{width: Math.min(100, Math.max(0,pct))+'%', background: barTint||'linear-gradient(90deg,#9d174d,#ec4899)'}} />
    </div>
  </div>
);

const Panel: React.FC<{title:string; children:React.ReactNode}> = ({title,children}) => (
  <div className="rounded-xl bg-white p-4 border" style={{boxShadow:'var(--elev-1)'}}>
    <h3 className="font-semibold mb-2 text-[13px]">{title}</h3>
    {children}
  </div>
);
export default ProjectTransparency;
