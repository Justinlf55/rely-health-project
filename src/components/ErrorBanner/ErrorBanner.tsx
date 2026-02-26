import styles from './ErrorBanner.module.css';

interface Props {
  message: string;
}

const ErrorBanner = ({ message }: Props) => (
  <div className={styles.banner} role="alert">
    <strong>Error:</strong> {message}
  </div>
);

export default ErrorBanner;
