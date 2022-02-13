import { parse } from 'recipe-ingredient-parser-v2';

export type ParsedIngredient = {
  quantity: string;
  unit: string;
  ingredient: string;
  notes: string;
  original: string;
}

// eslint-disable-next-line no-extra-parens
const sanitizeIngredient = (ingredient: string): string => (ingredient.startsWith('of')
  ? ingredient.replace(
    'of ',
    ''
  )
  : ingredient);

const parentheticalReg = /(?<text>.*?)\((?<parenthetical>.*?)\)/u;

const getNotes = (ingredient: string): { ingredient: string, notes: string} => {
  if (parentheticalReg.test(ingredient)) {
    const { groups } = ingredient.match(parentheticalReg);
    return {
      ingredient: groups.text.trim(),
      notes: groups.parenthetical
    };
  }
  const [
    text,
    notes
  ] = ingredient.split(', ');
  return {
    ingredient: text,
    notes
  };
};

const parseIngredient = (ingredientString: string): ParsedIngredient => {
  try {
    const parsedIngredient = parse(ingredientString);
    const {
      ingredient,
      notes
    } = getNotes(parsedIngredient.ingredient);
    return {
      quantity: parsedIngredient.quantity,
      unit: parsedIngredient.unit,
      ingredient: sanitizeIngredient(ingredient),
      notes,
      original: ingredientString
    };
  } catch (e) {
    const {
      ingredient,
      notes
    } = getNotes(ingredientString);
    return {
      quantity: null,
      unit: null,
      ingredient: sanitizeIngredient(ingredient),
      notes,
      original: ingredientString
    };
  }
};

export default parseIngredient;
