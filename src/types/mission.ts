export interface MissionRow {
  Company: string;
  Location: string;
  Date: string;
  Time: string;
  Rocket: string;
  Mission: string;
  RocketStatus: string;
  Price: string;
  MissionStatus: string;
}

export interface FilterState {
  startDate: string;
  endDate: string;
  companies: string[];
  statuses: string[];
}

export type SortKey = keyof MissionRow | '';

export interface SortState {
  key: SortKey;
  direction: 'asc' | 'desc';
}
