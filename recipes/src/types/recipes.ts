export interface IIngredient { 
  name: string,
  quantity: number,
  unit: string,
  _original: string,
}
export interface IIngComponent {
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
  ingredients: IIngComponent[],
  instructions: string[],
  name: string,
  summary: string,
  tags: string[],
}
