import Head from 'next/head';
import { FC } from 'react';
import Navbar from './Navbar';
const Layout: FC<{title?: string}> = ({ title = 'Recipes', children }) => <div >
  <Head>
    <title>{title}</title>
    <meta name="description" content="Recipes app" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
  <Navbar />
  <main>{children}</main>
  <footer>✨</footer>
</div>;
export default Layout;
