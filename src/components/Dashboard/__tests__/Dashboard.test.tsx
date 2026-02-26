import { render, screen, waitFor } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import { createElement } from 'react';
import { DashboardProvider } from '../../../context/DashboardContext';
import Dashboard from '../Dashboard';
import { MOCK_MISSIONS } from '../../../test/mockData';

const mockFetchMissions = vi.hoisted(() => vi.fn());

vi.mock('../../../data/loader', () => ({
  fetchMissions: mockFetchMissions,
}));

vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  Pie: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cell: () => null,
}));

describe('Dashboard', () => {
  beforeEach(() => {
    mockFetchMissions.mockResolvedValue(MOCK_MISSIONS);
  });

  it('renders the page header', async () => {
    render(createElement(DashboardProvider, null, createElement(Dashboard)));
    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  it('renders Filters section', async () => {
    render(createElement(DashboardProvider, null, createElement(Dashboard)));
    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Filters' })).toBeInTheDocument();
    });
  });

  it('renders Summary statistics section', async () => {
    render(createElement(DashboardProvider, null, createElement(Dashboard)));
    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Summary statistics' })).toBeInTheDocument();
    });
  });

  it('renders Charts section', async () => {
    render(createElement(DashboardProvider, null, createElement(Dashboard)));
    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Charts' })).toBeInTheDocument();
    });
  });

  it('renders Missions table section', async () => {
    render(createElement(DashboardProvider, null, createElement(Dashboard)));
    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Missions table' })).toBeInTheDocument();
    });
  });

  it('renders page title', async () => {
    render(createElement(DashboardProvider, null, createElement(Dashboard)));
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
