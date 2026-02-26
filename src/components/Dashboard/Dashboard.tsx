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
  const { filterState, allMissions } = useDashboard();

  const subtitle = useMemo(() => {
    if (!allMissions.length) return '';
    const years = allMissions
      .map((m) => parseInt(m.Date.slice(0, 4), 10))
      .filter((y) => !isNaN(y));
    const minYear = years.reduce((a, b) => Math.min(a, b));
    const maxYear = years.reduce((a, b) => Math.max(a, b));
    return `${allMissions.length.toLocaleString()} missions · ${minYear} – ${maxYear}`;
  }, [allMissions]);
  const showTopCompanies = filterState.companies.length !== 1;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>🚀 Space Missions Dashboard</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </header>

      <section className={styles.filterSection}>
        <FilterBar />
      </section>

      <section className={styles.cardsSection}>
        <SummaryCards />
      </section>

      <section className={styles.chartsSection}>
        <div className={showTopCompanies ? undefined : styles.chartSpan2}>
          <MissionsPerYearChart expanded={!showTopCompanies} />
        </div>
        <MissionStatusChart />
        {showTopCompanies && <TopCompaniesChart />}
      </section>

      <section className={styles.tableSection}>
        <MissionsTable />
      </section>
    </div>
  );
};

export default Dashboard;
