interface QtyMetric {
  qty: number;
  unit: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  state?: string;
  note?: string;
  _original?: string;
}

export interface ComposedIngredients {
  name: string;
  ingredients: Ingredient[];
}

interface Temperature {
  celsius: number;
  farenheid: number;
}

export class RecipeDetails {
  preparationTime: string;
  cookingTime: string;
  servings: number;

  constructor(
    prepTime: string = '',
    cookingTime: string = '',
    servings: number|string = 0) {
      this.preparationTime = prepTime;
      this.cookingTime = cookingTime;
      this.servings = Number(servings);
    }
}

export interface Author {
  name: string,
  website?: string,
}

export interface Recipe {
  name: string;
  ingredients?: ComposedIngredients[];
  details?: RecipeDetails;
  instructions?: string[];
  author?: Author;
  website?: string;
  tags?: string[];
  course?: string[];
  summary?: string;
}
