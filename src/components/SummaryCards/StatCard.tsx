import { memo } from 'react';
import { Card } from '../ui';
import styles from './SummaryCards.module.css';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  accent?: 'success' | 'warning' | 'danger';
  small?: boolean;
}

const StatCard = memo(({ label, value, icon, accent, small }: StatCardProps) => (
  <Card as="article" className={styles.card} aria-label={`${label}: ${value}`}>
    <span className={styles.icon} aria-hidden="true">{icon}</span>
    <div className={styles.content}>
      <span className={styles.label}>{label}</span>
      <span
        className={`${styles.value} ${small ? styles.valueSmall : ''} ${accent ? styles[accent] : ''}`}
      >
        {value}
      </span>
    </div>
  </Card>
));

StatCard.displayName = 'StatCard';

export default StatCard;
