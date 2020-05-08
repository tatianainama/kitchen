import { Recipe, ISubRecipe } from "../../model";
import { ScrapingSource } from ".";
import { flatten } from 'ramda';
import { parseIngredients } from '../index';

const getIngredients = ($: CheerioSelector): ISubRecipe[] => {
  const groups = $('.wprm-recipe-ingredients-container').find('.wprm-recipe-ingredient-group');

  return groups.map((i, ingredientGroup) => {
    return {
      name: $(ingredientGroup).find('h4').text().trim(),
      ingredients: $(ingredientGroup).find('li.wprm-recipe-ingredient').map((i, ingredient) => {
        return parseIngredients($(ingredient).text().trim())
      }).get()
    }
  }).get()
} 

const EME_CONFIG: ScrapingSource = {
  name: 'El mundo eats',
  domain: 'elmundoeats',
  website: 'https://www.elmundoeats.com/',
  scrapeRecipe: ($: CheerioSelector): Recipe => {
    const jsonData = $('script[type="application/ld+json"]').html();
    if (jsonData) {
      const recipe = JSON.parse(jsonData)['@graph'].find((x: any) => x['@type'] === 'Recipe');
      return {
        name: recipe.name,
        author: {
          name: recipe.author.name || 'El mundo eats',
          website: 'https://www.elmundoeats.com/',
        },
        summary: recipe.description || '',
        image: recipe.image[0] || '',
        details: {
          preparationTime: recipe.prepTime,
          cookingTime: recipe.cookTime,
          servings: parseInt(recipe.recipeYield) || 1,
          video: $('iframe').attr('src')
        },
        instructions: flatten(recipe.recipeInstructions.map((i: any) => {
          if (i.itemListElement) {
            return i.itemListElement.map((e: any) => e.text)
          } else {
            return []
          }
        })),
        ingredients: getIngredients($),
      };
    } else {
      return {
        name: '',
        author: {
          name: 'El mundo eats',
          website: 'https://www.elmundoeats.com/',
        },
        summary:  '',
        details: {
          preparationTime: '',
          cookingTime: '',
          servings: 1,
        },
        instructions: [],
        ingredients: []
      }
    }
  },
}

export default EME_CONFIG;