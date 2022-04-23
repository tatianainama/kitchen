import { UnitName } from '@prisma/client';
import { parse } from 'recipe-ingredient-parser-v2';

export type ParsedIngredient = {
  quantity: string;
  unit: UnitName | null;
  ingredient: string;
  note: string;
  original: string;
};

const sanitizeIngredient = (ingredient: string): string =>
  ingredient.startsWith('of') ? ingredient.replace('of ', '') : ingredient;

const parentheticalReg = /(?<text>.*?)\((?<parenthetical>.*?)\)/u;

const getNotes = (ingredient: string): { ingredient: string; note: string } => {
  if (parentheticalReg.test(ingredient)) {
    const { groups } = ingredient.match(parentheticalReg);
    return {
      ingredient: groups.text.trim(),
      note: groups.parenthetical
    };
  }
  const [text, note] = ingredient.split(', ');
  return {
    ingredient: text,
    note
  };
};

const parseIngredient = (ingredientString: string): ParsedIngredient => {
  try {
    const parsedIngredient = parse(ingredientString.toLowerCase());
    const { ingredient, note } = getNotes(parsedIngredient.ingredient);
    return {
      quantity: parsedIngredient.quantity,
      unit: parseUnit(parsedIngredient.unit),
      ingredient: sanitizeIngredient(ingredient),
      note,
      original: ingredientString
    };
  } catch (e) {
    const { ingredient, note } = getNotes(ingredientString);
    return {
      quantity: null,
      unit: UnitName.UNIT,
      ingredient: sanitizeIngredient(ingredient),
      note,
      original: ingredientString
    };
  }
};

const possibilities = {
  [UnitName.CUP]: ['CUPS', 'CPS'],
  [UnitName.CLOVES]: ['CLOVE'],
  [UnitName.G]: ['GR', 'GRAM', 'GRAMS', 'GRS'],
  [UnitName.GAL]: ['GALLON', 'GALS', 'GALLONS'],
  [UnitName.L]: ['LITRE', 'LITER', 'LITERS'],
  [UnitName.ML]: ['MILS', 'MILILITER', 'MILLILITERS', 'MILLILITER'],
  [UnitName.LB]: ['POUND', 'POUNDS'],
  [UnitName.OZ]: ['OUNCE', 'OUNCES'],
  [UnitName.PINCH]: ['PINCHES'],
  [UnitName.TBSP]: ['TABLESPOON', 'TBP', 'TP', 'TABLESPOONS'],
  [UnitName.TSP]: ['TEASPOON', 'TEASPOONS', 'TS'],
  [UnitName.SMALL]: ['SMALL', 'SM'],
  [UnitName.LARGE]: ['LARGE', 'LG']
};

export const parseUnit = (unitInput?: string): UnitName | null => {
  if (!unitInput || unitInput === '') {
    return null;
  }
  const test = unitInput.toUpperCase().replaceAll(' ', '_');
  const values = Object.values(UnitName);
  if (values.some((unit) => unit === test)) {
    return UnitName[test];
  }
  for (const [unit, values] of Object.entries(possibilities)) {
    if (values.includes(test)) {
      return unit as UnitName;
    }
  }
  return null;
};

export default parseIngredient;
