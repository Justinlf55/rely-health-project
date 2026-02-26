import { render, screen, waitFor } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';
import { DashboardProvider } from '../../../context/DashboardContext';
import MissionsTable from '../MissionsTable';
import { MOCK_MISSIONS } from '../../../test/mockData';

const mockFetchMissions = vi.hoisted(() => vi.fn());

vi.mock('../../../data/loader', () => ({
  fetchMissions: mockFetchMissions,
}));

describe('MissionsTable', () => {
  beforeEach(() => {
    mockFetchMissions.mockResolvedValue(MOCK_MISSIONS);
  });
  it('renders without crashing', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionsTable)));
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('has a caption for screen readers', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionsTable)));
    await waitFor(() => {
      const caption = document.querySelector('caption');
      expect(caption).toBeInTheDocument();
      expect(caption?.textContent).toMatch(/Space missions/);
    });
  });

  it('column headers have aria-sort attribute', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionsTable)));
    await waitFor(() => {
      const dateHeader = screen.getByRole('columnheader', { name: /Date/ });
      expect(dateHeader).toHaveAttribute('aria-sort');
    });
  });

  it('column headers are keyboard focusable', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionsTable)));
    await waitFor(() => {
      const headers = screen.getAllByRole('columnheader');
      headers.forEach((h) => expect(h).toHaveAttribute('tabindex', '0'));
    });
  });

  it('renders mission data rows', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionsTable)));
    await waitFor(() => {
      expect(screen.getByText('Starlink-1')).toBeInTheDocument();
    });
  });

  it('shows result count', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionsTable)));
    await waitFor(() => {
      // MOCK_MISSIONS has 20 items, so should show "20 results"
      expect(screen.getByText('20 results')).toBeInTheDocument();
    });
  });

  it('clicking a column header changes aria-sort', async () => {
    render(createElement(DashboardProvider, null, createElement(MissionsTable)));
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    const companyHeader = screen.getByRole('columnheader', { name: /Company/ });
    // Initially not sorted by Company
    expect(companyHeader).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(companyHeader);
    // After click, should be ascending
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: /Company/ })).toHaveAttribute('aria-sort', 'ascending');
    });
  });
});
