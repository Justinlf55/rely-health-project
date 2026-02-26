import { render, screen } from '@testing-library/react';
import MissionTableRow from '../MissionTableRow';
import type { MissionRow } from '../../../types/mission';

const makeMission = (overrides: Partial<MissionRow> = {}): MissionRow => ({
  Company: 'SpaceX',
  Location: 'Cape Canaveral, FL',
  Date: '2020-01-10',
  Time: '00:00',
  Rocket: 'Falcon 9',
  Mission: 'Starlink-1',
  RocketStatus: 'Active',
  Price: '50.0',
  MissionStatus: 'Success',
  ...overrides,
});

const renderRow = (mission: MissionRow) =>
  render(
    <table>
      <tbody>
        <MissionTableRow mission={mission} />
      </tbody>
    </table>,
  );

describe('MissionTableRow', () => {
  it('renders the mission date', () => {
    renderRow(makeMission({ Date: '2021-06-15' }));
    expect(screen.getByText('2021-06-15')).toBeInTheDocument();
  });

  it('renders the company name', () => {
    renderRow(makeMission({ Company: 'NASA' }));
    expect(screen.getByText('NASA')).toBeInTheDocument();
  });

  it('renders the mission name', () => {
    renderRow(makeMission({ Mission: 'Artemis I' }));
    expect(screen.getByText('Artemis I')).toBeInTheDocument();
  });

  it('renders the rocket name', () => {
    renderRow(makeMission({ Rocket: 'SLS' }));
    expect(screen.getByText('SLS')).toBeInTheDocument();
  });

  it('renders the location', () => {
    renderRow(makeMission({ Location: 'Kennedy Space Center' }));
    expect(screen.getByText('Kennedy Space Center')).toBeInTheDocument();
  });

  it('renders a Badge for known MissionStatus "Success"', () => {
    renderRow(makeMission({ MissionStatus: 'Success' }));
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders a Badge for known MissionStatus "Failure"', () => {
    renderRow(makeMission({ MissionStatus: 'Failure' }));
    expect(screen.getByText('Failure')).toBeInTheDocument();
  });

  it('renders a Badge for known MissionStatus "Partial Failure"', () => {
    renderRow(makeMission({ MissionStatus: 'Partial Failure' }));
    expect(screen.getByText('Partial Failure')).toBeInTheDocument();
  });

  it('renders a Badge for known MissionStatus "Prelaunch Failure"', () => {
    renderRow(makeMission({ MissionStatus: 'Prelaunch Failure' }));
    expect(screen.getByText('Prelaunch Failure')).toBeInTheDocument();
  });

  it('renders a plain span for unknown MissionStatus', () => {
    renderRow(makeMission({ MissionStatus: 'Unknown' }));
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('renders RocketStatus "Active"', () => {
    renderRow(makeMission({ RocketStatus: 'Active' }));
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders RocketStatus "Retired"', () => {
    renderRow(makeMission({ RocketStatus: 'Retired' }));
    expect(screen.getByText('Retired')).toBeInTheDocument();
  });
});
