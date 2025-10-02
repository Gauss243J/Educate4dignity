import React from 'react';

interface AdminLayoutProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  cssVars?: React.CSSProperties;
}

const defaultVars: React.CSSProperties = {
  ['--panel-sidebar' as any]: '#FCECF2',
  ['--chip-bg' as any]: '#FFEAF1',
  ['--primary-accent' as any]: '#C23D74',
  ['--border-color' as any]: '#E9AABB',
  ['--muted-color' as any]: '#8B6678',
  ['--text-primary' as any]: '#503246'
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ sidebar, header, children, cssVars }) => {
  return (
    <div className="min-h-screen flex" style={{ ...defaultVars, ...cssVars }}>
      {sidebar}
      <div className="flex-1 min-h-screen flex flex-col bg-[#FFF7FA]">
        {header}
        <main className="flex-1 w-full flex flex-col items-center">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
