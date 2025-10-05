import React from 'react';
import SidebarGroup from './SidebarGroup';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavSpec {
  title: string;
  quick_links: { label: string; labelKey?: string; href: string; active?: boolean }[];
  groups: { id: string; title: string; titleKey?: string; expanded?: boolean; preview?: string; items: { label: string; labelKey?: string; href: string }[] }[];
}

interface AdminSidebarProps {
  nav: NavSpec;
  open: boolean; // mobile visibility
  collapsed?: boolean; // desktop collapsed state
  onClose?: () => void;
  id?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ nav, open, collapsed=false, id = 'admin-sidebar' }) => {
  const { t } = useTranslation();
  return (
    <aside
      id={id}
      role="navigation"
      aria-label="Admin sidebar"
      className={`relative lg:static self-stretch bg-[var(--panel-sidebar)] border-r border-[var(--border-color)]/60 flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'w-[72px]' : 'w-[240px]'} transition-[width] shadow-[var(--elev-1)]`}
      data-collapsed={collapsed}
    >
      {/* Remove duplicate top bar; header already contains logo & title */}
      <div className={`p-3 text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-wide ${collapsed ? 'text-center' : ''}`}>{!collapsed && t('admin.ui.quick.dashboard')}</div>
      <div className={`px-3 mb-2 ${collapsed ? 'space-y-2 flex flex-col items-center' : ''}`}>
        {nav.quick_links.map((q) => (
          <Link
            key={q.href}
            to={q.href}
            aria-current={q.active ? 'page' : undefined}
            className={`block text-[12px] ${collapsed ? 'px-0 text-center w-10 h-10 flex items-center justify-center rounded-full' : 'px-4 py-1.5 rounded-md'} border ${q.active
                ? 'bg-[var(--chip-bg)] border-[var(--border-color)]/60 text-[var(--primary-accent)] shadow-[var(--elev-1)]'
                : 'border-[var(--border-color)]/0 hover:border-[var(--border-color)]/40 hover:bg-white text-[var(--muted-color)] hover:text-[var(--primary-accent)] transition-colors'} `}
          >
            {collapsed ? q.label.charAt(0) : (q.labelKey ? t(q.labelKey) : q.label)}
          </Link>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3 admin-scrollbar">
        {nav.groups.map((g) => (
          <div key={g.id}>
            {!collapsed && <SidebarGroup
              title={g.titleKey ? t(g.titleKey) : g.title}
              items={g.items.map((it) => ({ label: it.labelKey ? t(it.labelKey) : it.label, path: it.href }))}
              defaultOpen={g.expanded}
              preview={g.preview}
            />}
            {collapsed && (
              <div className="flex flex-col items-center gap-1" aria-label={g.titleKey ? t(g.titleKey) : g.title}>
                {g.items.map(it => (
                  <Link key={it.href} to={it.href} title={it.labelKey ? t(it.labelKey) : it.label} className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] text-[var(--muted-color)] hover:bg-white hover:text-[var(--primary-accent)]">
                    {(it.labelKey ? t(it.labelKey) : it.label).charAt(0)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Collapse/expand button removed per design; use header hamburger instead */}
    </aside>
  );
};

export default AdminSidebar;
