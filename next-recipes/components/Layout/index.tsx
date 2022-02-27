import Head from 'next/head';
import { FC } from 'react';
import styles from './layout.module.css';

const Layout: FC<{title?: string}> = ({ title = 'Recipes', children }) => <div className={styles.layout}>
  <Head>
    <title>{title}</title>
    <meta name="description" content="Recipes app" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
  <main>{children}</main>
  <footer>✨</footer>
</div>;
export default Layout;
