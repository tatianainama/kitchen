import { FC } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import prisma from '@/lib/prisma';
import { RecipeTypes } from 'additional';
import Layout from '@/components/Layout';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { Course, Prisma, Tag } from '@prisma/client';
import Search from '@/components/Form/RecipeSearch';

const Recipes: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  recipeList,
  tagList,
  courseList
}) => (
  <Layout>
    <div className="bg-white border-b border-grey-100">
      <Search tags={tagList} courses={courseList} />
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
        {recipeList.length === 0 && <li>｡゜(｀Д´)゜｡</li>}
      </ul>
    </div>
  </Layout>
);

type QueryProp = {
  property: keyof Prisma.RecipeWhereInput;
  field: string;
  search?: string | string[];
};

const mkListQuery = ({ property, field, search }: QueryProp) =>
  search
    ? {
        [property]: {
          some: {
            [field]: {
              in: Array.isArray(search) ? search : [search]
            }
          }
        }
      }
    : {};

const mkStringQuery = ({ property, search }: Omit<QueryProp, 'field'>) =>
  search
    ? {
        [property]: {
          contains: Array.isArray(search) ? search.join(' ') : search,
          mode: 'insensitive'
        } as Prisma.RecipeWhereInput
      }
    : {};

export const getServerSideProps: GetServerSideProps<{
  recipeList: RecipeTypes.Recipe[];
  tagList: Tag[];
  courseList: Course[];
}> = async (context) => {
  const { tags, name, courses } = context.query;

  const tagList = await prisma.tag.findMany({
    distinct: ['name']
  });

  const courseList = await prisma.course.findMany({
    distinct: ['name']
  });

  const recipeList = (await prisma.recipe.findMany({
    where: {
      ...mkStringQuery({ property: 'name', search: name }),
      ...mkListQuery({
        property: 'tags',
        field: 'name',
        search: tags
      }),
      ...mkListQuery({
        property: 'courses',
        field: 'name',
        search: courses
      })
    },
    include: {
      tags: true,
      courses: true,
      ingredients: true,
      author: true
    }
  })) as RecipeTypes.Recipe[];

  return {
    props: {
      recipeList,
      tagList,
      courseList
    }
  };
};

export default Recipes;
