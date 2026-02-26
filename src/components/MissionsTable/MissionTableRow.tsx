import type { MissionRow } from '../../types/mission';
import { MissionStatus } from '../../constants';
import { Badge } from '../ui';
import styles from './MissionsTable.module.css';

const BADGE_STATUSES = new Set<string>(Object.values(MissionStatus));

interface MissionTableRowProps {
  mission: MissionRow;
}

const MissionTableRow = ({ mission: m }: MissionTableRowProps) => (
  <tr className={styles.tr}>
    <td className={styles.td}>{m.Date}</td>
    <td className={styles.td}>{m.Company}</td>
    <td className={styles.td}>{m.Mission}</td>
    <td className={`${styles.td} ${styles.colRocket}`}>{m.Rocket}</td>
    <td className={`${styles.td} ${styles.location}`}>{m.Location}</td>
    <td className={styles.td}>
      {BADGE_STATUSES.has(m.MissionStatus) ? (
        <Badge status={m.MissionStatus as MissionStatus} />
      ) : (
        <span>{m.MissionStatus}</span>
      )}
    </td>
    <td className={`${styles.td} ${styles.colRocketStatus}`}>
      <span className={m.RocketStatus === 'Active' ? styles.active : styles.retired}>
        {m.RocketStatus}
      </span>
    </td>
  </tr>
);

export default MissionTableRow;
