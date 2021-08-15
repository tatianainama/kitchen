import Layout from "@/components/Layout";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getAllRecipes, getAllTags } from '@/utils/api';
import Header from '@/components/Layout/Header';
import Container from '@/components/Layout/Container';

import { Subtitle } from 'components/Typography';
import RecipeItem from "components/RecipeItem";
import { TextInput, ChipGroup, Chip } from "@/components/Forms";


export const getStaticProps = async () => {
  const recipeList = await getAllRecipes();
  const tags = await getAllTags();
  return {
    props: {
      recipeList,
      tags: tags.map(tag => tag.name),
    },
  };
};

const Recipes = ({
  recipeList = [],
  tags
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <Header>
        <TextInput placeholder='search' id='recipe-search' />
        <ChipGroup>
          {tags.map(tag => (
            <Chip key={tag} label={tag} color='primary' />
          ))}
        </ChipGroup>
      </Header>
      <Container>
        <Subtitle>Favorites</Subtitle>
      </Container>
      <Container>
        <Subtitle>All</Subtitle>
        {recipeList.map((recipe, index) => (
          <RecipeItem recipe={recipe} key={index} onClick={() => console.log(recipe.name)} />
        ))}
      </Container>
    </Layout>
  );
};

export default Recipes;
