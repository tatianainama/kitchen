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

const parseIngredient = (ingredientString: string): ParsedIngredient => {
  try {
    const parsedIngredient = parse(ingredientString);
    const [
      ingredient,
      notes
    ] = parsedIngredient.ingredient.split(', ');
    return {
      quantity: parsedIngredient.quantity,
      unit: parsedIngredient.unit,
      ingredient: sanitizeIngredient(ingredient),
      notes,
      original: ingredientString
    };
  } catch (e) {
    const [
      ingredient,
      notes
    ] = ingredientString.split(', ');
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
