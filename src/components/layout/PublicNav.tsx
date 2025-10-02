import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';
import LanguageSwitcher from '../ui/LanguageSwitcher';

// Central public navigation reused across public pages (landing, projects, resources, etc.)
// Keeps consistent styling and active route highlighting.
export const PublicNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const items: Array<{ label: string; to: string; match?: RegExp }> = [
    { label: t('nav.projects','Projects'), to: '/projects', match: /^\/projects/ },
    { label: t('resources','Resources'), to: '/resources', match: /^\/resources/ },
    { label: 'About', to: '/about', match: /^\/(about|contact)/ },
    { label: 'Blog', to: '/blog', match: /^\/blog/ },
    { label: 'E-learning', to: '/elearning', match: /^\/elearning/ },
    { label: t('nav.contact','Contact'), to: '/contact', match: /^\/(contact)/ },
    { label: t('nav.signin','Sign In'), to: '/login', match: /^\/login/ }
  ];

  const [dark,setDark] = React.useState<boolean>(()=> typeof document!=='undefined' && document.documentElement.classList.contains('dark'));
  React.useEffect(()=> {
    if(typeof document==='undefined') return;
    if(dark) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); }
    try { localStorage.setItem('theme', dark? 'dark':'light'); } catch {}
  },[dark]);
  React.useEffect(()=> {
    try { const saved = localStorage.getItem('theme'); if(saved==='dark') setDark(true); } catch {}
  },[]);

  return (
    <header className="sticky-header px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between">
        <Logo size="md" className="flex items-center" imgClassName="" />
  <nav className="hidden md:flex items-center gap-6 text-sm">
          {items.map(item => {
            const active = item.match ? item.match.test(location.pathname) : location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className={`hover:text-[var(--rose-600)] ${active?'font-semibold text-[var(--rose-600)]':'text-[var(--slate-600)]'}`}>{item.label}</Link>
            );
          })}
          <Link to="/donate" className="btn-rose">{t('nav.donate','Donate')}</Link>
          <LanguageSwitcher className="ml-1" />
          <button
            type="button"
            onClick={()=> setDark(d=>!d)}
            className="ml-2 text-xs px-3 h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-light)] transition-colors"
            aria-label="Toggle dark mode"
          >{dark? 'Light':'Dark'} mode</button>
        </nav>
      </div>
    </header>
  );
};

export default PublicNav;