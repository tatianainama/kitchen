import { Recipe, ISubRecipe } from "../../model";
import { parseIngredients } from '../index';
import { getText, getTextList } from './../service';

function getIngredients($: CheerioSelector): ISubRecipe[] {
  return $('.entry.clearfix ul').map((i, subRecipe) => {
    return {
      name: '',
      ingredients: $(subRecipe).find('li').map((i, ing) => parseIngredients($(ing).text().trim())).get()
    }
  }).get();
}

function getInstructions($: CheerioSelector): string [] {
  return $('.entry.clearfix ol li').map((i, instruction) => $(instruction).text().trim()).get()
}

const MAANGCHI_CONFIG = {
  name: 'Maangchi',
  domain: 'maangchi',
  website: 'https://www.maangchi.com',
  scrapeRecipe: ($: CheerioSelector): Recipe => ({
    name: getText($)('h1.entry-title'),
    author: { 
      name: 'Maangchi', website: 'https://www.maangchi.com' },
    details: {
      cookingTime: '',
      servings: 1,
      preparationTime: '',
      video: $('iframe').attr('src'),
    },
    ingredients: getIngredients($),
    instructions: getInstructions($),
    summary: $('.entry.clearfix > p').text().trim(),
    tags: getTextList($)('.sidebar li span[itemprop="recipeCategory"] a'),
    image: $('img.video-embed-poster').attr('src')
  }),
}

export default MAANGCHI_CONFIG;