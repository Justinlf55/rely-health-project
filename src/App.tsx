import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Dashboard from './components/Dashboard/Dashboard';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';

const AppContent = () => {
  const { isLoading, error } = useDashboard();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} />;
  return <Dashboard />;
};

const App = () => (
  <DashboardProvider>
    <AppContent />
  </DashboardProvider>
);

export default App;
