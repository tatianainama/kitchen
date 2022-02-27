import { FC } from 'react';
import styles from './button.module.css';

export const ButtonGroup: FC = ({ children }) => <div className={styles.buttonGroup}>{children}</div>;

