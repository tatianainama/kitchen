import { parse } from 'recipe-ingredient-parser-v2';

export type ParsedIngredient = {
  quantity: string;
  unit: string;
  ingredient: string;
  note: string;
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

const getNotes = (ingredient: string): { ingredient: string, note: string} => {
  if (parentheticalReg.test(ingredient)) {
    const { groups } = ingredient.match(parentheticalReg);
    return {
      ingredient: groups.text.trim(),
      note: groups.parenthetical
    };
  }
  const [
    text,
    note
  ] = ingredient.split(', ');
  return {
    ingredient: text,
    note
  };
};

const parseIngredient = (ingredientString: string): ParsedIngredient => {
  try {
    const parsedIngredient = parse(ingredientString);
    const {
      ingredient,
      note
    } = getNotes(parsedIngredient.ingredient);
    return {
      quantity: parsedIngredient.quantity,
      unit: parsedIngredient.unit,
      ingredient: sanitizeIngredient(ingredient),
      note,
      original: ingredientString
    };
  } catch (e) {
    const {
      ingredient,
      note
    } = getNotes(ingredientString);
    return {
      quantity: null,
      unit: null,
      ingredient: sanitizeIngredient(ingredient),
      note,
      original: ingredientString
    };
  }
};

export default parseIngredient;
