import { FC } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import prisma from '@/lib/prisma';
import { RecipeTypes } from 'additional';
import Layout from '@/components/Layout';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

type SearchFormType = Pick<RecipeTypes.Recipe, 'tags'> & { name: string };

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
              <label htmlFor={tag} key={tag} className="cursor-pointer mb-2">
                <input
                  type="checkbox"
                  value={tag}
                  id={tag}
                  className="appearance-none h-0 w-0 peer"
                  {...register('tags')}
                />
                <span className="inline border border-black text-overline bg-white py-1.5 px-2 hover:bg-grey-50 peer-checked:bg-primary font-normal select-none whitespace-nowrap">
                  {tag}
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
    <div className="layout-container md:w-with-padding">
      <nav className="flex flex-col justify-between sm:flex-row sm:items-center">
        <h1>recipes</h1>
        <Link href={`/recipes/create`}>
          <a className="btn-outline">Create Recipe</a>
        </Link>
      </nav>
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

export const getServerSideProps: GetServerSideProps<{
  recipeList: RecipeTypes.Recipe[];
  tagList: string[];
}> = async (context) => {
  const { tags, name } = context.query;
  const nameQuery = name
    ? {
        name: {
          contains: Array.isArray(name) ? name.join(' ') : name,
          mode: 'insensitive'
        }
      }
    : {};
  const tagsQuery = tags
    ? { tags: { hasSome: Array.isArray(tags) ? tags : [tags] } }
    : {};

  const tagList = await prisma.recipe
    .findMany({
      select: {
        tags: true
      }
    })
    .then((list) =>
      Array.from(new Set(list.map((recipe) => recipe.tags).flat()))
    );

  const recipeList = (await prisma.recipe.findMany({
    where: {
      ...nameQuery,
      ...tagsQuery
    },
    include: {
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
