import React from 'react';

export interface RotatingQualityItem { label: string; description?: string; }
interface RotatingQualitiesProps {
  title?: string;
  lead?: string;
  items: (string | RotatingQualityItem)[];
  intervalMs?: number;
  kpiBadge?: { label: string; sub?: string };
}

/**
 * Displays a vertical list where one line at a time is highlighted (color + full opacity)
 * while others are dimmed, cycling automatically. Respects reduced motion by pausing cycle.
 */
export const RotatingQualities: React.FC<RotatingQualitiesProps> = ({ lead='Educate4Dignity is', items, intervalMs=2400, kpiBadge }) => {
  const [idx,setIdx] = React.useState(0);
  const reduced = React.useMemo(()=> typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const parsed = React.useMemo<RotatingQualityItem[]>(()=> items.map(it => typeof it === 'string' ? { label: it } : it), [items]);

  React.useEffect(()=> {
    if(reduced) return; // no auto-cycle
    const id = setInterval(()=> setIdx(i => (i+1)%parsed.length), intervalMs);
    return ()=> clearInterval(id);
  },[parsed.length, intervalMs, reduced]);

  return (
    <div className="select-none relative" aria-live="polite" aria-label={lead + ' ' + parsed[idx].label}>
      {/* subtle radial background */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{background:'radial-gradient(circle at 70% 40%, rgba(255,0,90,0.07), transparent 60%)'}} />
      <div className={`relative grid lg:grid-cols-[420px_minmax(0,1fr)] gap-10 items-start`}>
        <div className="space-y-2 flex-shrink-0 border-b lg:border-b-0 lg:pr-6 lg:border-r" style={{borderColor:'var(--rose-200)'}}>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{color:'var(--slate-900)'}}>{lead}</div>
          <ul className="m-0 p-0 list-none space-y-1">
            {parsed.map((q,i)=> {
              const active = i===idx;
              const label = q.label.charAt(0).toUpperCase() + q.label.slice(1);
              return (
                <li key={i} className={`font-extrabold leading-tight will-change-auto transition-colors duration-500 ${active? '':'opacity-90'}`} style={{fontSize:'18px', lineHeight:'1.2'}}>
                  <button
                    type="button"
                    onClick={()=> setIdx(i)}
                    className="p-0 m-0 bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-sm"
                    aria-current={active}
                    aria-describedby={active? `rq-desc-${i}`: undefined}
                    style={{color: active? 'var(--rose-500)' : 'var(--slate-300)', transition:'color .5s'}}
                  >{label}</button>
                </li>
              );
            })}
          </ul>
          {kpiBadge && (
            <div className="mt-6 inline-flex flex-col items-start gap-1 rounded-xl border px-4 py-3 shadow-sm bg-white/70 backdrop-blur-sm" style={{borderColor:'var(--rose-200)'}}>
              <div className="text-xl font-extrabold text-rose-600 leading-none">{kpiBadge.label}</div>
              {kpiBadge.sub && <div className="text-[12px] font-medium" style={{color:'var(--slate-600)'}}>{kpiBadge.sub}</div>}
            </div>
          )}
        </div>
        <div className="flex-1 min-h-[160px] md:min-h-[180px] relative pt-1 flex items-center justify-center text-center">
          {parsed.map((q,i)=> {
            const active = i===idx;
            return (
              <div
                key={i}
                id={`rq-desc-${i}`}
                role={active? 'region': undefined}
                aria-hidden={!active}
                className={`absolute inset-0 transition-opacity duration-600 flex items-center justify-center ${active? 'opacity-100':'opacity-0 pointer-events-none'}`}
                style={{display: 'flex'}}
              >
                <div className="px-4 w-full flex items-center justify-center">
                  <p className="font-semibold leading-snug mx-auto" style={{color:'var(--slate-700)', fontSize:'clamp(1.35rem,2.2vw,2.1rem)'}}>{q.description || ''}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RotatingQualities;
