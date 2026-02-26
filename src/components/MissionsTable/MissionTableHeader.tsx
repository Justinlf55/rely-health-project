import type { SortKey, SortState } from '../../types/mission';
import { SortDirection } from '../../constants';
import styles from './MissionsTable.module.css';

const COLUMNS: { key: SortKey; label: string; width: string; className?: string }[] = [
  { key: 'Date', label: 'Date', width: '10%' },
  { key: 'Company', label: 'Company', width: '13%' },
  { key: 'Mission', label: 'Mission', width: '22%' },
  { key: 'Rocket', label: 'Rocket', width: '13%', className: styles.colRocket },
  { key: 'Location', label: 'Location', width: '18%' },
  { key: 'MissionStatus', label: 'Status', width: '12%' },
  { key: 'RocketStatus', label: 'Rocket Status', width: '12%', className: styles.colRocketStatus },
];

interface MissionTableHeaderProps {
  sortState: SortState;
  onSort: (key: SortKey) => void;
}

const MissionTableHeader = ({ sortState, onSort }: MissionTableHeaderProps) => {
  const ariaSortFor = (key: SortKey): 'ascending' | 'descending' | 'none' => {
    if (sortState.key !== key) return 'none';
    return sortState.direction === SortDirection.Asc ? 'ascending' : 'descending';
  };

  const ariaLabelFor = (key: SortKey, label: string): string => {
    if (sortState.key !== key) return `${label}, activate to sort`;
    return sortState.direction === SortDirection.Asc
      ? `${label}, sorted ascending, activate to sort descending`
      : `${label}, sorted descending, activate to sort ascending`;
  };

  const sortIndicator = (key: SortKey) => {
    if (sortState.key !== key)
      return <span className={styles.sortIcon} aria-hidden="true">↕</span>;
    return (
      <span className={styles.sortIcon} aria-hidden="true">
        {sortState.direction === SortDirection.Asc ? '↑' : '↓'}
      </span>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, key: SortKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSort(key);
    }
  };

  return (
    <thead>
      <tr>
        {COLUMNS.map(({ key, label, width, className }) => (
          <th
            key={key}
            scope="col"
            style={{ width }}
            className={`${styles.th}${className ? ` ${className}` : ''}`}
            onClick={() => onSort(key)}
            onKeyDown={(e) => handleKeyDown(e, key)}
            tabIndex={0}
            aria-sort={ariaSortFor(key)}
            aria-label={ariaLabelFor(key, label)}
          >
            {label} {sortIndicator(key)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default MissionTableHeader;
