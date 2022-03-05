/* eslint-disable max-lines-per-function */
import Layout from 'components/Layout';
import { NextPage } from 'next';

const Home: NextPage = () => <Layout>
  <h1>Components</h1>
  <section>
    <h2>Buttons</h2>
    <button className="h-9 border-2 uppercase text-sm font-bold tracking-wider px-6">Button</button>
  </section>
</Layout>;

export default Home;
