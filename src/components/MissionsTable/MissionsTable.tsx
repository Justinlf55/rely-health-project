import { useEffect, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useFilteredMissions } from '../../hooks/useFilteredMissions';
import type { SortKey } from '../../types/mission';
import styles from './MissionsTable.module.css';

const PAGE_SIZE = 50;

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'Date', label: 'Date' },
  { key: 'Company', label: 'Company' },
  { key: 'Mission', label: 'Mission' },
  { key: 'Rocket', label: 'Rocket' },
  { key: 'Location', label: 'Location' },
  { key: 'MissionStatus', label: 'Status' },
  { key: 'RocketStatus', label: 'Rocket Status' },
];

const statusClass = (status: string): string => {
  if (status === 'Success') return styles.success;
  if (status === 'Failure') return styles.failure;
  if (status === 'Partial Failure') return styles.partial;
  if (status === 'Prelaunch Failure') return styles.prelaunch;
  return '';
};

const MissionsTable = () => {
  const { sortState, setSort } = useDashboard();
  const missions = useFilteredMissions();
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [missions]);

  const totalPages = Math.ceil(missions.length / PAGE_SIZE);
  const pageData = missions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortState.key === key) {
      setSort({ key, direction: sortState.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ key, direction: 'asc' });
    }
    setPage(0);
  };

  const sortIndicator = (key: SortKey) => {
    if (sortState.key !== key) return <span className={styles.sortIcon}>↕</span>;
    return <span className={styles.sortIcon}>{sortState.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Missions</h2>
        <span className={styles.count}>{missions.length.toLocaleString()} results</span>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map(({ key, label }) => (
                <th
                  key={key}
                  className={styles.th}
                  onClick={() => handleSort(key)}
                >
                  {label} {sortIndicator(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((m, i) => (
              <tr key={`${m.Date}-${m.Mission}-${i}`} className={styles.tr}>
                <td className={styles.td}>{m.Date}</td>
                <td className={styles.td}>{m.Company}</td>
                <td className={styles.td}>{m.Mission}</td>
                <td className={styles.td}>{m.Rocket}</td>
                <td className={`${styles.td} ${styles.location}`}>{m.Location}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${statusClass(m.MissionStatus)}`}>
                    {m.MissionStatus}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={m.RocketStatus === 'Active' ? styles.active : styles.retired}>
                    {m.RocketStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 0}
            onClick={() => setPage(0)}
          >
            «
          </button>
          <button
            className={styles.pageBtn}
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ‹
          </button>
          <span className={styles.pageInfo}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            ›
          </button>
          <button
            className={styles.pageBtn}
            disabled={page === totalPages - 1}
            onClick={() => setPage(totalPages - 1)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default MissionsTable;
