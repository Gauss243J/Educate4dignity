import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Item { id?:string; label:string; path?:string; href?:string; }
interface Props { title: string; items: Item[]; defaultOpen?: boolean; preview?: string; }

const SidebarGroup: React.FC<Props> = ({ title, items, defaultOpen, preview }) => {
  const [open,setOpen] = useState(!!defaultOpen);
  const location = useLocation();
  return (
    <div className="mb-3">
      <button onClick={()=>setOpen(o=>!o)} aria-expanded={open} className="w-full text-left flex items-center justify-between text-[12px] font-semibold px-3 py-2 rounded-md bg-[var(--panel-sidebar,#FCECF2)] text-[var(--primary-accent,#C23D74)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent,#C23D74)]">
        <span className="flex items-center gap-1 whitespace-pre-line leading-snug">
          {open? <ChevronDown size={14} /> : <ChevronRight size={14} />} {title}
        </span>
      </button>
      {!open && preview && (
        <div className="mt-1 px-3 text-[11px] text-[var(--muted-color,#8B6678)] leading-snug whitespace-pre-line">{preview}</div>
      )}
      {open && (
        <ul className="mt-1 space-y-0.5">
          {items.map((it,idx) => {
            const to = it.path || it.href || '#';
            const active = location.pathname === to;
            return (
              <li key={idx}>
                <Link to={to} aria-current={active? 'page': undefined} className={`group flex items-center gap-2 text-[12px] px-4 py-1.5 rounded-md truncate transition border border-transparent ${active? 'bg-[var(--chip-bg,#FFEAF1)] text-[var(--primary-accent,#C23D74)] border-[var(--border-color,#E9AABB)]':'text-[var(--muted-color,#8B6678)] hover:bg-white hover:text-[var(--primary-accent,#C23D74)]'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${active? 'bg-[var(--primary-accent,#C23D74)]':'bg-[var(--border-color,#E9AABB)] group-hover:bg-[var(--primary-accent,#C23D74)]'}`} />
                  <span className="truncate">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SidebarGroup;
