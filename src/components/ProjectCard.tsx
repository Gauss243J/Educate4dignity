import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { ImageWithFallback } from './ui/ImageWithFallback';

interface ProjectCardProps {
  project: Project;
  onSupport?: (p: Project) => void;
  compact?: boolean;
  disableImages?: boolean; // economy
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSupport, compact, disableImages }) => {
  const { t } = useTranslation();
  const pct = Math.min(100, Math.round((project.raised / project.budget) * 100) || 0);
  const cta = compact ? t('projectCard.supportCta') : t('projectCard.supportCtaLong');
  return (
    <div className={`rounded-lg border flex flex-col ${compact ? 'p-3' : 'p-4'} bg-white`} style={{borderColor:'var(--rose-200)'}}>
      <div className={`${compact ? 'h-32' : 'h-40'} mb-3 rounded-md border overflow-hidden flex items-center justify-center`} style={{borderColor:'var(--rose-200)',background:'var(--rose-100)'}}>
        {project.thumbnail ? (
          <ImageWithFallback src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" disable={disableImages} />
        ) : (
          <span className="text-[11px] text-[var(--slate-500)]">No cover</span>
        )}
      </div>
      <div className="text-[11px] mb-1" style={{color:'var(--slate-500)'}}>{project.location}</div>
      <div className="font-bold text-sm mb-1" style={{color:'var(--slate-900)'}}>{project.title}</div>
      <div className="text-[11px] mb-3" style={{color:'var(--slate-600)'}}>{pct}% funded • {project.raised.toLocaleString()} / {project.budget.toLocaleString()}</div>
      <div className="w-full bg-[var(--rose-50)] rounded h-1 mb-3 overflow-hidden">
        <div className="h-full bg-[var(--rose-500)]" style={{width: pct + '%'}} />
      </div>
  <Link to="/donate" className="btn-outline-rose w-full text-sm text-center" onClick={()=>onSupport?.(project)}>{cta}</Link>
    </div>
  );
};

export default ProjectCard;
