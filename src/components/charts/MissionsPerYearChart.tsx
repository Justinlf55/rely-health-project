import { memo, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useFilteredMissions } from '../../hooks/useFilteredMissions';
import { Card } from '../ui';
import styles from './Chart.module.css';
import { TOOLTIP_CONTENT_STYLE, TOOLTIP_CURSOR, AXIS_TICK_STYLE } from './chartConfig';

const CHART_MARGIN = { top: 8, right: 8, left: 0, bottom: 0 };

const MissionsPerYearChart = memo(() => {
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

  const totalMissions = data.reduce((s, d) => s + d.count, 0);
  const peakYear = data.reduce((best, d) => d.count > best.count ? d : best, { year: '—', count: 0 });

  return (
    <Card as="section" aria-label="Missions per year chart" className={styles.card}>
      <h3 className={styles.title}>Missions Per Year</h3>
      <p className="sr-only">
        Bar chart showing missions per year. Total: {totalMissions} missions.
        Peak year: {peakYear.year} with {peakYear.count} missions.
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.8)" />
          <XAxis
            dataKey="year"
            tick={AXIS_TICK_STYLE}
            tickLine={false}
            interval={9}
          />
          <YAxis
            tick={AXIS_TICK_STYLE}
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
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
});

MissionsPerYearChart.displayName = 'MissionsPerYearChart';

export default MissionsPerYearChart;
