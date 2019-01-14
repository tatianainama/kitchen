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
  [key:string]: number 
  preparationTime: number;
  cookingTime: number;
  servings: number;

  constructor(
    prepTime:number|string = 0,
    cookingTime:number|string = 0,
    servings:number|string = 0) {
      this.preparationTime = Number( );
      this.cookingTime = Number(cookingTime);
      this.servings = Number(servings);
    }
}

export class Recipe {
  public name: string;
  tags!: string[];
  ingredients!: ComposedIngredients[];
  details!: RecipeDetails;
  directions!: string[];

  constructor(
    name: string,
    details?: RecipeDetails,
    ingredients?: ComposedIngredients[]
  ) {
    this.name = name;
    this.details = details || new RecipeDetails();
    this.ingredients = ingredients || [];
  }
}