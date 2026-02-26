import { describe, it, expect } from 'vitest';
import {
  getMissionCountByCompany,
  getSuccessRate,
  getMissionsByDateRange,
  getTopCompaniesByMissionCount,
  getMissionStatusCount,
  getMissionsByYear,
  getMostUsedRocket,
  getAverageMissionsPerYear,
} from '../analytics';
import type { MissionRow } from '../../types/mission';

const make = (overrides: Partial<MissionRow> = {}): MissionRow => ({
  Company: 'TestCo',
  Location: 'Earth',
  Date: '2020-01-01',
  Time: '00:00',
  Rocket: 'Rocket-1',
  Mission: 'Mission-1',
  RocketStatus: 'Active',
  Price: '10.0',
  MissionStatus: 'Success',
  ...overrides,
});

describe('getMissionCountByCompany', () => {
  it('counts missions for known company', () => {
    const data = [make({ Company: 'SpaceX' }), make({ Company: 'SpaceX' }), make({ Company: 'NASA' })];
    expect(getMissionCountByCompany(data, 'SpaceX')).toBe(2);
  });

  it('returns 0 for unknown company', () => {
    const data = [make({ Company: 'SpaceX' })];
    expect(getMissionCountByCompany(data, 'NASA')).toBe(0);
  });

  it('returns 0 for empty data', () => {
    expect(getMissionCountByCompany([], 'SpaceX')).toBe(0);
  });

  it('trims whitespace when matching', () => {
    const data = [make({ Company: ' SpaceX ' })];
    expect(getMissionCountByCompany(data, 'SpaceX')).toBe(1);
  });
});

describe('getSuccessRate', () => {
  it('returns 100 when all missions succeed', () => {
    const data = [
      make({ Company: 'SpaceX', MissionStatus: 'Success' }),
      make({ Company: 'SpaceX', MissionStatus: 'Success' }),
    ];
    expect(getSuccessRate(data, 'SpaceX')).toBe(100);
  });

  it('returns 0 when all missions fail', () => {
    const data = [make({ Company: 'SpaceX', MissionStatus: 'Failure' })];
    expect(getSuccessRate(data, 'SpaceX')).toBe(0);
  });

  it('calculates correct mixed rate', () => {
    const data = [
      make({ Company: 'SpaceX', MissionStatus: 'Success' }),
      make({ Company: 'SpaceX', MissionStatus: 'Success' }),
      make({ Company: 'SpaceX', MissionStatus: 'Failure' }),
      make({ Company: 'SpaceX', MissionStatus: 'Failure' }),
    ];
    expect(getSuccessRate(data, 'SpaceX')).toBe(50);
  });

  it('returns 0 for empty data', () => {
    expect(getSuccessRate([], 'SpaceX')).toBe(0);
  });

  it('returns 0 for unknown company', () => {
    const data = [make({ Company: 'SpaceX', MissionStatus: 'Success' })];
    expect(getSuccessRate(data, 'NASA')).toBe(0);
  });
});

