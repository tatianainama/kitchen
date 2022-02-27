import classnames from 'classnames';
import { FunctionComponent, InputHTMLAttributes } from 'react';
import styles from './forms.module.css';

interface ChipProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string,
  color?: 'default' | 'primary' | 'secondary'
}

export const Chip: FunctionComponent<ChipProps> = ({ label, color, id, ...props }) => <div className={classnames(
  styles.chip,
  styles[`${color}Color`]
)}>
  <input type="checkbox" id={id || label} {...props} />
  <label htmlFor={id || label}>{label}</label>
</div>;
Chip.defaultProps = {
  color: 'default'
};

export const ChipGroup: FunctionComponent = ({ children }) => <div className={styles.chipGroup}>
  {children}
</div>;

