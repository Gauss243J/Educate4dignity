import React from 'react';

interface MonthlyDatum {
  month: string; // e.g. 'Jan'
  planned: number;
  collected: number;
  spent: number;
}

interface MonthlyBarChartMockProps {
  data: MonthlyDatum[];
  height?: number;
}

// Simple inline SVG bar groups for three series per month
export const MonthlyBarChartMock: React.FC<MonthlyBarChartMockProps> = ({ data, height = 180 }) => {
  const max = Math.max(...data.flatMap(d => [d.planned, d.collected, d.spent]), 1);
  const barGroupWidth = 48; // group width
  const seriesBarWidth = 10; // each bar width
  const gapBetweenGroups = 12;
  const chartWidth = data.length * (barGroupWidth + gapBetweenGroups);

  return (
    <div className="w-full overflow-x-auto">
      <svg width={chartWidth} height={height} role="img" aria-label="Monthly financial overview" className="select-none">
        {/* Axes baseline */}
        <line x1={0} y1={height - 20} x2={chartWidth} y2={height - 20} stroke="var(--color-border)" strokeWidth={1} />
        {data.map((d, i) => {
          const x0 = i * (barGroupWidth + gapBetweenGroups);
          const scale = (v: number) => (v / max) * (height - 40);
          const plannedH = scale(d.planned);
          const collectedH = scale(d.collected);
          const spentH = scale(d.spent);
          const yBase = height - 20;
          return (
            <g key={d.month} transform={`translate(${x0},0)`}>
              {/* Planned */}
              <rect x={4} y={yBase - plannedH} width={seriesBarWidth} height={plannedH} rx={2} className="fill-primary/60" />
              {/* Collected */}
              <rect x={4 + seriesBarWidth + 4} y={yBase - collectedH} width={seriesBarWidth} height={collectedH} rx={2} className="fill-success/70" />
              {/* Spent */}
              <rect x={4 + (seriesBarWidth + 4) * 2} y={yBase - spentH} width={seriesBarWidth} height={spentH} rx={2} className="fill-warning/80" />
              <text x={barGroupWidth / 2} y={height - 6} textAnchor="middle" className="fill-current text-[10px] font-medium" style={{ fontSize: 10 }}>
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary/60" /> Planned</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-success/70" /> Collected</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-warning/80" /> Spent</div>
      </div>
    </div>
  );
};

export default MonthlyBarChartMock;
