import { Chip, ChipGroup } from '@/components/Forms';
import { GetServerSideProps } from 'next';
import Container from '@/components/Layout/Container';
import { Recipe as RecipeType, Author, RecipeIngredient } from '@prisma/client';
import prisma from '@/lib/prisma';
import { FC } from 'react';
import Layout from '@/components/Layout';

import { Title } from '@/components/Typography/Title';

type RecipeProps = RecipeType & {
  ingredients: RecipeIngredient[];
  author: Author;
}

export const Recipe: FC<RecipeProps> = (recipe) => <Layout>
  <Container>
    <Title>{recipe.name}</Title>
    <ChipGroup>
      {recipe.tags?.map((tag, index) => <Chip label={tag} key={index} />)}
    </ChipGroup>
  </Container>
</Layout>;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const recipe = await prisma.recipe.findUnique({
    where: {
      id: Number(params?.id || -1)
    },
    include: {
      ingredients: true,
      author: true
    }
  });
  return {
    props: recipe
  };
};

export default Recipe;
