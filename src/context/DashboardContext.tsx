import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { MissionRow, FilterState, SortState } from '../types/mission';
import { SortDirection } from '../constants';
import { fetchMissions } from '../data/loader';

interface DashboardState {
  allMissions: MissionRow[];
  filterState: FilterState;
  sortState: SortState;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: MissionRow[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'SET_SORT'; payload: SortState };

const initialFilterState: FilterState = {
  startDate: '',
  endDate: '',
  companies: [],
  statuses: [],
};

const initialState: DashboardState = {
  allMissions: [],
  filterState: initialFilterState,
  sortState: { key: 'Date', direction: SortDirection.Desc },
  isLoading: true,
  error: null,
};

const reducer = (state: DashboardState, action: Action): DashboardState => {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, isLoading: false, allMissions: action.payload };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_FILTER':
      return { ...state, filterState: { ...state.filterState, ...action.payload } };
    case 'SET_SORT':
      return { ...state, sortState: action.payload };
    default:
      return state;
  }
};

interface DashboardContextValue extends DashboardState {
  setFilter: (filter: Partial<FilterState>) => void;
  setSort: (sort: SortState) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: 'LOAD_START' });
    fetchMissions()
      .then((data) => {
        if (!cancelled) dispatch({ type: 'LOAD_SUCCESS', payload: data });
      })
      .catch((err: unknown) => {
        if (!cancelled)
          dispatch({ type: 'LOAD_ERROR', payload: err instanceof Error ? err.message : 'Failed to load missions' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setFilter = useCallback(
    (filter: Partial<FilterState>) => dispatch({ type: 'SET_FILTER', payload: filter }),
    [],
  );

  const setSort = useCallback(
    (sort: SortState) => dispatch({ type: 'SET_SORT', payload: sort }),
    [],
  );

  const value = useMemo(
    () => ({ ...state, setFilter, setSort }),
    [state, setFilter, setSort],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextValue => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};
