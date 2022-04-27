import { FC } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import prisma from '@/lib/prisma';
import { RecipeTypes } from 'additional';
import Layout from '@/components/Layout';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { Prisma, Tag } from '@prisma/client';
import Search from '@/components/Form/RecipeSearch';

const Recipes: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  recipeList,
  tagList
}) => (
  <Layout>
    <div className="bg-white border-b border-grey-100">
      <Search tags={tagList} />
    </div>
    <div className="layout-container md:w-with-padding p-4 md:px-0">
      <nav className="flex flex-col justify-between sm:flex-row sm:items-center py-4">
        <h1>Recipes</h1>
        <Link href={`/recipes/create`}>
          <a className="btn-outline bg-white py-1">Create Recipe</a>
        </Link>
      </nav>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recipeList.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} className="h-full"></RecipeCard>
          </li>
        ))}
      </ul>
    </div>
  </Layout>
);

export const getServerSideProps: GetServerSideProps<{
  recipeList: RecipeTypes.Recipe[];
  tagList: Tag[];
}> = async (context) => {
  const { tags, name } = context.query;
  const nameQuery = name
    ? ({
        name: {
          contains: Array.isArray(name) ? name.join(' ') : name,
          mode: 'insensitive'
        }
      } as Prisma.RecipeWhereInput)
    : {};

  const tagQuery = tags
    ? {
        tags: {
          some: {
            name: {
              in: Array.isArray(tags) ? tags : [tags]
            }
          }
        }
      }
    : {};

  const tagList = await prisma.tag.findMany({
    distinct: ['name']
  });

  const recipeList = (await prisma.recipe.findMany({
    where: {
      ...nameQuery,
      ...tagQuery
    },
    include: {
      tags: true,
      ingredients: true,
      author: true
    }
  })) as RecipeTypes.Recipe[];

  return {
    props: {
      recipeList,
      tagList
    }
  };
};

export default Recipes;
