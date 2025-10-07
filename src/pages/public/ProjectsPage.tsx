import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { mockProjects } from '../../data/mockData';
import PublicPageShell from '../../components/layout/PublicPageShell';
import ProjectCard from '../../components/ProjectCard';
import { pickCourseImage } from '../../data/courseImages';

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(6);

  // Augment projects with deterministic cover image (does not mutate source array)
  const enriched = useMemo(()=> mockProjects.map((p,idx)=> ({ ...p, thumbnail: pickCourseImage(idx) })), []);

  const filteredProjects = useMemo(()=> enriched.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || project.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  }), [searchTerm, selectedType, selectedStatus, enriched]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const paginated = filteredProjects.slice((page-1)*pageSize, page*pageSize);

  // Reset page when filters/search change
  React.useEffect(()=> { setPage(1); }, [searchTerm, selectedType, selectedStatus, pageSize]);

  // Removed badge color helpers as new layout uses unified ProjectCard component.

  return (
  <PublicPageShell>
    {/* Header */}
    <header className="space-y-2 mb-8 text-left">
      <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">{t('nav.projects')}</h1>
      <p className="text-[14px] leading-[20px] text-secondary">{t('projectsPage.headerSubtitle','Discover and support our ongoing projects that make a real difference.')}</p>
    </header>
    {/* Filters */}
    <section className="sticky top-[84px] z-30 mb-10">
      <div className="rounded-2xl bg-white border border-base p-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[240px]">
          <Input
            placeholder={`${t('common.search')} projects...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 rounded-full border border-base"
          />
        </div>
        <select value={selectedType} onChange={(e)=> setSelectedType(e.target.value)} className="h-10 px-3 rounded-full border border-base bg-white text-[13px]">
          <option value="all">{t('projectsPage.filters.allTypes','All Types')}</option>
          <option value="distribution">{t('projectsPage.filters.distribution','Distribution')}</option>
          <option value="training">{t('projectsPage.filters.training','Training')}</option>
          <option value="research">{t('projectsPage.filters.research','Research')}</option>
        </select>
        <select value={selectedStatus} onChange={(e)=> setSelectedStatus(e.target.value)} className="h-10 px-3 rounded-full border border-base bg-white text-[13px]">
          <option value="all">{t('projectsPage.filters.allStatus','All Status')}</option>
          <option value="active">{t('projectsPage.filters.active','Active')}</option>
          <option value="draft">{t('projectsPage.filters.draft','Draft')}</option>
          <option value="completed">{t('projectsPage.filters.completed','Completed')}</option>
        </select>
        {(searchTerm||selectedType!=='all'||selectedStatus!=='all'||page!==1) && (
          <button onClick={()=> { setSearchTerm(''); setSelectedType('all'); setSelectedStatus('all'); setPage(1); }} className="h-10 px-4 rounded-full border border-base bg-white text-[12px]">{t('blog.toolbar.reset','Reset')}</button>
        )}
      </div>
    </section>
    {/* Grid */}
    <section>
  <div className="mb-2 text-[12px]" style={{color:'var(--slate-600)'}}>{t('projectsPage.showing','Showing')} {paginated.length} {t('projectsPage.of','of')} {filteredProjects.length} {t('projectsPage.filteredProjects','filtered projects')} ({mockProjects.length} {t('projectsPage.total','total')})</div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginated.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
      {filteredProjects.length===0 && <div className="text-center py-16 text-[14px]" style={{color:'var(--slate-600)'}}>{t('projectsPage.none.empty','No projects.')} <button className="underline" onClick={()=>{setSearchTerm('');setSelectedType('all');setSelectedStatus('all')}}>{t('projectsPage.none.reset','Reset filters')}</button>.</div>}
      {filteredProjects.length>0 && (
        <nav className="mt-6 flex items-center justify-between text-[12px] flex-wrap gap-4" aria-label="Pagination">
          <div className="flex items-center gap-2">{t('projectsPage.pagination.rows','Rows:')}
            <select value={pageSize} onChange={e=> { setPageSize(Number(e.target.value)); }} className="h-8 px-2 rounded-full border border-base bg-white">
              {[6,9,12,15].map(sz=> <option key={sz} value={sz}>{sz}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Previous page" onClick={()=> setPage(p=> Math.max(1,p-1))} disabled={page===1} className="h-8 px-3 rounded-full transition-colors border border-base bg-[var(--color-primary-light)] text-primary disabled:opacity-40 disabled:cursor-not-allowed">{t('projectsPage.pagination.prev','Prev')}</button>
            {Array.from({length: totalPages}).slice(0,5).map((_,i)=> { const n=i+1; const active=n===page; return (
              <button key={n} aria-current={active?'page':undefined} onClick={()=> setPage(n)} className={`w-8 h-8 rounded-full text-[12px] border border-base ${active? 'bg-primary text-white':'bg-[var(--color-primary-light)] text-primary hover:brightness-95'}`}>{n}</button>
            );})}
            <button aria-label="Next page" onClick={()=> setPage(p=> Math.min(totalPages,p+1))} disabled={page===totalPages} className="h-8 px-3 rounded-full transition-colors border border-base bg-[var(--color-primary-light)] text-primary disabled:opacity-40 disabled:cursor-not-allowed">{t('projectsPage.pagination.next','Next')}</button>
          </div>
        </nav>
      )}
    </section>
  </PublicPageShell>
  );
};

export default ProjectsPage;
