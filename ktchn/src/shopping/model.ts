export type Unit =
'cup' |
'gal' |
'oz' |
'pt' |
'lb' |
'qt' |
'tbsp' |
'tsp' |
'g' |
'kg' |
'l' |
'mg' |
'ml' |
'pkg' |
'sticks' |
'pinch' |
'to taste'
;

export interface ShoppingItem {
  name: string,
  quantity: number,
  unit: Unit
  recipeIds: string[]
}

export interface ShoppingList {
  items: ShoppingItem[],
  date: Date
}