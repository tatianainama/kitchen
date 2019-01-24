import { Recipe } from '../model';

type MapFc = (i: number, element: CheerioElement) => string;

export const getTextList =
  ($: CheerioSelector) => (SELECTOR: string, mapFc?:MapFc): string[] => {
    return $(SELECTOR).map((mapFc ? mapFc : (i, e) => $(e).text().trim())).get()
  };

export const getAttr =
  ($: CheerioSelector) => (SELECTOR: string, ATTR: string) => $(SELECTOR).attr(ATTR);

export const getText =
  ($: CheerioSelector) => (SELECTOR: string): string => $(SELECTOR).text().trim();

export const rmBreakLines = (str: string): string => str.replace(/(\n|\t|\s{2,})/g, ' ').trim();

export const rmEquivalence = (str: string): string => str.replace(/\([0-9.]+ \w+\) ?/, '');