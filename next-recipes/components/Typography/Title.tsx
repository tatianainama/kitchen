import { FC } from 'react';
import styles from './typography.module.css';

type TitleProps = {
  label?: string,
}

export const Title: FC<TitleProps> = ({ children, label }) => <h1 className={styles.title}>
  <span className={styles.bgDecor}></span>
  <span className={styles.titleText}>{label || children }</span>
</h1>;
