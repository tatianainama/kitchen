interface QtyMetric {
  qty: number;
  unit: string;
}

interface Ingredient {
  name: string;
  qtyMetric: QtyMetric;
  qtyCups: number;
  note: string;
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
      this.preparationTime = Number(prepTime);
      this.cookingTime = Number(cookingTime);
      this.servings = Number(servings);
    }
}

export class Recipe {
  public name: string;
  tags!: string[];
  ingredients!: Ingredient[];
  details!: RecipeDetails;
  directions!: string[];

  constructor(name:string, details?:RecipeDetails) {
    this.name = name;
    this.details = details || new RecipeDetails();
  }
}