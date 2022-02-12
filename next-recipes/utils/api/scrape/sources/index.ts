import { ScrapingSource } from '@/types/scraper';
import LITK from './laura-in-the-kitchen';
import ALL_RECIPES from './all-recipes';

const SOURCES = [
  LITK,
  ALL_RECIPES
];

const SelectSource = (url: string): ScrapingSource => SOURCES.find((source) => url.search(source.domain) > 0);

export default SelectSource;
