import { FC } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import prisma from '@/lib/prisma';
import { RecipeTypes } from 'additional';
import Layout from '@/components/Layout';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Prisma, Tag } from '@prisma/client';

type SearchFormType = { name: string; tags: string[] };

const Search: FC<Pick<RecipeTypes.Recipe, 'tags'>> = ({ tags }) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SearchFormType>({
    defaultValues: {
      name: '',
      tags: []
    }
  });

  const submit: SubmitHandler<SearchFormType> = (data, event) => {
    event.preventDefault();
    router.push({
      query: data
    });
  };

  return (
    <form
      className="layout-container md:w-with-padding p-4 pb-3 md:px-0 md:pb-4"
      onSubmit={handleSubmit(submit)}
    >
      <div className="flex flex-col justify-between sm:flex-row sm:min-h-[32px] gap-4">
        <input
          type="text"
          className="input min-w-[200px] flex-1"
          placeholder="Search"
          {...register('name')}
        />
        {tags.length ? (
          <div className="flex gap-2 overflow-x-auto overflow-y-hidden">
            {tags.map((tag) => (
              <label
                htmlFor={tag.name}
                key={tag.name}
                className="cursor-pointer mb-2"
              >
                <input
                  type="checkbox"
                  value={tag.name}
                  id={tag.name}
                  className="appearance-none h-0 w-0 peer"
                  {...register('tags')}
                />
                <span className="inline border border-black text-overline bg-white py-1.5 px-2 hover:bg-grey-50 peer-checked:bg-primary font-normal select-none whitespace-nowrap">
                  {tag.name}
                </span>
              </label>
            ))}
          </div>
        ) : null}
      </div>
      <button className="btn-default block mt-4 ml-auto mr-0">search</button>
    </form>
  );
};

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
