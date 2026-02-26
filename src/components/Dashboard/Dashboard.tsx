import { useMemo } from 'react';
import FilterBar from '../FilterBar/FilterBar';
import SummaryCards from '../SummaryCards/SummaryCards';
import MissionsPerYearChart from '../charts/MissionsPerYearChart';
import MissionStatusChart from '../charts/MissionStatusChart';
import TopCompaniesChart from '../charts/TopCompaniesChart';
import MissionsTable from '../MissionsTable/MissionsTable';
import { useDashboard } from '../../context/DashboardContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { allMissions } = useDashboard();

  const subtitle = useMemo(() => {
    if (!allMissions.length) return '';
    const years = allMissions
      .map((m) => parseInt(m.Date.slice(0, 4), 10))
      .filter((y) => !isNaN(y));
    if (years.length === 0) return '';
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    return `${allMissions.length.toLocaleString()} missions · ${minYear} – ${maxYear}`;
  }, [allMissions]);

  return (
    <main id="main-content" className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <span aria-hidden="true">🚀 </span>Space Missions Dashboard
        </h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </header>

      <section aria-label="Filters" className={styles.filterSection}>
        <FilterBar />
      </section>

      <section aria-label="Summary statistics" className={styles.cardsSection}>
        <SummaryCards />
      </section>

      <section aria-label="Charts" className={styles.chartsSection}>
        <MissionsPerYearChart />
        <MissionStatusChart />
        <TopCompaniesChart />
      </section>

      <section aria-label="Missions table" className={styles.tableSection}>
        <MissionsTable />
      </section>
    </main>
  );
};

export default Dashboard;