describe('getMissionsByDateRange', () => {
  it('returns missions within inclusive date range', () => {
    const data = [
      make({ Date: '2020-01-01', Mission: 'Alpha' }),
      make({ Date: '2020-06-15', Mission: 'Beta' }),
      make({ Date: '2020-12-31', Mission: 'Gamma' }),
    ];
    const result = getMissionsByDateRange(data, '2020-01-01', '2020-12-31');
    expect(result).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('returns results in chronological order', () => {
    const data = [
      make({ Date: '2021-03-01', Mission: 'C' }),
      make({ Date: '2021-01-01', Mission: 'A' }),
      make({ Date: '2021-02-01', Mission: 'B' }),
    ];
    expect(getMissionsByDateRange(data, '2021-01-01', '2021-12-31')).toEqual(['A', 'B', 'C']);
  });

  it('returns empty array for empty range', () => {
    const data = [make({ Date: '2020-06-01', Mission: 'Alpha' })];
    expect(getMissionsByDateRange(data, '2021-01-01', '2021-12-31')).toEqual([]);
  });
});

describe('getTopCompaniesByMissionCount', () => {
  it('returns companies in descending mission count order', () => {
    const data = [
      make({ Company: 'SpaceX' }),
      make({ Company: 'SpaceX' }),
      make({ Company: 'SpaceX' }),
      make({ Company: 'NASA' }),
      make({ Company: 'NASA' }),
      make({ Company: 'ULA' }),
    ];
    const result = getTopCompaniesByMissionCount(data, 3);
    expect(result[0]).toEqual(['SpaceX', 3]);
    expect(result[1]).toEqual(['NASA', 2]);
    expect(result[2]).toEqual(['ULA', 1]);
  });

  it('breaks ties alphabetically', () => {
    const data = [
      make({ Company: 'Zebra' }),
      make({ Company: 'Alpha' }),
    ];
    const result = getTopCompaniesByMissionCount(data, 2);
    expect(result[0][0]).toBe('Alpha');
    expect(result[1][0]).toBe('Zebra');
  });

  it('returns empty array when n=0', () => {
    const data = [make({ Company: 'SpaceX' })];
    expect(getTopCompaniesByMissionCount(data, 0)).toEqual([]);
  });
});

describe('getMissionStatusCount', () => {
  it('counts all four statuses', () => {
    const data = [
      make({ MissionStatus: 'Success' }),
      make({ MissionStatus: 'Failure' }),
      make({ MissionStatus: 'Partial Failure' }),
      make({ MissionStatus: 'Prelaunch Failure' }),
    ];
    const result = getMissionStatusCount(data);
    expect(result['Success']).toBe(1);
    expect(result['Failure']).toBe(1);
    expect(result['Partial Failure']).toBe(1);
    expect(result['Prelaunch Failure']).toBe(1);
  });

  it('ignores unknown statuses', () => {
    const data = [make({ MissionStatus: 'Unknown' })];
    const result = getMissionStatusCount(data);
    expect(result['Success']).toBe(0);
    expect('Unknown' in result).toBe(false);
  });
});

describe('getMissionsByYear', () => {
  it('counts missions in specified year', () => {
    const data = [
      make({ Date: '2020-01-01' }),
      make({ Date: '2020-07-04' }),
      make({ Date: '2021-01-01' }),
    ];
    expect(getMissionsByYear(data, 2020)).toBe(2);
  });

  it('excludes adjacent years', () => {
    const data = [make({ Date: '2019-12-31' }), make({ Date: '2021-01-01' })];
    expect(getMissionsByYear(data, 2020)).toBe(0);
  });
});

describe('getMostUsedRocket', () => {
  it('returns the most used rocket', () => {
    const data = [
      make({ Rocket: 'Falcon 9' }),
      make({ Rocket: 'Falcon 9' }),
      make({ Rocket: 'Atlas V' }),
    ];
    expect(getMostUsedRocket(data)).toBe('Falcon 9');
  });

  it('returns alphabetically first rocket on tie', () => {
    const data = [make({ Rocket: 'Zebra' }), make({ Rocket: 'Alpha' })];
    expect(getMostUsedRocket(data)).toBe('Alpha');
  });

  it('returns empty string for empty data', () => {
    expect(getMostUsedRocket([])).toBe('');
  });
});

describe('getAverageMissionsPerYear', () => {
  it('calculates average correctly', () => {
    const data = [
      make({ Date: '2020-01-01' }),
      make({ Date: '2020-07-01' }),
      make({ Date: '2021-01-01' }),
      make({ Date: '2022-01-01' }),
    ];
    // 4 missions over 3 years (2020-2022)
    expect(getAverageMissionsPerYear(data, 2020, 2022)).toBe(parseFloat((4 / 3).toFixed(2)));
  });

  it('returns 0 when startYear > endYear', () => {
    const data = [make({ Date: '2020-01-01' })];
    expect(getAverageMissionsPerYear(data, 2022, 2020)).toBe(0);
  });
});
