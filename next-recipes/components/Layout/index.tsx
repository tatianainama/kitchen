import Head from 'next/head';
import { FC } from 'react';
import Navbar from './Navbar';

const Layout: FC<{title?: string, className?: string}> = ({ title = 'Recipes', children, className }) => <div className="min-h-screen">
  <Head>
    <title>{title}</title>
    <meta name="description" content="Recipes app" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
  <Navbar />
  <main className={`min-h-main bg-dot-pattern ${className}`}>{children}</main>
</div>;

export default Layout;
