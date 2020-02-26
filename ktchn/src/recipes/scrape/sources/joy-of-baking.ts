import { Recipe, Author, RecipeDetails, ISubRecipe } from '../../model';
import { parseIngredients } from '../index';
import { rmBreakLines, getText, rmEquivalence } from './../service';

const JOB_AUTHOR_DATA: Author = {
  name: 'Stephanie Jaworski',
  website: 'https://joyofbaking.com',
};

const SELECTORS = {
  TITLE: 'h1 > span.Heading',
  IMAGE: 'p[align="left"] img',
  VIDEO: 'iframe[allowfullscreen]'
}

function getRecipeName($: CheerioSelector): string {
  return getText($)(SELECTORS.TITLE).replace(/(.\n)?.Recipe.*/, '').trim();
}

function getIngredients($: CheerioSelector): ISubRecipe[] {
  const rawData = $('td [width="252"] p').toArray();
  const isIngredient = (element: CheerioElement): boolean => $(element).hasClass('ingredient');
  let ingredients: ISubRecipe[] = [{name: '', ingredients: []}];
  return rawData.reduce((list:any, element, index) => {
    let rawIngredient = $(element).text();
    rawIngredient = rmBreakLines(rawIngredient);
    let last = list.length ? list.length - 1 : 0;

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
  website: JOB_AUTHOR_DATA.website || '',
  scrapeRecipe: ($: CheerioSelector): Recipe => {
    return {
      name: getRecipeName($),
      author: JOB_AUTHOR_DATA,
      details: {
        ...new RecipeDetails(),
        video: $(SELECTORS.VIDEO).attr('src')
      }, // There is no way to scrape this data from JOB
      ingredients: getIngredients($),
      instructions: getInstructions($),
      image: `${JOB_AUTHOR_DATA.website}/${$(SELECTORS.IMAGE).attr('src')}`
    }; 
  }
}

export default JOB_CONFIG;