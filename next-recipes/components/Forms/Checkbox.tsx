import classNames from "classnames";
import { FunctionComponent, InputHTMLAttributes } from "react"
import styles from './forms.module.css';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({ label, id, ...props }) => (
  <div className={classNames(styles.input, styles.checkbox)}>
    <label htmlFor={id}>
      <input type='checkbox' id={id} {...props} />
      <span>{label}</span>
    </label>
  </div>
);
