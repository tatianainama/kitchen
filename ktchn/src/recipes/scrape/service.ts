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

export const units = (unit: string|null) => {
  const units: { [unit: string]: string,} = {
    cup: 'cup',
    gallon: 'gal',
    ounce: 'oz',
    pint: 'pt',
    pound: 'lb',
    quart: 'qt',
    tablespoon: 'tbsp',
    teaspoon: 'tsp',
    gram: 'g',
    kilogram: 'kg',
    liter: 'l',
    milligram: 'mg',
    milliliter: 'ml',
    package: 'package',
    stick: 'stick',
    clove: 'clove',
    bag: 'bag',
    box: 'box',
    pinch: 'pinch',
    can: 'can',
    slice: 'slice'
  }

  return unit ? units[unit] : ''
};