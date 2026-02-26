import { render, screen, waitFor } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import { createElement } from 'react';
import { DashboardProvider } from '../../../context/DashboardContext';
import MissionStatusChart from '../MissionStatusChart';
import { MOCK_MISSIONS } from '../../../test/mockData';

const mockFetchMissions = vi.hoisted(() => vi.fn());

vi.mock('../../../data/loader', () => ({
  fetchMissions: mockFetchMissions,
}));

vi.mock('recharts', () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('MissionStatusChart', () => {
  beforeEach(() => {
    mockFetchMissions.mockResolvedValue(MOCK_MISSIONS);
  });

  it('renders with accessible section role and label', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionStatusChart)));
    await waitFor(() => {
      expect(screen.getByRole('region', { name: /Mission status chart/i })).toBeInTheDocument();
    });
  });

  it('renders the chart title', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionStatusChart)));
    await waitFor(() => {
      expect(screen.getByText('Mission Status')).toBeInTheDocument();
    });
  });

  it('renders sr-only description with success rate', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionStatusChart)));
    await waitFor(() => {
      expect(screen.getByText(/Donut chart showing mission status breakdown/i)).toBeInTheDocument();
    });
  });
});
