import { Button } from '../ui';
import styles from './MissionsTable.module.css';

interface MissionTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MissionTablePagination = ({ page, totalPages, onPageChange }: MissionTablePaginationProps) => (
  <div className={styles.pagination} role="navigation" aria-label="Table pagination">
    <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => onPageChange(0)} aria-label="First page">
      «
    </Button>
    <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
      ‹
    </Button>
    <span className={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
    <Button variant="secondary" size="sm" disabled={page === totalPages - 1} onClick={() => onPageChange(page + 1)} aria-label="Next page">
      ›
    </Button>
    <Button variant="secondary" size="sm" disabled={page === totalPages - 1} onClick={() => onPageChange(totalPages - 1)} aria-label="Last page">
      »
    </Button>
    <div aria-live="polite" className="sr-only">
      Page {page + 1} of {totalPages}
    </div>
  </div>
);

export default MissionTablePagination;
