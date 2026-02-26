import type { MissionRow } from '../types/mission';

export const getMissionCountByCompany = (data: MissionRow[], companyName: string): number =>
  data.filter((m) => m.Company.trim() === companyName.trim()).length;

export const getSuccessRate = (data: MissionRow[], companyName: string): number => {
  const missions = data.filter((m) => m.Company.trim() === companyName.trim());
  if (missions.length === 0) return 0.0;
  const successes = missions.filter((m) => m.MissionStatus === 'Success').length;
  return parseFloat(((successes / missions.length) * 100).toFixed(2));
};

export const getMissionsByDateRange = (
  data: MissionRow[],
  startDate: string,
  endDate: string,
): string[] =>
  data
    .filter((m) => m.Date >= startDate && m.Date <= endDate)
    .sort((a, b) => (a.Date < b.Date ? -1 : a.Date > b.Date ? 1 : 0))
    .map((m) => m.Mission);

export const getTopCompaniesByMissionCount = (
  data: MissionRow[],
  n: number,
): [string, number][] => {
  const counts = new Map<string, number>();
  for (const m of data) {
    const company = m.Company.trim();
    counts.set(company, (counts.get(company) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([aName, aCount], [bName, bCount]) =>
      bCount !== aCount ? bCount - aCount : aName.localeCompare(bName),
    )
    .slice(0, n);
};

export const getMissionStatusCount = (data: MissionRow[]): Record<string, number> => {
  const result: Record<string, number> = {
    Success: 0,
    Failure: 0,
    'Partial Failure': 0,
    'Prelaunch Failure': 0,
  };
  for (const m of data) {
    if (m.MissionStatus in result) {
      result[m.MissionStatus]++;
    }
  }
  return result;
};

export const getMissionsByYear = (data: MissionRow[], year: number): number =>
  data.filter((m) => parseInt(m.Date.slice(0, 4), 10) === year).length;

export const getMostUsedRocket = (data: MissionRow[]): string => {
  const counts = new Map<string, number>();
  let topRocket = '';
  let topCount = 0;
  for (const m of data) {
    const rocket = m.Rocket.trim();
    const count = (counts.get(rocket) ?? 0) + 1;
    counts.set(rocket, count);
    if (count > topCount || (count === topCount && rocket < topRocket)) {
      topRocket = rocket;
      topCount = count;
    }
  }
  return topRocket;
};

export const getAverageMissionsPerYear = (
  data: MissionRow[],
  startYear: number,
  endYear: number,
): number => {
  const years = endYear - startYear + 1;
  if (years <= 0) return 0;
  const count = data.filter((m) => {
    const year = parseInt(m.Date.slice(0, 4), 10);
    return year >= startYear && year <= endYear;
  }).length;
  return parseFloat((count / years).toFixed(2));
};
