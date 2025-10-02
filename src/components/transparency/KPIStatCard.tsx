import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface KPIStatCardProps {
  label: string;
  value: string | number;
  accent?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  hint?: string;
  compact?: boolean; // economy mode
}

const accentClass: Record<NonNullable<KPIStatCardProps['accent']>, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  neutral: 'text-text-primary'
};

export const KPIStatCard: React.FC<KPIStatCardProps> = ({ label, value, accent = 'neutral', hint, compact = false }) => {
  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow ${compact ? 'text-xs' : ''}`}>
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className={`text-sm text-text-secondary mb-1 ${compact ? 'text-[11px]' : ''}`}>{label}</div>
        <div className={`font-semibold ${accentClass[accent]} ${compact ? 'text-lg' : 'text-2xl'}`}>{value}</div>
        {hint && <div className={`text-text-tertiary mt-1 ${compact ? 'text-[10px]' : 'text-xs'}`}>{hint}</div>}
      </CardContent>
    </Card>
  );
};

export default KPIStatCard;
