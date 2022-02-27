import { ButtonHTMLAttributes, FunctionComponent, MouseEventHandler } from 'react';
import classnames from 'classnames';
import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'default' | 'primary' | 'secondary' | 'outline',
  size?: 'small' | 'medium' | 'large',
  onClick?: MouseEventHandler<HTMLButtonElement>,
}

export const Button: FunctionComponent<ButtonProps> = ({ children, onClick, color, size, type, ...props }) => <button
  className={classnames(
    styles.button,
    styles[`${color}Color`],
    styles[`${size}Size`]
  )}
  onClick={onClick}
  type={type}
  {...props}
>
  {children}
</button>;
Button.defaultProps = {
  color: 'default',
  size: 'medium',
  type: 'button'
};
