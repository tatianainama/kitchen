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
  [key:string]: number|string 
  preparationTime: number|string; // TODO: Change this type to string when all scrapes get ISO8601 duration format
  cookingTime: number|string;
  servings: number|string;

  constructor(
    prepTime:number|string = 0,
    cookingTime:number|string = 0,
    servings:number|string = 0) {
      this.preparationTime = Number(prepTime);
      this.cookingTime = Number(cookingTime);
      this.servings = Number(servings);
    }
}

export interface Author {
  name: string,
  website?: string,
}

export class Recipe {
  public name: string;
  tags!: string[];
  ingredients!: ComposedIngredients[];
  details!: RecipeDetails;
  instructions!: string[];
  author: Author;

  constructor(
    name: string,
    author: Author,
    details?: RecipeDetails,
    ingredients?: ComposedIngredients[],
    instructions?: string[],
  ) {
    this.name = name;
    this.author = author;
    this.details = details || new RecipeDetails();
    this.ingredients = ingredients || [];
    this.instructions = instructions || [];
  }
}