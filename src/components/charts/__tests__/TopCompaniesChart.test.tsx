import { render, screen, waitFor } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import { createElement } from 'react';
import { DashboardProvider } from '../../../context/DashboardContext';
import TopCompaniesChart from '../TopCompaniesChart';
import { MOCK_MISSIONS } from '../../../test/mockData';

const mockFetchMissions = vi.hoisted(() => vi.fn());

vi.mock('../../../data/loader', () => ({
  fetchMissions: mockFetchMissions,
}));

vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => null,
}));

describe('TopCompaniesChart', () => {
  beforeEach(() => {
    mockFetchMissions.mockResolvedValue(MOCK_MISSIONS);
  });

  it('renders with accessible section role and label', async () => {
    render(createElement(DashboardProvider, null, createElement(TopCompaniesChart)));
    await waitFor(() => {
      expect(screen.getByRole('region', { name: /Top companies chart/i })).toBeInTheDocument();
    });
  });

  it('renders the chart title', async () => {
    render(createElement(DashboardProvider, null, createElement(TopCompaniesChart)));
    await waitFor(() => {
      expect(screen.getByText('Top Companies')).toBeInTheDocument();
    });
  });

  it('renders sr-only description', async () => {
    render(createElement(DashboardProvider, null, createElement(TopCompaniesChart)));
    await waitFor(() => {
      expect(screen.getByText(/Horizontal bar chart showing top companies/i)).toBeInTheDocument();
    });
  });
});
