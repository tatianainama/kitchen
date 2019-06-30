export interface Ingredient { 
  name: string,
  quantity: number,
  unit: string,
  _original: string,
  suggestions?: Suggestion[]
}

export interface SubRecipe {
  name: string,
  ingredients: Ingredient[]
}

export interface Author {
  name: string,
  website: string,
}

export interface Details {
  url?: string,
  preparationTime: string,
  cookingTime: string,
  servings: number
}

export const _ingredient: Ingredient = {
  name: '',
  quantity: 0,
  unit: '',
  _original: ''
};

export const _subRecipe: SubRecipe = {
  name: '',
  ingredients: [_ingredient]
};

export const _recipe: Recipe = {
  _id: '',
  author: {
    name: '',
    website: '',
  },
  details: {
    url: '',
    preparationTime: '',
    cookingTime: '',
    servings: 0
  },
  ingredients: [_subRecipe],
  instructions: [ '' ],
  name: '',
  summary: '',
  tags: []
}

export interface Equivalences {
  [key:string]: number | undefined,
  cup?: number,
  tbsp?: number,
  tsp?: number,
  stick?: number,
  gr?: number,
  ml?: number,
  oz?: number,
  lb?: number,
}

type Units = 
  "cup" |
  "tbsp" |
  "tsp" |
  "stick" |
  "gr" |
  "ml" |
  "oz" |
  "lb" |
  "pint" |
  "gal" |
  "unit" |
  "pinch" |
  "to taste"
;

enum Measures {
  mass,
  volume,
  hybrid,
};

export interface Suggestion {
  _id?: string,
  name: string,
  variants?: string[],
  equivalence?: number,
  prefferedUnit: Units,
  referenceUnit: Units,
  measure: Measures,
  translation?: {
    english?: string,
    dutch?: string,
    spanish?: string
  }
}

export default interface Recipe {
  _id: string,
  author: Author,
  details: Details,
  ingredients: SubRecipe[],
  instructions: string[],
  name: string,
  summary: string,
  tags: string[],
}
