export interface IIngredient { 
  name: string,
  quantity: number,
  unit: string,
  _original: string,
}

export interface ISubRecipe {
  name: string,
  ingredients: IIngredient[]
}

export interface IAuthor {
  name: string,
  website: string,
}

export interface IDetails {
  url?: string,
  preparationTime: string,
  cookingTime: string,
  servings: number
}

export const _ingredient: IIngredient = {
  name: '',
  quantity: 0,
  unit: '',
  _original: ''
};

export const _subRecipe: ISubRecipe = {
  name: '',
  ingredients: [_ingredient]
};

export const _recipe: IRecipe = {
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

export default interface IRecipe {
  _id: string,
  author: IAuthor,
  details: IDetails,
  ingredients: ISubRecipe[],
  instructions: string[],
  name: string,
  summary: string,
  tags: string[],
}
