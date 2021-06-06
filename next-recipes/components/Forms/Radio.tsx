import classNames from "classnames";
import { FunctionComponent, InputHTMLAttributes } from "react"
import styles from './forms.module.css';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Radio: FunctionComponent<RadioProps> = ({ label, id, ...props }) => (
  <div className={classNames(styles.input, styles.radio)}>
    <label htmlFor={id}>
      <input type='radio' id={id} {...props} />
      <span>{label}</span>
    </label>
  </div>
);
