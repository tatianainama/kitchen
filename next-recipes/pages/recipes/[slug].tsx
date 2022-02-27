import { Chip, ChipGroup } from '@/components/Forms';
import { GetStaticPaths, GetStaticProps } from 'next';
import Container from '@/components/Layout/Container';
import prisma from '@/lib/prisma';
import Layout from '@/components/Layout';

import { Title } from '@/components/Typography/Title';
import { FC } from 'react';
import { Author, Ingredient, Recipe as RecipeType } from '@prisma/client';


type RecipeProps = RecipeType & {
  ingredients: Ingredient[];
  author: Author;
}

export const Recipe: FC<RecipeProps> = (recipe) => <Layout>
  <Container>
    <Title>{recipe.name}</Title>
    <p>{recipe.summary}</p>
    <ChipGroup>
      {recipe.tags?.map((tag, index) => <Chip label={tag} key={index} />)}
    </ChipGroup>
  </Container>
</Layout>;

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
        errors: err instanceof Error
          ? err.message
          : `There was an error while fetching recipe ${params?.slug}`
      }
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: {params: {slug: string}}[] = await prisma.recipe.findMany({
    select: {
      slug: true
    }
  }).then((recipes) => recipes.map(({ slug }) => ({ params: { slug } })));
  return {
    paths: slugs,
    fallback: 'blocking'
  };
};

export default Recipe;
