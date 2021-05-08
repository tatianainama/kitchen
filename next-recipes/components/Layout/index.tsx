import Head from "next/head";
import React from "react";

const Layout = ({ title = "Recipes", children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Recipes app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
      <footer>✨</footer>
    </div>
  );
};

export default Layout;
