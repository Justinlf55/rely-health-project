import { memo } from 'react';
import styles from './SummaryCards.module.css';

interface Props {
  label: string;
  value: string;
  icon: string;
  accent?: 'success' | 'warning' | 'danger';
  small?: boolean;
}

const StatCard = memo(({ label, value, icon, accent, small }: Props) => (
  <div className={styles.card}>
    <span className={styles.icon}>{icon}</span>
    <div className={styles.content}>
      <span className={styles.label}>{label}</span>
      <span
        className={`${styles.value} ${small ? styles.valueSmall : ''} ${accent ? styles[accent] : ''}`}
      >
        {value}
      </span>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

export default StatCard;
