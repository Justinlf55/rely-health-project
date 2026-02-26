import { memo, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useFilteredMissions } from '../../hooks/useFilteredMissions';
import styles from './Chart.module.css';

const CHART_MARGIN = { top: 8, right: 8, left: 0, bottom: 0 };
const TOOLTIP_CONTENT_STYLE = {
  background: '#21262d',
  border: '1px solid #30363d',
  borderRadius: 6,
  color: '#e6edf3',
  fontSize: 12,
};
const TOOLTIP_CURSOR = { fill: 'rgba(88,166,255,0.08)' };

interface Props {
  expanded?: boolean;
}

const MissionsPerYearChart = memo(({ expanded = false }: Props) => {
  const missions = useFilteredMissions();

  const data = useMemo(() => {
    const counts = new Map<number, number>();
    for (const m of missions) {
      const year = parseInt(m.Date.slice(0, 4), 10);
      if (!isNaN(year)) counts.set(year, (counts.get(year) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(([a], [b]) => a - b)
      .map(([year, count]) => ({ year: String(year), count }));
  }, [missions]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Missions Per Year</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.8)" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#8b949e', fontSize: 11 }}
            tickLine={false}
            interval={expanded ? 2 : 9}
          />
          <YAxis
            tick={{ fill: '#8b949e', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            cursor={TOOLTIP_CURSOR}
          />
          <Bar
            dataKey="count"
            fill="#58a6ff"
            radius={[3, 3, 0, 0]}
            name="Missions"
            maxBarSize={expanded ? 18 : undefined}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

MissionsPerYearChart.displayName = 'MissionsPerYearChart';

export default MissionsPerYearChart;
