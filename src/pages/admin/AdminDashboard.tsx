import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import KpiCard from '../../components/admin/KpiCard';
import { GroupedBarChart, MiniLineChart, MiniPieChart } from '../../components/admin/MiniCharts';
import RecentItemsTable from '../../components/admin/RecentItemsTable';
import { adminNavSpec } from '../../data/adminSpec';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { useTranslation } from 'react-i18next';
import { useDashboardData } from '../../hooks/useDashboardData';
import AdminPage from '../../components/admin/AdminPage';
import ProjectsOverview from './ProjectsOverview';
import ProjectCreate from './ProjectCreate';
import ProjectDetail from './ProjectDetail';
import ProjectPlanMilestonesPage from './ProjectPlanMilestonesPage';
import ProjectLayout from '../../components/admin/ProjectLayout';
import ProjectProduction from './project/ProjectProduction';
import ProjectDistribution from './project/ProjectDistribution';
import ProjectFormation from './project/ProjectFormation';
import ProjectTransparency from './project/ProjectTransparency';
import ProjectDepenses from './project/ProjectDepenses';
import ProjectRapports from './project/ProjectRapports';
import ProjectBeneficiaires from './project/ProjectBeneficiaires';
import DistributorsManagement from './DistributorsManagement';
import SuppliersManagement from './SuppliersManagement';
import BeneficiariesManagement from './BeneficiariesManagement';

// Placeholder simple cards used by routes
const Placeholder = ({title,children}:{title:string;children?:React.ReactNode}) => (
  <div className="p-6"><h1 className="text-xl font-semibold mb-4 text-[var(--text-primary,#503246)]">{title}</h1><div className="rounded-xl bg-white p-6 text-[14px] text-[var(--muted-color,#8B6678)]" style={{boxShadow:'var(--elev-1)'}}>{children||'Contenu à venir.'}</div></div>
);

const AdminDashboard: React.FC = () => {
  const [sidebarOpen,setSidebarOpen] = useState(false); // mobile overlay visibility
  const [sidebarCollapsed,setSidebarCollapsed] = useState(false); // desktop collapse
  const { t } = useTranslation();
  const nav = adminNavSpec.sidebar;
  const { data, loading, error, refresh } = useDashboardData();
  return (
    <AdminLayout
      sidebar={<AdminSidebar nav={nav} open={sidebarOpen} collapsed={sidebarCollapsed} onToggleCollapse={()=>setSidebarCollapsed(c=>!c)} />}
      header={<AdminHeader onToggleSidebar={()=>setSidebarOpen(o=>!o)} sidebarOpen={sidebarOpen} />}
    >
      <Routes>
        <Route index element={
          <AdminPage title={t('admin.dashboard')}>
            {loading && <div className="text-sm text-[var(--muted-color)]">Chargement...</div>}
            {error && <div className="text-sm text-red-600">Erreur: {error} <button onClick={refresh} className="underline">Réessayer</button></div>}
            {data && <>
              <KpiRow data={data} />
              <ChartsRow data={data} />
              <RecentTable data={data} />
            </>}
          </AdminPage>
        } />
  <Route path="projects" element={<ProjectsOverview />} />
  <Route path="projects/new" element={<ProjectCreate />} />
  <Route path="projects/:id" element={<ProjectLayout />}> 
    <Route path="resume" element={<ProjectDetail />} />
    <Route path="plan" element={<ProjectPlanMilestonesPage />} />
    <Route path="production" element={<ProjectProduction />} />
    <Route path="distribution" element={<ProjectDistribution />} />
    <Route path="formation" element={<ProjectFormation />} />
    <Route path="transparency" element={<ProjectTransparency />} />
    <Route path="depenses" element={<ProjectDepenses />} />
    <Route path="rapports" element={<ProjectRapports />} />
    <Route path="beneficiaires" element={<ProjectBeneficiaires />} />
    <Route index element={<ProjectDetail />} />
  </Route>
  <Route path="distributors" element={<DistributorsManagement />} />
  <Route path="producers" element={<SuppliersManagement />} />
  <Route path="beneficiaries" element={<BeneficiariesManagement />} />
  <Route path="finances" element={<Placeholder title={t('admin.finances')} />} />
  <Route path="donors" element={<Placeholder title={t('admin.donors')} />} />
  <Route path="blog" element={<Placeholder title={t('admin.resources')} />} />
  <Route path="elearning" element={<Placeholder title={t('admin.elearning')} />} />
  <Route path="resources" element={<Placeholder title={t('admin.resources')} />} />
  <Route path="research" element={<Placeholder title={t('admin.research')} />} />
  <Route path="settings" element={<Placeholder title={t('admin.settings')} />} />
  <Route path="settings/access" element={<Placeholder title={t('admin.admin')} />} />
  <Route path="team" element={<Placeholder title={t('admin.team')} />} />
        <Route path="*" element={<Outlet />} />
      </Routes>
    </AdminLayout>
  );
};

const KpiRow: React.FC<{data:any}> = ({data}) => {
  const d = data.kpis;
  const { t } = useTranslation();
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard title={t('admin.ui.kpis.activeProjects')} value={d.projects_active} subtitle="Dis/For/Blank" segments={d.distribution_bar} />
      <KpiCard title={t('admin.ui.kpis.collected')} value={`$ ${d.collected_total.toLocaleString()}`} subtitle={`Mois: $ ${d.collected_month.toLocaleString()} · Total: $ ${d.collected_total.toLocaleString()}`} progressPct={(d.collected_total/(d.collected_total*1.1))*100} />
      <KpiCard title={t('admin.ui.kpis.spent')} value={`$ ${d.spent_total.toLocaleString()}`} subtitle={`Mois: $ ${d.spent_month.toLocaleString()} · Total: $ ${d.spent_total.toLocaleString()}`} progressPct={(d.spent_total/d.collected_total)*100} />
      <KpiCard title={t('admin.ui.kpis.beneficiaries')} value={d.beneficiaries_total.toLocaleString()} subtitle={`Mois: ${d.beneficiaries_month.toLocaleString()} · Total: ${d.beneficiaries_total.toLocaleString()}`} progressPct={ (d.beneficiaries_month/d.beneficiaries_total)*100 } />
    </div>
  );
};

const ChartsRow: React.FC<{data:any}> = ({data}) => {
  const c = data.charts;
  const { t } = useTranslation();
  const monthLabels = c.months.map((m:string)=> t(`admin.ui.months.${m}`));
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GroupedBarChart title={t('admin.ui.charts.collectePlanDep')} labels={monthLabels} series={{Collecte:c.bar.collecte, Planifié:c.bar['planifié'], Dépensé:c.bar['dépensé']}} />
      <MiniLineChart title={t('admin.ui.charts.milestones')} points={c.milestones_percent} />
      <MiniPieChart title={t('admin.ui.charts.spendingSplit')} values={c.pie_spending} />
    </div>
  );
};

const RecentTable: React.FC<{data:any}> = ({data}) => {
  const rows = data.recent.map((r:any,i:number)=> ({ id:String(i), date:r.date, type:r.type, ref:r.ref, status:r.statut, amount:r.montant??undefined, action:r.action }));
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-[15px] font-semibold mb-3 text-[var(--text-primary)]">{t('admin.ui.table.recentItems')}</h2>
      <RecentItemsTable items={rows} />
    </div>
  );
};

export default AdminDashboard;
