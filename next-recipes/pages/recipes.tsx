import Layout from "@/components/Layout";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Recipe } from "types/recipes";
import { Subtitle } from 'components/Typography';
import RecipeItem from "components/RecipeItem";
import { TextInput } from "@/components/Forms";
import { Button } from "@/components/Button";

export const getStaticProps = async () => {
  const res = await fetch("http://localhost:3000/recipes/all/");
  const recipeList: Recipe[] = await res.json();
  return {
    props: {
      recipeList,
    },
  };
};

const Recipes = ({
  recipeList = [],
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <div>
        <TextInput placeholder='search' id='recipe-search' />
      </div>
      <div>
        <Subtitle>Favorites</Subtitle>
      </div>
      <div>
        <Subtitle>All</Subtitle>
        {recipeList.map((recipe, index) => (
          <RecipeItem recipe={recipe} key={index} onClick={() => console.log(recipe.name)} />
        ))}
      </div>
    </Layout>
  );
};

export default Recipes;
