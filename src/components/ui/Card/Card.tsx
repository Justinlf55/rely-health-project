import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

const Card = ({ children, className, as: Tag = 'div', ...rest }: CardProps) => (
  <Tag className={`${styles.card}${className ? ` ${className}` : ''}`} {...rest}>
    {children}
  </Tag>
);

export default Card;
