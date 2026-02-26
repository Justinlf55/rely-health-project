import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => (
  <div className={styles.container}>
    <div className={styles.spinner} />
    <p className={styles.label}>Loading mission data…</p>
  </div>
);

export default LoadingSpinner;
