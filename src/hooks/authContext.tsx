import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '../types';

interface AuthUser { id: string; email: string; role: UserRole; name?: string; }
interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string, roleHint?: UserRole) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'e4d_auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(()=>{ const raw = localStorage.getItem(STORAGE_KEY); if(raw){ try { setUser(JSON.parse(raw)); } catch {} } },[]);

  const login = async (email: string, _password: string, roleHint?: UserRole) => {
    await new Promise(r=>setTimeout(r,400));
    // Simple heuristic mapping
    let role: UserRole = 'donor';
    if(email.startsWith('admin')) role = 'admin';
    else if(email.includes('supplier')) role = 'supplier';
    else if(email.includes('distrib')) role = 'distributor';
    else if(email.includes('trainer')) role = 'trainer';
    else if(email.includes('team')) role = 'team_member';
    else if(roleHint) role = roleHint;
    const u: AuthUser = { id: 'u_'+Math.random().toString(36).slice(2), email, role, name: email.split('@')[0] };
    setUser(u); localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };
  const logout = () => { setUser(null); localStorage.removeItem(STORAGE_KEY); };
  const hasRole = (...roles: UserRole[]) => !!user && roles.includes(user.role);
  return <AuthContext.Provider value={{user, login, logout, hasRole}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => { const ctx = useContext(AuthContext); if(!ctx) throw new Error('useAuth outside provider'); return ctx; };
