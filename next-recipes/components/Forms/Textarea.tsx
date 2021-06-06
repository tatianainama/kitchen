import { FunctionComponent, TextareaHTMLAttributes } from "react"
import styles from './forms.module.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea: FunctionComponent<TextareaProps> = ({ label, id, ...props }) => (
  <div className={styles.input}>
    {label && <label htmlFor={id}>{label}</label>}
    <textarea className={styles.textInput} id={id} {...props} />
  </div>
);

Textarea.defaultProps = {
  rows: 5,
}