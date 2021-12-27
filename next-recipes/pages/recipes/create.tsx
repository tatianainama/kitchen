import React, { FC } from 'react';
import { Button } from '@/components/Button';
import Layout from '@/components/Layout';
import { Prisma } from '@prisma/client';

const CreateRecipe: FC = () => {
  const submitData = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const recipe = RECIPE;
      const result = await fetch(
        '/api/recipes',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipe)
        }
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <form onSubmit={submitData}>
        <Button type="submit">Create</Button>
      </form>
    </Layout>
  );
};

const INGREDIENTS: Prisma.IngredientCreateInput[] = [
  {
    name: 'Cremini Mushroom',
    quantity: 1,
    unit: 'LB',
    note: 'cleaned, trimmed and roughly chopped'
  },
  {
    name: 'Shallot',
    quantity: 2,
    unit: 'UNIT',
    note: 'roughly chopped'
  },
  {
    name: 'Garlic',
    quantity: 3,
    unit: 'CLOVES',
    note: 'roughly chopped'
  },
  {
    name: 'Thyme',
    quantity: 1,
    unit: 'TBSP',
    note: 'leaves picked from the stem'
  }
];

type Recipe = Prisma.RecipeCreateInput & {
  ingredients: Prisma.IngredientCreateInput[],
  author: Prisma.AuthorCreateInput,
}

const RECIPE: Recipe = {
  name: 'Beef Wellington',
  summary: '',
  prepTime: 'PT45M',
  cookTime: 'PT1H0M',
  totalTime: 'PT1H45M',
  yields: 8,
  tags: [
    'beef',
    'fancy'
  ],
  course: ['main'],
  url: 'https://laurainthekitchen.com/recipes/ultimate-beef-wellington/',
  author: {
    name: 'Laura in the Kitchen',
    website: 'https://laurainthekitchen.com/'
  },
  instructions: [
    'In the bowl of a food processor, add the mushrooms, shallots and garlic and pulse until very finely chopped (you might need to do this in batches) cook in the butter and olive oil along with the thyme and salt and pepper and cook on medium heat until all the moisture cooks out and the mushroom mixture has cooked down by about half, set aside to cool completely.',
    'While the mushrooms are cooking, season the beef really well on all sides with plenty of salt and pepper then sear in a screaming hot cast iron skillet with a touch of neutral oil until very deeply browned, set aside to cool. Once the beef is cooled, brush evenly on all sides with the mustard.',
    'Lay a couple sheets of plastic wrap on your work surface (overlapping) and lay out the prosciutto in a single layer (large enough to roll the beef in) then carefully smear the cooled mushrooms mixture on the prosciutto, place the beef on one end and roll tightly with the prosciutto using the plastic wrap as your guide.',
    'Wrap the beef tightly in the plastic wrap, refrigerate for 30 minutes.'
  ],
  ingredients: INGREDIENTS
};


export default CreateRecipe;
