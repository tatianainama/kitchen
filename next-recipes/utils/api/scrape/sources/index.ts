import { ScrapingSource } from '@/types/scraper';
import LITK from './laura-in-the-kitchen';

const SOURCES = [LITK];

const SelectSource = (url: string): ScrapingSource => SOURCES.find((source) => url.search(source.domain) > 0);

export default SelectSource;
