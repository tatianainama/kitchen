import Head from 'next/head';
import styles from './layout.module.css';

const Layout = ({ title = 'Recipes', children }) => {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
        <meta name='description' content='Recipes app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>{children}</main>
      <footer>✨</footer>
    </div>
  );
};

export default Layout;
