import { FunctionComponent } from 'react';
import styles from './container.module.css';

interface ContainerProps {
};

const Container: FunctionComponent<ContainerProps> = ({ children }) => (
  <div className={styles.container}>{children}</div>
);

export default Container;