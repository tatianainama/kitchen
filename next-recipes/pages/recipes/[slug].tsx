import { GetStaticPaths, GetStaticProps } from 'next';
import prisma from '@/lib/prisma';
import Layout from '@/components/Layout';

import { FC } from 'react';
import { Author, Ingredient, Recipe as RecipeType } from '@prisma/client';
import IngredientList from '@/components/IngredientList';

type RecipeProps = RecipeType & {
  ingredients: Ingredient[];
  author: Author;
};

export const Recipe: FC<RecipeProps> = (recipe) => (
  <Layout className="md:py-8">
    <div className="layout-container">
      <header className="relative flex flex-col md:flex-row md:border-2">
        <div
          style={{ backgroundImage: `url(${recipe.image})` }}
          className="h-48 w-full bg-cover bg-center sm:h-96 sm:border-b-2 md:border-r-2 md:border-b-0 md:h-auto md:min-h-[18rem] md:w-5/12"
        ></div>
        <div className="relative py-6 px-4 border-t-2 bg-white sm:-mt-14 sm:w-with-padding sm:border-2 sm:mx-auto md:mt-0 md:border-none md:w-7/12 md:p-6">
          <h1>{recipe.name}</h1>
          {recipe.tags.length ? (
            <ul className="flex absolute top-0 right-2 -translate-y-1/2 space-x-2 sm:relative sm:my-4 sm:translate-y-0 sm:inset-0">
              {recipe.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-black text-overline bg-primary py-1.5 px-2 shadow-strong-small"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="text-sm flex flex-col-reverse sm:flex-row justify-between my-4">
            {recipe.author && (
              <a href={recipe.author.website}>
                By{' '}
                <strong className="font-display">{recipe.author.name}</strong>
              </a>
            )}
            <ul className="flex space-x-2">
              <li>{recipe.prepTime}</li>
              <li>{recipe.cookTime}</li>
              <li>{recipe.yields}</li>
            </ul>
          </div>
          <p className="hidden sm:block">{recipe.summary}</p>
        </div>
      </header>
      <div className="bg-white border-t-2 py-6 px-4 sm:w-with-padding sm:mx-auto sm:border-2 sm:border-t-0 md:w-full md:p-6">
        <section>
          <h2>Ingredients</h2>
          <IngredientList recipe={recipe} />
        </section>
      </div>
    </div>
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug?.toString();
    const recipe = await prisma.recipe.findUnique({
      where: {
        slug
      },
      include: {
        ingredients: true,
        author: true
      }
    });

    if (!recipe) {
      throw new Error(`Couldn't find recipe with slug: ${slug}`);
    }
    return {
      props: recipe
    };
  } catch (err) {
    return {
      props: {
        errors:
          err instanceof Error
            ? err.message
            : `There was an error while fetching recipe ${params?.slug}`
      }
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: { params: { slug: string } }[] = await prisma.recipe
    .findMany({
      select: {
        slug: true
      }
    })
    .then((recipes) => recipes.map(({ slug }) => ({ params: { slug } })));
  return {
    paths: slugs,
    fallback: 'blocking'
  };
};

export default Recipe;
