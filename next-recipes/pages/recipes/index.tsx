import { FC } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import prisma from '@/lib/prisma';

import { Chip, ChipGroup, TextInput } from '@/components/Forms';
import Container from '@/components/Layout/Container';
import Header from '@/components/Layout/Header';
import Layout from '@/components/Layout';
import RecipeItem from '@/components/RecipeItem';
import { Subtitle } from '@/components/Typography';
import { RecipeTypes } from 'additional';

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
        {recipeList.map((recipe) => <RecipeItem recipe={recipe} key={recipe.id} onClick={() => router.push(`/recipes/${recipe.slug}/`)}/>)}
      </Container>
    </Layout>
  );
};

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
