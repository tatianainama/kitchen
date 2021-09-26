import { Chip, ChipGroup } from '@/components/Forms';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Container from '@/components/Layout/Container';
import { getAllRecipes, getRecipeById } from '@/utils/api';
import { FC } from 'react';
import Layout from '@/components/Layout';
import { Recipe as RecipeType } from '@/types/recipes';
import { Title } from '@/components/Typography/Title';

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

export const Recipe: FC<InferGetStaticPropsType<typeof getStaticProps>> = (recipe) => <Layout>
  <Container>
    <Title>{recipe.name}</Title>
    <ChipGroup>
      {recipe.tags?.map((tag, index) => <Chip label={tag} key={index} />)}
    </ChipGroup>
  </Container>
</Layout>;
export default Recipe;
