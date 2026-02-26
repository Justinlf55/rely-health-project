import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../../App';

const mockFetchMissions = vi.hoisted(() => vi.fn());

vi.mock('../../data/loader', () => ({
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

describe('App', () => {
  it('shows loading spinner initially', () => {
    mockFetchMissions.mockReturnValue(new Promise(() => {})); // never resolves
    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error banner when fetch fails', async () => {
    mockFetchMissions.mockRejectedValue(new Error('Network error'));
    render(<App />);
    await screen.findByRole('alert');
    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it('shows dashboard when data loads', async () => {
    mockFetchMissions.mockResolvedValue([{
      Company: 'SpaceX', Location: 'Cape', Date: '2020-01-01', Time: '00:00',
      Rocket: 'Falcon 9', Mission: 'Test', RocketStatus: 'Active', Price: '50', MissionStatus: 'Success',
    }]);
    render(<App />);
    await screen.findByRole('main');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
