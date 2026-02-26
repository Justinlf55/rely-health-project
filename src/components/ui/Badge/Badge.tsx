import { MissionStatus } from '../../../constants';
import styles from './Badge.module.css';

const STATUS_CLASS: Record<MissionStatus, string> = {
  [MissionStatus.Success]: styles.success,
  [MissionStatus.Failure]: styles.failure,
  [MissionStatus.PartialFailure]: styles.partial,
  [MissionStatus.PrelaunchFailure]: styles.prelaunch,
};

interface BadgeProps {
  status: MissionStatus;
}

const Badge = ({ status }: BadgeProps) => (
  <span className={`${styles.badge} ${STATUS_CLASS[status] ?? ''}`}>
    {status}
  </span>
);

export default Badge;
