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
  ingredients: {
    name: string,
    ingredients: {
      name: string,
      quantity: number,
      unit: string,
      _original: string,
    }[]
  }[],
  instructions: string[],
  name: string,
  summary: string,
  tags: string[],
}
