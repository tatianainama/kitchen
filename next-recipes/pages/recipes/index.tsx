import { FC } from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import prisma from '@/lib/prisma';
import { RecipeTypes } from 'additional';
import Layout from '@/components/Layout';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';

const Recipes: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  recipeList,
  tags
}) => (
  <Layout>
    <div className="layout-container md:w-with-padding">
      <nav>
        <Link href={`/recipes/create`}>
          <a className="btn-outline">Create Recipe</a>
        </Link>
      </nav>
      <h1>recipes</h1>
      <ul className="flex flex-wrap gap-5">
        {recipeList.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} className="h-full"></RecipeCard>
          </li>
        ))}
      </ul>
    </div>
  </Layout>
);
export const getStaticProps: GetStaticProps<{
  recipeList: RecipeTypes.Recipe[];
  tags: string[];
}> = async () => {
  const recipeList = await prisma.recipe.findMany({
    include: {
      ingredients: true,
      author: true
    }
  });

  return {
    props: {
      recipeList,
      tags: []
    }
  };
};

export default Recipes;
