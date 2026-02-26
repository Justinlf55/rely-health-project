import { useEffect, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useFilteredMissions } from '../../hooks/useFilteredMissions';
import type { SortKey } from '../../types/mission';
import { SortDirection } from '../../constants';
import { Card } from '../ui';
import MissionTableHeader from './MissionTableHeader';
import MissionTableRow from './MissionTableRow';
import MissionTablePagination from './MissionTablePagination';
import styles from './MissionsTable.module.css';

const PAGE_SIZE = 50;

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
    setSort({
      key,
      direction:
        sortState.key === key && sortState.direction === SortDirection.Asc
          ? SortDirection.Desc
          : SortDirection.Asc,
    });
    setPage(0);
  };

  return (
    <Card className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Missions</h2>
        <span className={styles.count}>{missions.length.toLocaleString()} results</span>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <caption className="sr-only">Space missions — {missions.length} results</caption>
          <MissionTableHeader sortState={sortState} onSort={handleSort} />
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  No missions match your filters.
                </td>
              </tr>
            ) : (
              pageData.map((m) => (
                <MissionTableRow key={`${m.Date}-${m.Company}-${m.Mission}-${m.Rocket}`} mission={m} />
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <MissionTablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </Card>
  );
};

export default MissionsTable;
