import type { MissionRow } from '../types/mission';

export const MOCK_MISSIONS: MissionRow[] = [
  { Company: 'SpaceX', Location: 'Cape Canaveral, FL', Date: '2020-01-10', Time: '00:00', Rocket: 'Falcon 9', Mission: 'Starlink-1', RocketStatus: 'Active', Price: '50.0', MissionStatus: 'Success' },
  { Company: 'SpaceX', Location: 'Cape Canaveral, FL', Date: '2020-03-15', Time: '00:00', Rocket: 'Falcon 9', Mission: 'CRS-20', RocketStatus: 'Active', Price: '50.0', MissionStatus: 'Success' },
  { Company: 'SpaceX', Location: 'Boca Chica, TX', Date: '2021-04-23', Time: '00:00', Rocket: 'Falcon 9', Mission: 'Crew Dragon Demo', RocketStatus: 'Active', Price: '55.0', MissionStatus: 'Success' },
  { Company: 'SpaceX', Location: 'Cape Canaveral, FL', Date: '2021-09-16', Time: '00:00', Rocket: 'Falcon Heavy', Mission: 'Arabsat-6A', RocketStatus: 'Active', Price: '90.0', MissionStatus: 'Failure' },
  { Company: 'SpaceX', Location: 'Cape Canaveral, FL', Date: '2022-02-03', Time: '00:00', Rocket: 'Falcon 9', Mission: 'Starlink-21', RocketStatus: 'Active', Price: '50.0', MissionStatus: 'Success' },
  { Company: 'NASA', Location: 'Kennedy Space Center, FL', Date: '2020-05-30', Time: '00:00', Rocket: 'SLS', Mission: 'Artemis I', RocketStatus: 'Active', Price: '200.0', MissionStatus: 'Success' },
  { Company: 'NASA', Location: 'Kennedy Space Center, FL', Date: '2021-07-04', Time: '00:00', Rocket: 'SLS', Mission: 'Artemis II', RocketStatus: 'Retired', Price: '210.0', MissionStatus: 'Partial Failure' },
  { Company: 'ULA', Location: 'Cape Canaveral, FL', Date: '2019-12-20', Time: '00:00', Rocket: 'Atlas V', Mission: 'OFT', RocketStatus: 'Active', Price: '100.0', MissionStatus: 'Partial Failure' },
  { Company: 'ULA', Location: 'Vandenberg AFB, CA', Date: '2020-08-18', Time: '00:00', Rocket: 'Delta IV Heavy', Mission: 'NROL-44', RocketStatus: 'Retired', Price: '120.0', MissionStatus: 'Success' },
  { Company: 'RocketLab', Location: 'Mahia, New Zealand', Date: '2020-11-20', Time: '00:00', Rocket: 'Electron', Mission: 'Return to Sender', RocketStatus: 'Active', Price: '7.0', MissionStatus: 'Success' },
  { Company: 'RocketLab', Location: 'Mahia, New Zealand', Date: '2021-05-15', Time: '00:00', Rocket: 'Electron', Mission: 'Running Out of Toes', RocketStatus: 'Active', Price: '7.5', MissionStatus: 'Failure' },
  { Company: 'Roscosmos', Location: 'Baikonur, Kazakhstan', Date: '2020-04-09', Time: '00:00', Rocket: 'Soyuz', Mission: 'Progress MS-14', RocketStatus: 'Active', Price: '80.0', MissionStatus: 'Success' },
  { Company: 'Roscosmos', Location: 'Baikonur, Kazakhstan', Date: '2021-06-30', Time: '00:00', Rocket: 'Proton-M', Mission: 'Nauka', RocketStatus: 'Retired', Price: '65.0', MissionStatus: 'Success' },
  { Company: 'ISRO', Location: 'Satish Dhawan SC, India', Date: '2020-07-22', Time: '00:00', Rocket: 'GSLV Mk III', Mission: 'Chandrayaan-2', RocketStatus: 'Active', Price: '140.0', MissionStatus: 'Prelaunch Failure' },
  { Company: 'ISRO', Location: 'Satish Dhawan SC, India', Date: '2022-10-23', Time: '00:00', Rocket: 'PSLV-C54', Mission: 'EOS-06', RocketStatus: 'Active', Price: '30.0', MissionStatus: 'Success' },
  { Company: 'Arianespace', Location: 'Guiana Space Centre', Date: '2020-02-18', Time: '00:00', Rocket: 'Ariane 5', Mission: 'JCSAT-17', RocketStatus: 'Retired', Price: '170.0', MissionStatus: 'Success' },
  { Company: 'Arianespace', Location: 'Guiana Space Centre', Date: '2021-12-25', Time: '00:00', Rocket: 'Ariane 5', Mission: 'James Webb', RocketStatus: 'Retired', Price: '170.0', MissionStatus: 'Success' },
  { Company: 'Blue Origin', Location: 'West Texas', Date: '2021-07-20', Time: '00:00', Rocket: 'New Shepard', Mission: 'NS-16', RocketStatus: 'Active', Price: '0.0', MissionStatus: 'Success' },
  { Company: 'Blue Origin', Location: 'West Texas', Date: '2022-09-12', Time: '00:00', Rocket: 'New Shepard', Mission: 'NS-23', RocketStatus: 'Active', Price: '0.0', MissionStatus: 'Failure' },
  { Company: 'Northrop Grumman', Location: 'Wallops Island, VA', Date: '2020-10-02', Time: '00:00', Rocket: 'Antares', Mission: 'Cygnus NG-14', RocketStatus: 'Retired', Price: '85.0', MissionStatus: 'Success' },
];
