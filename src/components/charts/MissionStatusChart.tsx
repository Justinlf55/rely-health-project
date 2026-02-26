import { memo, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFilteredMissions } from '../../hooks/useFilteredMissions';
import { getMissionStatusCount } from '../../data/analytics';
import { Card } from '../ui';
import styles from './Chart.module.css';
import { TOOLTIP_CONTENT_STYLE, LEGEND_WRAPPER_STYLE } from './chartConfig';

const COLORS: Record<string, string> = {
  'Success': '#3fb950',
  'Failure': '#f85149',
  'Partial Failure': '#a371f7',
  'Prelaunch Failure': '#d29922',
};

const MissionStatusChart = memo(() => {
  const missions = useFilteredMissions();

  const { data, successRate } = useMemo(() => {
    const counts = getMissionStatusCount(missions);
    const total = missions.length;
    const chartData = Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
    const rate = total > 0 ? ((counts['Success'] / total) * 100).toFixed(1) : '0.0';
    return { data: chartData, successRate: rate };
  }, [missions]);

  const renderCenterLabel = () => (
    <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-10" fontSize={22} fontWeight={700} fill="#e6edf3">
        {successRate}%
      </tspan>
      <tspan x="50%" dy={20} fontSize={11} fill="#8b949e">
        success
      </tspan>
    </text>
  );

  return (
    <Card as="section" aria-label="Mission status chart" className={styles.card}>
      <h3 className={styles.title}>Mission Status</h3>
      <p className="sr-only">
        Donut chart showing mission status breakdown. Success rate: {successRate}%.
        {data.map((d) => `${d.name}: ${d.value}`).join(', ')}.
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] ?? '#8b949e'} />
            ))}
            {renderCenterLabel()}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_CONTENT_STYLE} itemStyle={{ color: '#ffffff' }} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={LEGEND_WRAPPER_STYLE}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
});

MissionStatusChart.displayName = 'MissionStatusChart';

export default MissionStatusChart;
