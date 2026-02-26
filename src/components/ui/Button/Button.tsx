import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'secondary' | 'ghost';
  size?: 'md' | 'sm';
}

const Button = ({ variant = 'secondary', size = 'md', className, children, ...rest }: ButtonProps) => (
  <button
    type="button"
    className={`${styles.btn} ${styles[variant]} ${styles[size]}${className ? ` ${className}` : ''}`}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
