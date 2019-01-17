import LITK from "./laura-in-the-kitchen";
import JOB from './joy-of-baking';
import { Recipe } from '../../index';

export interface ScrapingSource {
  name: string,
  domain: string,
  website?: string,
  scrapeRecipe($: CheerioSelector): Recipe,
}

const Sources: ScrapingSource[] = [
  LITK,
  JOB,
];

export default Sources;