export const MissionStatus = {
  Success: 'Success',
  Failure: 'Failure',
  PartialFailure: 'Partial Failure',
  PrelaunchFailure: 'Prelaunch Failure',
} as const;

export type MissionStatus = typeof MissionStatus[keyof typeof MissionStatus];

export const SortDirection = {
  Asc: 'asc',
  Desc: 'desc',
} as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];
