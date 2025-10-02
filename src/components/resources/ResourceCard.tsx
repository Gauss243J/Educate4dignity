import React from 'react';
import { Resource } from '../../utils/resourceApi';
import { ImageWithFallback } from '../ui/ImageWithFallback';

interface ResourceCardProps { resource: Resource; onDownload?: (r:Resource)=>void; onPreview?: (r:Resource)=>void; }

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDownload, onPreview }) => {
  return (
    <article role="article" className="group relative flex flex-col border rounded-lg bg-white h-[280px] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--rose-400)]" style={{borderColor:'var(--rose-200)'}}>
      <div className="relative h-28 w-full border-b flex items-center justify-center bg-[var(--rose-50)] overflow-hidden" style={{borderColor:'var(--rose-200)'}}>
        {resource.image ? (
          <ImageWithFallback src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[11px] text-[var(--slate-500)]">No cover</span>
        )}
        <span className="absolute top-1 right-1 text-[10px] px-2 py-[2px] rounded-full bg-[var(--rose-600)] text-white uppercase tracking-wide">{resource.type}</span>
      </div>
      <div className="flex-1 flex flex-col p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1" style={{color:'var(--slate-900)'}}>{resource.title}</h3>
        <p className="text-[11px] line-clamp-2 mb-2" style={{color:'var(--slate-600)'}}>{resource.description}</p>
        <div className="mt-auto">
          <div className="flex justify-between items-center text-[10px] mb-2" style={{color:'var(--slate-500)'}}>
            <span>⬇ {resource.downloads}</span>
            <span>{resource.year}</span>
            <span>{resource.size}</span>
          </div>
          <div className="flex gap-2">
            <button aria-label={`Download ${resource.title}`} onClick={()=>onDownload?.(resource)} className="btn-rose flex-1 text-xs py-1">Download</button>
            <button aria-label={`Preview ${resource.title}`} onClick={()=>onPreview?.(resource)} className="btn-outline-rose flex-1 text-xs py-1">Preview</button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResourceCard;
