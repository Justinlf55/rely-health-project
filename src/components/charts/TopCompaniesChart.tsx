import { memo, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useFilteredMissions } from '../../hooks/useFilteredMissions';
import { getTopCompaniesByMissionCount } from '../../data/analytics';
import styles from './Chart.module.css';

const GRADIENT_COLORS = [
  '#58a6ff', '#4d9ef0', '#4396e0', '#388ed0', '#2d86c1',
  '#237eb1', '#1876a1', '#0e6e92', '#036682', '#005e72',
];

const CHART_MARGIN = { top: 4, right: 16, left: 4, bottom: 4 };
const TOOLTIP_CONTENT_STYLE = {
  background: '#21262d',
  border: '1px solid #30363d',
  borderRadius: 6,
  color: '#e6edf3',
  fontSize: 12,
};
const TOOLTIP_CURSOR = { fill: 'rgba(88,166,255,0.08)' };

const TopCompaniesChart = memo(() => {
  const missions = useFilteredMissions();

  const data = useMemo(() =>
    getTopCompaniesByMissionCount(missions, 10).map(([name, count]) => ({ name, count })),
    [missions],
  );

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Top Companies</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={data}
          margin={CHART_MARGIN}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.8)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#8b949e', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#8b949e', fontSize: 11 }}
            tickLine={false}
            width={100}
          />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            cursor={TOOLTIP_CURSOR}
          />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} name="Missions">
            {data.map((_, i) => (
              <Cell key={i} fill={GRADIENT_COLORS[i] ?? '#58a6ff'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

TopCompaniesChart.displayName = 'TopCompaniesChart';

export default TopCompaniesChart;
