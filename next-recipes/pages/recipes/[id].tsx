import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getAllRecipes, getRecipeById } from '@/utils/api';
import { FC } from 'react';
import Layout from '@/components/Layout';
import { Recipe as RecipeType } from '@/types/recipes';

export const getStaticPaths: GetStaticPaths = async () => {
  const recipes = await getAllRecipes(),
    paths = recipes.map(({ _id }) => ({
      'params': {
        'id': _id
      }
    }));
  return {
    paths,
    fallback: false
  };

};

export const getStaticProps: GetStaticProps<RecipeType> = async ({ params }) => {
  const recipeData = await getRecipeById(params.id);
  return {
    'props': recipeData
  };

};

export const Recipe: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ name }) => <Layout>
  <h1>{name}</h1>
</Layout>;

export default Recipe;
