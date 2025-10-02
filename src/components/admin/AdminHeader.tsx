import React from 'react';
import { LanguageSelector } from '../ui/LanguageSelector';
import { useAuth } from '../../hooks/authContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, LogOut, HelpCircle } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  sidebarId?: string;
  sidebarOpen?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar, sidebarId = 'admin-sidebar', sidebarOpen }) => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { t } = useTranslation();
  const [menuOpen,setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement|null>(null);

  React.useEffect(()=> {
    const onKey = (e:KeyboardEvent) => { if(e.key==='Escape') setMenuOpen(false); };
    const onClick = (e:MouseEvent) => { if(menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    if(menuOpen){ window.addEventListener('keydown',onKey); window.addEventListener('mousedown',onClick); }
    return ()=> { window.removeEventListener('keydown',onKey); window.removeEventListener('mousedown',onClick); };
  },[menuOpen]);

  const handleLogout = () => { logout(); nav('/login'); };

  const displayName = user?.name || 'Admin';

  return (
    <header className="h-14 border-b border-[var(--border-color)] bg-white/80 backdrop-blur flex items-center px-4 justify-between sticky top-0 z-30">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-1 rounded hover:bg-[var(--chip-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]"
        aria-label="Menu"
        aria-controls={sidebarId}
        aria-expanded={sidebarOpen}
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-4 ml-auto">
        <LanguageSelector />
        <button className="relative p-2 rounded hover:bg-[var(--chip-bg)] focus:outline-none" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[var(--primary-accent)] text-white text-[9px] rounded-full flex items-center justify-center">3</span>
        </button>
        <div className="relative" ref={menuRef}>
          <button onClick={()=>setMenuOpen(o=>!o)} className="flex items-center gap-2 group focus:outline-none" aria-haspopup="menu" aria-expanded={menuOpen}>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-accent)] text-white text-sm font-bold">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <span className="text-[12px] font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-accent)] transition">{displayName}</span>
          </button>
          {menuOpen && (
            <div role="menu" className="absolute right-0 mt-2 min-w-[180px] rounded-md border border-[var(--border-color)] bg-white shadow-lg py-1 text-[12px] z-50 animate-fade-in">
              <button className="w-full flex items-center gap-2 text-left px-3 py-2 rounded hover:bg-[var(--chip-bg)] text-[var(--text-primary)]" role="menuitem">
                <HelpCircle size={14} /> {t('admin.ui.actions.help','Help')}
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 text-left px-3 py-2 rounded hover:bg-[var(--chip-bg)] text-[var(--text-primary)]" role="menuitem">
                <LogOut size={14} /> {t('admin.ui.actions.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
