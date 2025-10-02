import React from 'react';

interface AdminPageProps { title?: string; children: React.ReactNode; actions?: React.ReactNode; description?: string; }

const AdminPage: React.FC<AdminPageProps> = ({ title, description, actions, children }) => {
  return (
    <div className="w-full max-w-[1120px] px-6 py-6 space-y-8">
      {title && (
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold text-[var(--text-primary)] leading-tight">{title}</h1>
            {description && <p className="text-[13px] text-[var(--muted-color)] mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default AdminPage;
