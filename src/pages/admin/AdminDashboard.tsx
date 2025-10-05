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
import AdminDistributors from './AdminDistributors';
import AdminSuppliers from './AdminSuppliers';
import AdminSupplierCreate from './suppliers/AdminSupplierCreate';
import AdminSupplierProfile from './suppliers/AdminSupplierProfile';
import BeneficiariesManagement from './BeneficiariesManagement';
import AdminBlog from './AdminBlog';
import AdminELearning from './AdminELearning';
import AdminResources from './AdminResources';
import AdminSettings from './AdminSettings';
import AdminLessonEditor from './elearning/AdminLessonEditor';
import AdminBlogEditor from './AdminBlogEditor';
import AdminDonors from './donors/AdminDonors';
import AdminDonorProfile from './donors/AdminDonorProfile';
import AdminDistributorProfile from './distributors/AdminDistributorProfile';
import AdminDistributorCreate from './distributors/AdminDistributorCreate';
import AdminTeam from './AdminTeam';
import TeamCreate from './team/TeamCreate';
import TeamProfile from './team/TeamProfile';
import AdminAdmins from './AdminAdmins';
import AdminCreate from './admins/AdminCreate';
import AdminProfilePage from './admins/AdminProfile';
import AdminAuditLog from './admins/AdminAuditLog';

// Placeholder simple cards used by routes
const Placeholder = ({title,children}:{title:string;children?:React.ReactNode}) => (
  <div className="p-6"><h1 className="text-xl font-semibold mb-4 text-[var(--text-primary,#503246)]">{title}</h1><div className="rounded-xl bg-[var(--color-surface)] p-6 text-[14px] text-[var(--muted-color,#8B6678)]" style={{boxShadow:'var(--elev-1)'}}>{children||'...'}</div></div>
);

const AdminDashboard: React.FC = () => {
  const [sidebarCollapsed,setSidebarCollapsed] = useState(false); // desktop collapse
  const { t } = useTranslation();
  const nav = adminNavSpec.sidebar;
  const { data, loading, error, refresh } = useDashboardData();
  return (
    <AdminLayout
  sidebar={<AdminSidebar nav={nav} open={true} collapsed={sidebarCollapsed} />}
  header={<AdminHeader onToggleSidebar={()=>setSidebarCollapsed(c=>!c)} sidebarOpen={!sidebarCollapsed} />}
    >
      <Routes>
        <Route index element={
          <AdminPage title={t('admin.dashboard')}>
            {loading && <div className="text-sm text-[var(--muted-color)]">{t('common.loading')}</div>}
            {error && <div className="text-sm text-red-600">{t('common.error','Error')}: {error} <button onClick={refresh} className="underline">{t('common.retry','Retry')}</button></div>}
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
  <Route path="distributors" element={<AdminDistributors />} />
  <Route path="distributors/new" element={<AdminDistributorCreate />} />
  <Route path="distributors/:id" element={<AdminDistributorProfile />} />
  <Route path="producers" element={<AdminSuppliers />} />
  <Route path="producers/new" element={<AdminSupplierCreate />} />
  <Route path="producers/:id" element={<AdminSupplierProfile />} />
  <Route path="beneficiaries" element={<BeneficiariesManagement />} />
  <Route path="finances" element={<Placeholder title={t('admin.finances')} />} />
  <Route path="donors" element={<AdminDonors />} />
  <Route path="donors/:id" element={<AdminDonorProfile />} />
  <Route path="blog" element={<AdminBlog />} />
  <Route path="blog/new" element={<AdminBlogEditor />} />
  <Route path="blog/:slug/edit" element={<AdminBlogEditor />} />
  <Route path="elearning" element={<AdminELearning />} />
  <Route path="elearning/lessons/new" element={<AdminLessonEditor />} />
  <Route path="elearning/lessons/:slug/edit" element={<AdminLessonEditor />} />
  <Route path="resources" element={<AdminResources />} />
  <Route path="research" element={<Placeholder title={t('admin.research')} />} />
  <Route path="settings" element={<AdminSettings />} />
  <Route path="settings/access" element={<AdminAdmins />} />
  <Route path="settings/access/audit" element={<AdminAuditLog />} />
  <Route path="settings/access/new" element={<AdminCreate />} />
  <Route path="settings/access/:id" element={<AdminProfilePage />} />
  <Route path="team" element={<AdminTeam />} />
  <Route path="team/new" element={<TeamCreate />} />
  <Route path="team/:id" element={<TeamProfile />} />
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
