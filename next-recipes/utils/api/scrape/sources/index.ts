import LITK from './laura-in-the-kitchen';
import ALL_RECIPES from './all-recipes';
import { RecipeTypes } from 'additional';
import INSPIRED_EATS from './inspired-eats';

const SOURCES = [LITK, ALL_RECIPES, INSPIRED_EATS];

const SelectSource = (url: string): RecipeTypes.ScrapingSource =>
  SOURCES.find((source) => url.search(source.domain) > 0);

export default SelectSource;
