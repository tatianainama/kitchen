import Layout from "@/components/Layout";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Recipe } from "types/recipes";
import RecipeItem from "components/RecipeItem";

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
      <p>
        No aliquip repudiare vis, consul deterruisset ne est, nec aliquid
        mediocrem argumentum at. Nec malis saepe in. Legere nostrum eu eos, nam
        ea facer diceret repudiare. Ad dicta omnes has. Ut tale brute vis, usu
        ei solet dolores. Fuisset periculis in has.
      </p>
      <h1>Recipes</h1>
      {recipeList.map((recipe, index) => (
        <RecipeItem recipe={recipe} key={index} />
      ))}
    </Layout>
  );
};

export default Recipes;
