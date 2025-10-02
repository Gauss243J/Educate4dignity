import React from 'react';

interface KpiCardProps { title: string; value: string | number; subtitle?: string; progressPct?: number; segments?: number[]; }

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, progressPct, segments }) => {
  const totalSeg = segments?.reduce((a,b)=>a+b,0) || 0;
  return (
    <div className="rounded-xl border p-4 md:p-5 bg-white border-[var(--border-color,#E9AABB)] flex flex-col gap-2 shadow-sm min-h-[140px]">
      <div className="text-[11px] font-semibold tracking-wide uppercase text-[var(--muted-color,#8B6678)]">{title}</div>
      <div className="text-[26px] font-bold text-[var(--text-primary,#503246)] leading-none">{value}</div>
      {subtitle && <div className="text-[11px] text-[var(--muted-color,#8B6678)] leading-tight">{subtitle}</div>}
      {segments && segments.length>0 && (
        <div className="flex w-full h-1.5 rounded overflow-hidden bg-[var(--chip-bg,#FFEAF1)] mt-auto">
          {segments.map((s,i)=> <div key={i} style={{width:`${(s/totalSeg)*100}%`}} className="bg-[var(--primary-accent,#C23D74)]/50 first:rounded-l last:rounded-r" />)}
        </div>
      )}
      {!segments && typeof progressPct === 'number' && (
        <div className="h-1.5 rounded bg-[var(--chip-bg,#FFEAF1)] overflow-hidden mt-auto">
          <div className="h-full bg-[var(--primary-accent,#C23D74)] transition-all" style={{width: `${Math.min(100, Math.max(0, progressPct))}%`}} />
        </div>
      )}
    </div>
  );
};

export default KpiCard;
