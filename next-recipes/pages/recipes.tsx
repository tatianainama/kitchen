import { GetStaticProps, InferGetStaticPropsType } from 'next';

type Recipe = {
  title: string,
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('http://localhost:3000/recipes/all/');
  const recipeList: Recipe[] = await res.json();
  return {
    props: {
      recipeList
    }
  }
}

const Recipes = ({ recipeList = [] }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return(
    <div>
      <h1>Recipes</h1>
      {recipeList.map((recipe, index) => (
        <div key={index}>
          <h3>{recipe.name}</h3>
        </div>
      ))}
    </div>
  )
}

export default Recipes;