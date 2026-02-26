import Papa from 'papaparse';
import type { MissionRow } from '../types/mission';

export const fetchMissions = async (): Promise<MissionRow[]> => {
  const response = await fetch('/space_missions.csv');
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<MissionRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
      complete: (results) => resolve(results.data),
      error: (err: Error) => reject(new Error(err.message)),
    });
  });
};
