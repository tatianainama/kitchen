import { ObjectID } from 'mongodb';
import Ingredient from '../ingredients/model';

interface QtyMetric {
  qty: number;
  unit: string;
}

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
  state?: string;
  notes?: string;
  _original?: string;
}

export interface IngredientSuggestion extends IIngredient { 
  suggestions: Ingredient[],
}

export interface ISubRecipe {
  name: string;
  ingredients: IIngredient[];
}

interface Temperature {
  celsius: number;
  farenheid: number;
}

export class RecipeDetails {
  preparationTime: string;
  cookingTime: string;
  servings: number;
  url?: string;
  video?: string;

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
  ingredients: ISubRecipe[];
  details?: RecipeDetails;
  instructions?: string[];
  author?: Author;
  website?: string;
  tags?: string[];
  course?: string[];
  summary?: string;
  image?: string;
}

export interface ScrapedRecipe extends Recipe {
  ingredients: {
    name: string,
    ingredients: IngredientSuggestion[]
  }[];
}

export interface RecipeDB extends Recipe {
  _id: ObjectID;
}