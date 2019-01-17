import { Recipe, Author, RecipeDetails, ComposedIngredients } from '../../index';
import { parseIngredients } from '../index';

const JOB_AUTHOR_DATA: Author = {
  name: 'Stephanie Jaworski',
  website: 'https://joyofbaking.com',
};

const SELECTORS = {
  TITLE: 'h1 > span.Heading',
}

function cleanText(text: string): string {
  return text.replace(/(\n|\t|\s{2,})/g, ' ').trim();
}

function getRecipeName($: CheerioSelector): string {
  return $(SELECTORS.TITLE).text().replace(/(.\n)?.Recipe.*/, '').trim();
}

function getIngredients($: CheerioSelector): ComposedIngredients[] {
  const rawData = $('td [width="249"] p').toArray();
  const isIngredient = (element: CheerioElement): boolean => $(element).hasClass('ingredient');
  const removeEquivalence = (str: string): string => str.replace(/\([0-9.]+ \w+\) ?/, '');

  let ingredients: ComposedIngredients[] = [];
  return rawData.reduce((list:any, element, index) => {
    let rawIngredient = $(element).text();
    rawIngredient = cleanText(rawIngredient);
    let last = list.length - 1;
    if(isIngredient(element)) {
      let ingredient = parseIngredients(rawIngredient);
      list[last].ingredients = list[last].ingredients.concat([{
        ...ingredient,
        name: removeEquivalence(ingredient.name)
      }]);
      return list;
    } else {
      return rawIngredient === '' ? list : list.concat([{name: rawIngredient, ingredients: []}]);
    }
  }, ingredients);
}

function getInstructions($: CheerioSelector): string[] {
  const rawData = $('td [style="border-top-style: none; border-top-width: medium"] p').toArray();
  return rawData.map(element => cleanText($(element).text()));
}


const JOB_CONFIG = {
  name: 'Joy of Baking',
  domain: 'joyofbaking',
  website: JOB_AUTHOR_DATA.website,
  scrapeRecipe: ($: CheerioSelector): Recipe => {
    return new Recipe(
      getRecipeName($),
      JOB_AUTHOR_DATA,
      new RecipeDetails(), // There is no way to scrape this data from JOB
      getIngredients($),
      getInstructions($),
    ); 
  }
}

export default JOB_CONFIG;