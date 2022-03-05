/* eslint-disable max-lines-per-function */
import Layout from 'components/Layout';
import { NextPage } from 'next';

const Home: NextPage = () => <Layout>
  <h1>Components</h1>
  <section>
    <h2>Buttons</h2>
    <button className="btn-outline"><span className="relative">Button</span></button>
  </section>
</Layout>;

export default Home;
