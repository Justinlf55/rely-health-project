import styles from './ErrorBanner.module.css';

interface ErrorBannerProps {
  message: string;
}

const ErrorBanner = ({ message }: ErrorBannerProps) => (
  <div
    className={styles.banner}
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <strong>Error:</strong> {message}
  </div>
);

export default ErrorBanner;
