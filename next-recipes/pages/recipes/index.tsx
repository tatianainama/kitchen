import { FC } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getAllTags } from '@/utils/api';
import prisma from '@/lib/prisma';

import { Chip, ChipGroup, TextInput } from '@/components/Forms';
import Container from '@/components/Layout/Container';
import Header from '@/components/Layout/Header';
import Layout from '@/components/Layout';
import RecipeItem from '@/components/RecipeItem';
import { Subtitle } from '@/components/Typography';
import { Recipe, RecipeIngredient, Author } from '@prisma/client';

type RecipeResult = Recipe & {
  ingredients: RecipeIngredient[];
  author: Author;
}

const Recipes: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  recipeList,
  tags
}) => {
  const router = useRouter();
  return (
    <Layout>
      <Header>
        <TextInput placeholder="search" id="recipe-search" />
        <ChipGroup>
          {tags.map((tag) => <Chip key={tag} label={tag} color="primary" />)}
        </ChipGroup>
      </Header>
      <Container>
        <Subtitle>Favorites</Subtitle>
      </Container>
      <Container>
        <Subtitle>All</Subtitle>
        {recipeList.map((recipe) => <RecipeItem recipe={recipe} key={recipe.id} onClick={() => router.push(`/recipes/${recipe.id}/`)}/>)}
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<{ recipeList: RecipeResult[], tags: string[]}> = async () => {
  const recipeList = await prisma.recipe.findMany({
    include: {
      ingredients: true,
      author: true
    }
  });

  const tags = await getAllTags();

  return {
    props: {
      recipeList,
      tags: tags.map((tag) => tag.name)
    }
  };
};

export default Recipes;
