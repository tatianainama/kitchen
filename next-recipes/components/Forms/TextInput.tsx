import { FunctionComponent, InputHTMLAttributes } from "react"
import styles from './forms.module.css';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const TextInput: FunctionComponent<TextInputProps> = ({ label, id, ...props }) => (
  <div className={styles.input}>
    {label && <label htmlFor={id}>{label}</label>}
    <input className={styles.textInput} id={id} {...props} />
  </div>
);

TextInput.defaultProps = {
  type: 'text',
}