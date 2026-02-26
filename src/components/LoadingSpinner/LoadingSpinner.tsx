import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => (
  <div
    className={styles.container}
    role="status"
    aria-label="Loading mission data"
    aria-live="polite"
    aria-atomic="true"
  >
    <div className={styles.spinner} aria-hidden="true" />
    <p className={styles.label} aria-hidden="true">Loading mission data…</p>
  </div>
);

export default LoadingSpinner;
