import React from 'react';

// Simple shimmering skeleton blocks for page loading
const shimmer = 'relative overflow-hidden bg-[var(--color-bg-alt,#f5f5f5)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

// Add keyframes via inline style (could move to global CSS if desired)
export const PageSkeleton: React.FC<{lines?: number; withHeader?: boolean}> = ({ lines = 6, withHeader = true }) => {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-10 animate-fade-in">
      {withHeader && (
        <div className="mb-10 space-y-3">
          <div className={`h-8 w-2/3 rounded-md ${shimmer}`}></div>
          <div className={`h-4 w-1/2 rounded-md ${shimmer}`}></div>
        </div>
      )}
      <div className="space-y-4">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`h-4 w-${(i % 3 === 0) ? '11/12' : (i % 3 === 1 ? '9/12' : '10/12')} rounded-md ${shimmer}`}></div>
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;
