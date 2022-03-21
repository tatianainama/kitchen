import LITK from './laura-in-the-kitchen';
import ALL_RECIPES from './all-recipes';
import { RecipeTypes } from 'additional';

const SOURCES = [LITK, ALL_RECIPES];

const SelectSource = (url: string): RecipeTypes.ScrapingSource =>
  SOURCES.find((source) => url.search(source.domain) > 0);

export default SelectSource;
