import { memo, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useFilteredMissions } from '../../hooks/useFilteredMissions';
import { getTopCompaniesByMissionCount } from '../../data/analytics';
import { Card } from '../ui';
import styles from './Chart.module.css';
import { TOOLTIP_CONTENT_STYLE, TOOLTIP_CURSOR, AXIS_TICK_STYLE } from './chartConfig';

const GRADIENT_COLORS = [
  '#58a6ff', '#4d9ef0', '#4396e0', '#388ed0', '#2d86c1',
  '#237eb1', '#1876a1', '#0e6e92', '#036682', '#005e72',
];

const CHART_MARGIN = { top: 4, right: 16, left: 4, bottom: 4 };

const TopCompaniesChart = memo(() => {
  const missions = useFilteredMissions();

  const data = useMemo(() =>
    getTopCompaniesByMissionCount(missions, 10).map(([name, count]) => ({ name, count })),
    [missions],
  );

  const topCompany = data[0];

  return (
    <Card as="section" aria-label="Top companies chart" className={styles.card}>
      <h3 className={styles.title}>Top Companies</h3>
      <p className="sr-only">
        Horizontal bar chart showing top companies by mission count.
        {topCompany ? ` Leading: ${topCompany.name} with ${topCompany.count} missions.` : ''}
        {data.map((d) => `${d.name}: ${d.count}`).join(', ')}.
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={data}
          margin={CHART_MARGIN}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.8)" horizontal={false} />
          <XAxis
            type="number"
            tick={AXIS_TICK_STYLE}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={AXIS_TICK_STYLE}
            tickLine={false}
            width={100}
          />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            cursor={TOOLTIP_CURSOR}
            itemStyle={{ color: '#58a6ff' }}
          />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} name="Missions">
            {data.map((_, i) => (
              <Cell key={i} fill={GRADIENT_COLORS[i] ?? '#58a6ff'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
});

TopCompaniesChart.displayName = 'TopCompaniesChart';

export default TopCompaniesChart;
