import { useMemo } from 'react';
import { useFilteredMissions } from '../../hooks/useFilteredMissions';
import { getMissionStatusCount, getMostUsedRocket, getAverageMissionsPerYear } from '../../data/analytics';
import { formatNumber, formatPercent } from '../../utils/formatters';
import StatCard from './StatCard';
import styles from './SummaryCards.module.css';

const SummaryCards = () => {
  const filtered = useFilteredMissions();

  const stats = useMemo(() => {
    const statusCounts = getMissionStatusCount(filtered);
    const total = filtered.length;
    const successRate = total > 0 ? (statusCounts['Success'] / total) * 100 : 0;
    const topRocket = getMostUsedRocket(filtered);
    const activeRockets = new Set(
      filtered.filter((m) => m.RocketStatus === 'Active').map((m) => m.Rocket),
    ).size;

    let avgPerYear = 0;
    if (filtered.length > 0) {
      const yearNums = filtered
        .map((m) => parseInt(m.Date.slice(0, 4), 10))
        .filter((y) => !isNaN(y));
      if (yearNums.length > 0) {
        const minYear = yearNums.reduce((a, b) => Math.min(a, b));
        const maxYear = yearNums.reduce((a, b) => Math.max(a, b));
        avgPerYear = getAverageMissionsPerYear(filtered, minYear, maxYear);
      }
    }

    return { total, successRate, topRocket, activeRockets, avgPerYear };
  }, [filtered]);

  return (
    <div className={styles.grid}>
      <StatCard label="Total Missions" value={formatNumber(stats.total)} icon="🚀" />
      <StatCard label="Avg Missions / Year" value={String(stats.avgPerYear)} icon="📅" />
      <StatCard label="Success Rate" value={formatPercent(stats.successRate)} icon="✅" accent="success" />
      <StatCard label="Most Used Rocket" value={stats.topRocket || '—'} icon="🛸" small />
      <StatCard label="Active Rocket Types" value={formatNumber(stats.activeRockets)} icon="⚡" />
    </div>
  );
};

export default SummaryCards;
