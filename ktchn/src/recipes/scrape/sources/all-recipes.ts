import { Recipe, Author, RecipeDetails, ISubRecipe } from '../../model';
import { parseIngredients } from '../index';
import { getText, getAttr, getTextList } from './../service';
import request from 'request-promise';
import { resolve } from 'dns';

const SELECTORS = {
  TITLE: 'h1#recipe-main-content',
  AUTHOR: 'span.submitter__name',
  PREP_TIME: 'time[itemprop="prepTime"]',
  COOK_TIME: 'time[itemprop="cookTime"]',
  SERVINGS: 'meta#metaRecipeServings',
  INGREDIENTS: 'div#polaris-app',
  INSTRUCTIONS: 'li.step',
  SUMMARY: 'meta#metaDescription',
  TAGS: 'meta[itemprop="recipeCategory"]',
  DATETIME: 'datetime',
  CONTENT: 'content',
  IMAGE: 'img.rec-photo',
}

function getRecipeDetails($: CheerioSelector): RecipeDetails {
  return {
    preparationTime: getAttr($)(SELECTORS.PREP_TIME, SELECTORS.DATETIME) || '',
    cookingTime: getAttr($)(SELECTORS.COOK_TIME, SELECTORS.DATETIME) || '',
    servings: Number(getAttr($)(SELECTORS.SERVINGS, SELECTORS.CONTENT)),
  };
}

function getIngredients($: CheerioSelector): ISubRecipe[] {
  const rawData = $(SELECTORS.INGREDIENTS).find('li.checkList__line');
  const isSubtitle = (element: Cheerio) => element.find('input').data('id') === 0;
  let ingredients: ISubRecipe[] = [{
    name: '',
    ingredients: [],
  }];
  rawData.each((i, element)=> {
    const label = $(element).find('label');
    if (label.attr('title')) { // matches items with ingredients
      if (isSubtitle(label)) {
        ingredients.push({
          name: label.text().trim(),
          ingredients: [],
        });
      } else {
        const last = ingredients.length - 1;
        ingredients[last].ingredients = ingredients[last].ingredients.concat([parseIngredients(label.text().trim())])
      }
    }
  })
  return ingredients;
}

function getIngredientsNew($: CheerioSelector): ISubRecipe[] {
  let ingredients: ISubRecipe[] = [{
    name: '',
    ingredients: []
  }];

  const subRecipes = $('section.recipe-ingredients-new fieldset.ingredients-section__fieldset');

  subRecipes.each((i, element) => {
    ingredients[i] = {
      name: $(element).find('legend').text().trim(),
      ingredients: $(element).find('.ingredients-item-name').map((j, e) => parseIngredients($(e).text().trim())).get()
    }
  })
  return ingredients;
}

const AR_CONFIG = {
  name: 'All Recipes',
  domain: 'allrecipes',
  website: 'https://www.allrecipes.com',
  scrapeRecipe: ($: CheerioSelector): Recipe => {
    
    const jsonData = $('script[type="application/ld+json"]').html();
    if (jsonData) {
      const recipe = JSON.parse(jsonData).find((x: any) => x['@type'] === 'Recipe');
      return {
        name: recipe.name,
        author: {
          name: recipe.author.name || '',
          website: 'https://www.allrecipes.com',
        },
        summary: recipe.description || '',
        image: recipe.image.url || '',
        details: {
          preparationTime: recipe.prepTime,
          cookingTime: recipe.cookTime,
          servings: 1
        },
        tags: recipe.recipeCategory,
        instructions: recipe.recipeInstructions.map((i: any) => i.text),
        ingredients: getIngredientsNew($)

      };
    }
    return {
      name: getText($)(SELECTORS.TITLE),
      author: {
        name: getText($)(SELECTORS.AUTHOR),
        website: 'https://www.allrecipes.com',
      },
      details: getRecipeDetails($),
      ingredients: getIngredients($),
      instructions: getTextList($)(SELECTORS.INSTRUCTIONS),
      tags: $(SELECTORS.TAGS).map((i, e) => $(e).attr('content')).get(),
      summary: getAttr($)(SELECTORS.SUMMARY, SELECTORS.CONTENT),
      image:  $(SELECTORS.IMAGE).attr('src')
    }
  },
}

export default AR_CONFIG;