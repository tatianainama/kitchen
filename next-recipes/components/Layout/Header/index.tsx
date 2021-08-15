import { FunctionComponent } from 'react';

import styles from './header.module.css';

interface HeaderProps { };

const Header: FunctionComponent<HeaderProps> = ({ children }) => {
  return (
    <div className={styles.headerContainer}>{children}</div>
  );
};

export default Header;