import { render, screen, waitFor } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import { createElement } from 'react';
import { DashboardProvider } from '../../../context/DashboardContext';
import SummaryCards from '../SummaryCards';
import { MOCK_MISSIONS } from '../../../test/mockData';

const mockFetchMissions = vi.hoisted(() => vi.fn());

vi.mock('../../../data/loader', () => ({
  fetchMissions: mockFetchMissions,
}));

describe('SummaryCards', () => {
  beforeEach(() => {
    mockFetchMissions.mockResolvedValue(MOCK_MISSIONS);
  });
  it('renders without crashing', async () => {
    render(createElement(DashboardProvider, null, createElement(SummaryCards)));
    await waitFor(() => {
      expect(screen.getByText('Total Missions')).toBeInTheDocument();
    });
  });

  it('renders five stat cards', async () => {
    render(createElement(DashboardProvider, null, createElement(SummaryCards)));
    await waitFor(() => {
      const cards = screen.getAllByRole('article');
      expect(cards.length).toBe(5);
    });
  });
});
