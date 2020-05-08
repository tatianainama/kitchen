import LITK from "./laura-in-the-kitchen";
import JOB from './joy-of-baking';
import AR from './all-recipes';
import HCA from './home-cooking-adventure';
import JOC from './just-one-cookbook';
import MAANGCHI from './maangchi';
import EME from './el-mundo-eats';
import { Recipe } from '../../model';


export interface ScrapingSource {
  name: string,
  domain: string,
  website: string,
  scrapeRecipe($: CheerioSelector): Recipe,
}

const Sources: ScrapingSource[] = [
  LITK,
  JOB,
  AR,
  HCA,
  JOC,
  MAANGCHI,
  EME
];

export default Sources;