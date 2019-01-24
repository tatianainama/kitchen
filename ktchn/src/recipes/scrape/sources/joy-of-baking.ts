import { Recipe, Author, RecipeDetails, ComposedIngredients } from '../../model';
import { parseIngredients } from '../index';
import { rmBreakLines, getText, rmEquivalence } from './../service';

const JOB_AUTHOR_DATA: Author = {
  name: 'Stephanie Jaworski',
  website: 'https://joyofbaking.com',
};

const SELECTORS = {
  TITLE: 'h1 > span.Heading',
}

function getRecipeName($: CheerioSelector): string {
  return getText($)(SELECTORS.TITLE).replace(/(.\n)?.Recipe.*/, '').trim();
}

function getIngredients($: CheerioSelector): ComposedIngredients[] {
  const rawData = $('td [width="249"] p').toArray();
  const isIngredient = (element: CheerioElement): boolean => $(element).hasClass('ingredient');

  let ingredients: ComposedIngredients[] = [];
  return rawData.reduce((list:any, element, index) => {
    let rawIngredient = $(element).text();
    rawIngredient = rmBreakLines(rawIngredient);
    let last = list.length - 1;
    if(isIngredient(element)) {
      let ingredient = parseIngredients(rawIngredient);
      list[last].ingredients = list[last].ingredients.concat([{
        ...ingredient,
        name: rmEquivalence(ingredient.name)
      }]);
      return list;
    } else {
      return rawIngredient === '' ? list : list.concat([{name: rawIngredient, ingredients: []}]);
    }
  }, ingredients);
}

function getInstructions($: CheerioSelector): string[] {
  const rawData = $('td [style="border-top-style: none; border-top-width: medium"] p').toArray();
  return rawData.map(element => rmBreakLines($(element).text()));
}


const JOB_CONFIG = {
  name: 'Joy of Baking',
  domain: 'joyofbaking',
  website: JOB_AUTHOR_DATA.website,
  scrapeRecipe: ($: CheerioSelector): Recipe => {
    return {
      name: getRecipeName($),
      author: JOB_AUTHOR_DATA,
      details: new RecipeDetails(), // There is no way to scrape this data from JOB
      ingredients: getIngredients($),
      instructions: getInstructions($),
    }; 
  }
}

export default JOB_CONFIG;