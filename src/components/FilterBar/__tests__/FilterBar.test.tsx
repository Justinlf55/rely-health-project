import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, beforeEach } from 'vitest';
import { createElement } from 'react';
import userEvent from '@testing-library/user-event';
import { DashboardProvider } from '../../../context/DashboardContext';
import FilterBar from '../FilterBar';
import { MOCK_MISSIONS } from '../../../test/mockData';
import { SortDirection } from '../../../constants';

const mockFetchMissions = vi.hoisted(() => vi.fn());

vi.mock('../../../data/loader', () => ({
  fetchMissions: mockFetchMissions,
}));

vi.mock('../../../context/DashboardContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../context/DashboardContext')>();
  return {
    ...actual,
    useDashboard: vi.fn(),
  };
});

import { useDashboard } from '../../../context/DashboardContext';

const noopFilter = { startDate: '', endDate: '', companies: [], statuses: [] };
const baseContext = {
  allMissions: MOCK_MISSIONS,
  filterState: noopFilter,
  sortState: { key: '' as const, direction: SortDirection.Asc },
  isLoading: false,
  error: null,
  setFilter: vi.fn(),
  setSort: vi.fn(),
};

describe('FilterBar', () => {
  beforeEach(() => {
    mockFetchMissions.mockResolvedValue(MOCK_MISSIONS);
    vi.mocked(useDashboard).mockReturnValue({ ...baseContext, setFilter: vi.fn() });
  });
  it('renders From and To date inputs', async () => {
    render(createElement(DashboardProvider, null, createElement(FilterBar)));
    await waitFor(() => {
      expect(screen.getByLabelText('From')).toBeInTheDocument();
      expect(screen.getByLabelText('To')).toBeInTheDocument();
    });
  });

  it('renders status fieldset with legend', async () => {
    render(createElement(DashboardProvider, null, createElement(FilterBar)));
    await waitFor(() => {
      expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument();
    });
  });

  it('renders all 4 status checkboxes', async () => {
    render(createElement(DashboardProvider, null, createElement(FilterBar)));
    await waitFor(() => {
      expect(screen.getByLabelText('Success')).toBeInTheDocument();
      expect(screen.getByLabelText('Failure')).toBeInTheDocument();
      expect(screen.getByLabelText('Partial Failure')).toBeInTheDocument();
      expect(screen.getByLabelText('Prelaunch Failure')).toBeInTheDocument();
    });
  });

  it('renders Reset Filters button', async () => {
    render(createElement(DashboardProvider, null, createElement(FilterBar)));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Reset Filters' })).toBeInTheDocument();
    });
  });
});

describe('FilterBar — behavioral interactions', () => {
  beforeEach(() => {
    mockFetchMissions.mockResolvedValue(MOCK_MISSIONS);
  });

  it('checking a status checkbox calls setFilter with that status', async () => {
    const setFilter = vi.fn();
    vi.mocked(useDashboard).mockReturnValue({ ...baseContext, setFilter });
    render(<FilterBar />);
    await userEvent.click(screen.getByLabelText('Success'));
    expect(setFilter).toHaveBeenCalledWith({ statuses: ['Success'] });
  });

  it('entering a start date calls setFilter', async () => {
    const setFilter = vi.fn();
    vi.mocked(useDashboard).mockReturnValue({ ...baseContext, setFilter });
    render(<FilterBar />);
    const fromInput = screen.getByLabelText('From');
    fireEvent.change(fromInput, { target: { value: '2021-01-01' } });
    expect(setFilter).toHaveBeenCalledWith({ startDate: '2021-01-01' });
  });

  it('clicking Reset Filters calls setFilter with empty values', async () => {
    const setFilter = vi.fn();
    vi.mocked(useDashboard).mockReturnValue({ ...baseContext, setFilter });
    render(<FilterBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset Filters' }));
    expect(setFilter).toHaveBeenCalledWith({ startDate: '', endDate: '', companies: [], statuses: [] });
  });
});
