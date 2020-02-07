import { Recipe, RecipeDetails, IIngredient, ISubRecipe, Author } from '../../model';
import { parseIngredients } from '../index';
import { getText, getTextList, getAttr } from "./../service";

const LITK_AUTHOR_DATA: Author = {
  name: 'Laura Vitale',
  website: 'http://www.laurainthekitchen.com',
};

const SELECTORS = {
  TITLE: '.cs-page-title > h1',
  DETAILS: 'script[type="application/ld+json"]',
  INGREDIENTS: '.cs-ingredients-check-list > ul',
  INSTRUCTIONS: '#recipe-process > ul',
  IMAGE: 'div.ytp-cued-thumbnail-overlay-image',
  VIDEO: 'div#video-div iframe'
}

function getRecipeDetails($: CheerioSelector): RecipeDetails {
  const x = $(SELECTORS.DETAILS);
  let parsedScript = JSON.parse(($(x).html()||'').replace(/(\n|\t|\s{2,})/g, ' ').trim())

  return {
    ...new RecipeDetails(
      parsedScript.prepTime,
      parsedScript.cookTime,
      parsedScript.recipeYield.match(/\d/)[0],
    ),
    video: $(SELECTORS.VIDEO).attr('src')
  };
}

function getIngredients($: CheerioSelector): ISubRecipe[] {
  const ingredientsScrape = $(SELECTORS.INGREDIENTS).children();
  const isNewIngredientList = (tagName: string): boolean => tagName === 'span';
  
  let ingredients: ISubRecipe[] = [{name: '', ingredients: []}];
  return ingredientsScrape.toArray().reduce((list, rawIngredient)=>{
    let last = list.length - 1;
    let text = $(rawIngredient).text();

    if (isNewIngredientList(rawIngredient.tagName)) {
      return list.concat([{name: text, ingredients: []}]);
    } else {
      list[last].ingredients = list[last].ingredients.concat([parseIngredients(text)]);
      return list;
    }
  }, ingredients);
}

function getInstructions($: CheerioSelector): string[] {
  const data = getText($)(SELECTORS.INSTRUCTIONS);
  return data.split('\n').filter(s => s !== '').map(s => s.trim().replace(/^\d\)\s*/, ''));
}

const getImage = ($: CheerioSelector) => {
  try {
    const image = `${LITK_AUTHOR_DATA.website}/500x300thumbnails/${getText($)(SELECTORS.TITLE).toLowerCase().replace(/ /g, '-')}.jpg`;
    return image
  } catch (e) {
    return ''
  }
}
const LITK_CONFIG = {
  name: 'Laura in the Kitchen',
  domain: 'laurainthekitchen',
  website: LITK_AUTHOR_DATA.website,
  scrapeRecipe: ($: CheerioSelector): Recipe => ({
    name: getText($)(SELECTORS.TITLE),
    author: LITK_AUTHOR_DATA,
    details: getRecipeDetails($),
    ingredients: getIngredients($),
    instructions: getInstructions($),
    image: getImage($)
  })
}

export default LITK_CONFIG;