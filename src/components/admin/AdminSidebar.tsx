import React from 'react';
import Logo from '../ui/Logo';
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
  open: boolean;
  onClose?: () => void;
  id?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ nav, open, id = 'admin-sidebar' }) => {
  const { t } = useTranslation();
  return (
    <aside
      id={id}
      role="navigation"
      aria-label="Admin sidebar"
      className={`fixed lg:static inset-y-0 left-0 z-40 w-[240px] bg-[var(--panel-sidebar)] border-r border-[var(--border-color)] flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--border-color)] bg-white/70 backdrop-blur text-[13px] font-semibold text-[var(--text-primary)]">
        <Logo size="sm" /> <span>Admin</span>
      </div>
      <div className="p-3 text-[11px] font-semibold text-[var(--muted-color)] uppercase tracking-wide">{t('admin.ui.quick.dashboard')}</div>
      <div className="px-3 mb-2">
        {nav.quick_links.map((q) => (
          <Link
            key={q.href}
            to={q.href}
            aria-current={q.active ? 'page' : undefined}
            className={`block text-[12px] px-4 py-1.5 rounded-md border ${
              q.active
                ? 'bg-[var(--chip-bg)] border-[var(--border-color)] text-[var(--primary-accent)]'
                : 'border-transparent hover:bg-white text-[var(--muted-color)] hover:text-[var(--primary-accent)]'
            }`}
          >
            {q.labelKey ? t(q.labelKey) : q.label}
          </Link>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {nav.groups.map((g) => (
          <SidebarGroup
            key={g.id}
            title={g.titleKey ? t(g.titleKey) : g.title}
            items={g.items.map((it) => ({ label: it.labelKey ? t(it.labelKey) : it.label, path: it.href }))}
            defaultOpen={g.expanded}
            preview={g.preview}
          />
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;
