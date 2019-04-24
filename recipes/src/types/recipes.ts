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

export default interface IRecipe {
  _id: string,
  author: {
    name: string,
  },
  details: {
    preparationTime: string,
    cookingTime: string,
    servings: number
  },
  ingredients: ISubRecipe[],
  instructions: string[],
  name: string,
  summary: string,
  tags: string[],
}
