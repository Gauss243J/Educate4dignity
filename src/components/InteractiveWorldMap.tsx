import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
// Active program countries limited per request: DRC (COD), Rwanda (RWA), Burundi (BDI), Uganda (UGA), Tanzania (TZA)
const ACTIVE = new Set(['COD','RWA','BDI','UGA','TZA']);

// --- Country name normalization + synonym allow-list (for selection) ---
const normalize = (s:string) => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const DRC_SYNONYMS = [
  'democratic republic of the congo','democratic republic of congo','congo (kinshasa)','congo, the democratic republic of the','congo, dem. rep.','zaire','dr congo','rd congo','republique democratique du congo'
];
const RWANDA_SYNONYMS = ['rwanda'];
const BURUNDI_SYNONYMS = ['burundi'];
const TANZANIA_SYNONYMS = ['tanzania','united republic of tanzania','tanzanie'];
const UGANDA_SYNONYMS = ['uganda','ouganda'];
const ALLOWED_NORMALIZED = new Set([
  ...DRC_SYNONYMS,...RWANDA_SYNONYMS,...BURUNDI_SYNONYMS,...TANZANIA_SYNONYMS,...UGANDA_SYNONYMS
].map(normalize));
const isDRCName = (name:string) => {
  const n = normalize(name).replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  return n === 'democratic republic of the congo' ||
    n === 'democratic republic of congo' ||
    n === 'republique democratique du congo' ||
    n === 'congo dem rep' ||
    (n.includes('congo') && (n.includes('dem') || n.includes('kinshasa') || n.includes('zaire')));
};
const isAllowedName = (name:string) => isDRCName(name) || ALLOWED_NORMALIZED.has(normalize(name));

// Beneficiaries (sample data) per active country ISO3
const BENEFICIARIES: Record<string, number> = {
  COD: 18450,
  RWA: 9200,
  BDI: 5400,
  UGA: 13200,
  TZA: 11100
};

interface MapProps { mode?: 'focus' | 'global'; }

export const InteractiveWorldMap: React.FC<MapProps> = ({ mode='focus' }) => {
  const [hover,setHover] = React.useState<{code:string; name:string}|undefined>();
  const [pos,setPos] = React.useState<{x:number;y:number}>({x:0,y:0});
  const [selected,setSelected] = React.useState<{code:string; name:string}|undefined>();
  const toggle = (code:string, name:string) => {
    setSelected({code,name});
    // eslint-disable-next-line no-console
    console.log('Selected country', { code, name });
  };

  // Force full-world visibility: use a smaller scale + neutral center when not focusing.
  const projectionConfig = mode === 'focus'
    ? { scale: 360, center:[25, -2] }
    : { scale: 200, center:[0,10] };

  return (
  <div className="w-full relative h-[420px] md:h-[520px] lg:h-[680px]" style={{minHeight:420}}>
      <ComposableMap projectionConfig={projectionConfig as any} style={{ width:'100%', height:'100%' }}
        onMouseMove={(e:any)=> setPos({x:e.clientX, y:e.clientY})}
      >
        <Geographies geography={TOPO_URL}>
          {({ geographies }: { geographies: any[] }) => geographies.map((geo: any) => {
            const props:any = geo.properties || {};
            const iso3 = props.ISO_A3 || props.ADM0_A3 || props.iso_a3 || '';
            const name = props.NAME || props.ADMIN || props.BRK_NAME || iso3;
            // active by ISO code (program countries)
            const activeISO = ACTIVE.has(iso3);
            // allowed by synonym (for click) but we only color ISO active countries
            const allowedByName = isAllowedName(name);
            const selectable = activeISO || allowedByName; // click-target
            const isSelected = selected && selected.code === iso3;
            const isDRC = iso3 === 'COD' || isDRCName(name);
    return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={(e)=> { setHover({code:iso3,name}); setPos({x:e.clientX,y:e.clientY}); }}
                onMouseLeave={()=> { setHover(undefined); }}
                onClick={()=> selectable && toggle(iso3,name)}
                style={{
  default:{ fill: activeISO ? (isSelected ? 'var(--rose-600)' : 'var(--rose-300)') : '#e5e7eb', stroke: isDRC ? 'var(--rose-700)' : (activeISO ? 'var(--rose-500)':'#ffffff'), strokeWidth: isDRC ? (isSelected?1.9:1.1) : (activeISO ? 0.7:0.4), outline:'none', cursor: selectable ? 'pointer':'default', transition:'fill .25s, stroke .25s, stroke-width .25s', filter: isSelected ? 'drop-shadow(0 0 6px rgba(190,18,60,0.55))' : (activeISO ? 'drop-shadow(0 0 2px rgba(190,18,60,0.25))':'none') },
  hover:{ fill: activeISO ? 'var(--rose-500)' : (selectable ? '#f3f4f6' : '#f1f5f9'), stroke: isDRC ? 'var(--rose-700)' : (activeISO ? 'var(--rose-600)':'#d1d5db'), strokeWidth: isDRC ? (isSelected?2:1.4) : (activeISO ? 0.9:0.4), outline:'none', filter: activeISO ? 'drop-shadow(0 0 5px rgba(190,18,60,0.55))':'none' },
  pressed:{ fill: activeISO ? 'var(--rose-600)' : '#e2e8f0', stroke: isDRC ? 'var(--rose-800)' : (activeISO ? 'var(--rose-700)':'#cbd5e1'), strokeWidth: isDRC ? 2.1 : (activeISO ? 1.0:0.4), outline:'none' }
                }}
              />
            );
          })}
        </Geographies>
      </ComposableMap>
    {hover && (
        <div className="map-tooltip" style={{top:pos.y + 16, left:pos.x + 16, position:'fixed'}}>
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-md px-3 py-2 shadow-sm max-w-[200px] pointer-events-none">
            <div className="text-[13px] font-semibold text-slate-800 leading-snug mb-1">
              {hover.name} {hover.code && <span className="text-slate-400 text-[11px] font-normal">({hover.code})</span>}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600">
              <span className="uppercase tracking-wide text-[9px] text-slate-500">Femmes bénéficiaires</span>
              <span className="font-medium text-rose-600">{(BENEFICIARIES[hover.code] || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
  {/* Footer removed per request */}
      {selected && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm border border-rose-200 rounded px-3 py-1 text-[11px] text-rose-700 font-medium shadow-sm">
          Sélection: {selected.name} ({selected.code})
        </div>
      )}
      {hover && (
        <div className="absolute top-2 left-2 bg-white/75 backdrop-blur-sm border border-slate-200 rounded px-2.5 py-0.5 text-[11px] text-slate-700 font-medium shadow-sm pointer-events-none">
          Survol: {hover.name} {hover.code && <span className="opacity-60">({hover.code})</span>}
        </div>
      )}
    </div>
  );
};
