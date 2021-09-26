import { Chip, ChipGroup, TextInput } from '@/components/Forms';
import { getAllRecipes, getAllTags } from '@/utils/api';
import Container from '@/components/Layout/Container';
import Header from '@/components/Layout/Header';
import { InferGetStaticPropsType } from 'next';
import Layout from '@/components/Layout';

import RecipeItem from 'components/RecipeItem';
import { Subtitle } from 'components/Typography';


export const getStaticProps = async () => {

  const recipeList = await getAllRecipes(),
    tags = await getAllTags();
  return {
    'props': {
      recipeList,
      'tags': tags.map((tag) => tag.name)
    }
  };

};

const Recipes = ({
  recipeList = [],
  tags
}: InferGetStaticPropsType<typeof getStaticProps>) => <Layout>
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
    {recipeList.map((recipe, index) => <RecipeItem recipe={recipe} key={recipe._id} onClick={() => console.log(recipe._id)} />)}
  </Container>
</Layout>;

export default Recipes;
