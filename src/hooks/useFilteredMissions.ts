import { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { MissionRow } from '../types/mission';

export const useFilteredMissions = (): MissionRow[] => {
  const { allMissions, filterState, sortState } = useDashboard();

  return useMemo(() => {
    let result = allMissions;

    if (filterState.startDate) {
      result = result.filter((m) => m.Date >= filterState.startDate);
    }
    if (filterState.endDate) {
      result = result.filter((m) => m.Date <= filterState.endDate);
    }
    if (filterState.companies.length > 0) {
      result = result.filter((m) => filterState.companies.includes(m.Company));
    }
    if (filterState.statuses.length > 0) {
      result = result.filter((m) => filterState.statuses.includes(m.MissionStatus));
    }

    if (sortState.key) {
      const { key, direction } = sortState;
      result = [...result].sort((a, b) => {
        const aVal = a[key] ?? '';
        const bVal = b[key] ?? '';
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return direction === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [allMissions, filterState, sortState]);
};
