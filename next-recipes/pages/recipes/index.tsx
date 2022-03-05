import { FC } from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import prisma from '@/lib/prisma';
import { RecipeTypes } from 'additional';
import Layout from '@/components/Layout';
import Link from 'next/link';

const Recipes: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  recipeList,
  tags
}) => <Layout>
  <h1>recipes</h1>
  <ul>
    {recipeList.map((recipe) => <li key={recipe.id}><Link href={`/recipes/${encodeURIComponent(recipe.slug)}`}><a>{recipe.name}</a></Link></li>)}
  </ul>
</Layout>;
export const getStaticProps: GetStaticProps<{ recipeList: RecipeTypes.Recipe[], tags: string[]}> = async () => {
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
