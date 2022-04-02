import Layout from 'components/Layout';
import { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => (
  <Layout>
    <div className="layout-container md:w-with-padding">
      <nav className="flex flex-wrap gap-4 py-4">
        <Link href={`/recipes/`}>
          <a className="btn-outline">Recipes</a>
        </Link>
        <Link href={`/recipes/create`}>
          <a className="btn-outline">Create Recipe</a>
        </Link>
      </nav>
    </div>
  </Layout>
);

export default Home;
