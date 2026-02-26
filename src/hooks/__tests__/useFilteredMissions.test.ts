import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilteredMissions } from '../useFilteredMissions';
import { MOCK_MISSIONS } from '../../test/mockData';
import { SortDirection } from '../../constants';

const mockFetchMissions = vi.hoisted(() => vi.fn());

vi.mock('../../data/loader', () => ({
  fetchMissions: mockFetchMissions,
}));

vi.mock('../../context/DashboardContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../context/DashboardContext')>();
  return {
    ...actual,
    useDashboard: vi.fn(),
  };
});

import { useDashboard } from '../../context/DashboardContext';

const noopSort = { key: '' as const, direction: SortDirection.Asc };
const noopFilter = { startDate: '', endDate: '', companies: [], statuses: [] };
const baseContext = {
  allMissions: MOCK_MISSIONS,
  filterState: noopFilter,
  sortState: noopSort,
  isLoading: false,
  error: null,
  setFilter: vi.fn(),
  setSort: vi.fn(),
};

const defaultSortContext = {
  ...baseContext,
  sortState: { key: 'Date' as const, direction: SortDirection.Desc },
};

describe('useFilteredMissions', () => {
  beforeEach(() => {
    vi.mocked(useDashboard).mockReturnValue(defaultSortContext);
  });

  it('returns all missions when no filters are active', () => {
    const { result } = renderHook(() => useFilteredMissions());
    expect(result.current.length).toBe(MOCK_MISSIONS.length);
  });

  it('returns sorted results by date desc by default', () => {
    const { result } = renderHook(() => useFilteredMissions());
    const dates = result.current.map((m) => m.Date);
    const sortedDesc = [...dates].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    expect(dates).toEqual(sortedDesc);
  });
});

describe('useFilteredMissions — filtering behavior', () => {
  beforeEach(() => {
    vi.mocked(useDashboard).mockReturnValue(baseContext);
  });

  it('returns all missions when all filters are empty', () => {
    const { result } = renderHook(() => useFilteredMissions());
    expect(result.current).toHaveLength(MOCK_MISSIONS.length);
  });

  it('filters by startDate — excludes missions before the start date', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: { ...noopFilter, startDate: '2021-01-01' },
    });
    const { result } = renderHook(() => useFilteredMissions());
    const expected = MOCK_MISSIONS.filter((m) => m.Date >= '2021-01-01');
    expect(result.current).toHaveLength(expected.length);
    result.current.forEach((m) => expect(m.Date >= '2021-01-01').toBe(true));
  });

  it('filters by endDate — excludes missions after the end date', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: { ...noopFilter, endDate: '2020-12-31' },
    });
    const { result } = renderHook(() => useFilteredMissions());
    const expected = MOCK_MISSIONS.filter((m) => m.Date <= '2020-12-31');
    expect(result.current).toHaveLength(expected.length);
    result.current.forEach((m) => expect(m.Date <= '2020-12-31').toBe(true));
  });

  it('filters by startDate and endDate together — inclusive range', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: { ...noopFilter, startDate: '2020-01-01', endDate: '2020-12-31' },
    });
    const { result } = renderHook(() => useFilteredMissions());
    const expected = MOCK_MISSIONS.filter(
      (m) => m.Date >= '2020-01-01' && m.Date <= '2020-12-31',
    );
    expect(result.current).toHaveLength(expected.length);
    result.current.forEach((m) => {
      expect(m.Date >= '2020-01-01').toBe(true);
      expect(m.Date <= '2020-12-31').toBe(true);
    });
  });

  it('filters by a single company', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: { ...noopFilter, companies: ['SpaceX'] },
    });
    const { result } = renderHook(() => useFilteredMissions());
    expect(result.current.length).toBeGreaterThan(0);
    result.current.forEach((m) => expect(m.Company).toBe('SpaceX'));
  });

  it('filters by multiple companies', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: { ...noopFilter, companies: ['SpaceX', 'NASA'] },
    });
    const { result } = renderHook(() => useFilteredMissions());
    const expected = MOCK_MISSIONS.filter((m) =>
      ['SpaceX', 'NASA'].includes(m.Company),
    );
    expect(result.current).toHaveLength(expected.length);
    result.current.forEach((m) =>
      expect(['SpaceX', 'NASA']).toContain(m.Company),
    );
  });

  it('filters by MissionStatus', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: { ...noopFilter, statuses: ['Failure'] },
    });
    const { result } = renderHook(() => useFilteredMissions());
    const expected = MOCK_MISSIONS.filter((m) => m.MissionStatus === 'Failure');
    expect(result.current).toHaveLength(expected.length);
    result.current.forEach((m) => expect(m.MissionStatus).toBe('Failure'));
  });

  it('filters by multiple statuses', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: { ...noopFilter, statuses: ['Success', 'Partial Failure'] },
    });
    const { result } = renderHook(() => useFilteredMissions());
    const expected = MOCK_MISSIONS.filter((m) =>
      ['Success', 'Partial Failure'].includes(m.MissionStatus),
    );
    expect(result.current).toHaveLength(expected.length);
    result.current.forEach((m) =>
      expect(['Success', 'Partial Failure']).toContain(m.MissionStatus),
    );
  });

  it('combines company filter and date range filter', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: {
        startDate: '2020-01-01',
        endDate: '2020-12-31',
        companies: ['SpaceX'],
        statuses: [],
      },
    });
    const { result } = renderHook(() => useFilteredMissions());
    const expected = MOCK_MISSIONS.filter(
      (m) =>
        m.Company === 'SpaceX' &&
        m.Date >= '2020-01-01' &&
        m.Date <= '2020-12-31',
    );
    expect(result.current).toHaveLength(expected.length);
  });

  it('returns empty array when no missions match filters', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: { ...noopFilter, companies: ['NonExistentCompany'] },
    });
    const { result } = renderHook(() => useFilteredMissions());
    expect(result.current).toHaveLength(0);
  });

  it('sorts ascending by Company when sortState is set', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: noopFilter,
      sortState: { key: 'Company', direction: SortDirection.Asc },
    });
    const { result } = renderHook(() => useFilteredMissions());
    const companies = result.current.map((m) => m.Company);
    const sorted = [...companies].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    expect(companies).toEqual(sorted);
  });

  it('sorts descending by Date when sortState direction is desc', () => {
    vi.mocked(useDashboard).mockReturnValue({
      ...baseContext,
      filterState: noopFilter,
      sortState: { key: 'Date', direction: SortDirection.Desc },
    });
    const { result } = renderHook(() => useFilteredMissions());
    const dates = result.current.map((m) => m.Date);
    const sortedDesc = [...dates].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    expect(dates).toEqual(sortedDesc);
  });
});
