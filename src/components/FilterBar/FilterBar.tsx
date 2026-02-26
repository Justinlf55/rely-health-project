import { useCallback, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import CompanyMultiSelect from './CompanyMultiSelect';
import { Button } from '../ui';
import { MissionStatus } from '../../constants';
import styles from './FilterBar.module.css';

const STATUS_OPTIONS = Object.values(MissionStatus);

const FilterBar = () => {
  const { allMissions, filterState, setFilter } = useDashboard();

  const companies = useMemo(() => {
    const set = new Set(allMissions.map((m) => m.Company));
    return [...set].sort();
  }, [allMissions]);

  const handleStatusToggle = useCallback(
    (status: string) => {
      const current = filterState.statuses;
      const next = current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status];
      setFilter({ statuses: next });
    },
    [filterState.statuses, setFilter],
  );

  const handleReset = useCallback(
    () => setFilter({ startDate: '', endDate: '', companies: [], statuses: [] }),
    [setFilter],
  );

  return (
    <div className={styles.bar}>
      <div className={styles.dateRange}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="startDate">From</label>
          <input
            id="startDate"
            type="date"
            className={styles.input}
            value={filterState.startDate}
            onChange={(e) => setFilter({ startDate: e.target.value })}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="endDate">To</label>
          <input
            id="endDate"
            type="date"
            className={styles.input}
            value={filterState.endDate}
            onChange={(e) => setFilter({ endDate: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Company</span>
        <CompanyMultiSelect
          companies={companies}
          selected={filterState.companies}
          onChange={(next) => setFilter({ companies: next })}
        />
      </div>

      <fieldset className={`${styles.group} ${styles.fieldset}`}>
        <legend className={styles.label}>Status</legend>
        <div className={styles.checkboxGroup}>
          {STATUS_OPTIONS.map((status) => (
            <label key={status} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filterState.statuses.includes(status)}
                onChange={() => handleStatusToggle(status)}
              />
              {status}
            </label>
          ))}
        </div>
      </fieldset>

      <Button variant="secondary" size="md" className={styles.resetBtn} onClick={handleReset}>
        Reset Filters
      </Button>
    </div>
  );
};

export default FilterBar;
