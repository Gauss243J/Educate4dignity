import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { mockProjects } from '../../data/mockData';
import PublicNav from '../../components/layout/PublicNav';
import ProjectCard from '../../components/ProjectCard';

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || project.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Removed badge color helpers as new layout uses unified ProjectCard component.

  return (
  <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary-light to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              {t('nav.projects')}
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Discover and support our ongoing projects that make a real difference in communities worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder={`${t('common.search')} projects...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="distribution">Distribution</option>
                <option value="training">Training</option>
                <option value="research">Research</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid using unified ProjectCard */}
    <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 text-sm text-secondary">
            Showing {filteredProjects.length} of {mockProjects.length} projects
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 text-sm text-secondary">
              No projects found. <button className="underline" onClick={()=>{setSearchTerm('');setSelectedType('all');setSelectedStatus('all')}}>Reset filters</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
