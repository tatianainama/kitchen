import  { ObjectID } from 'mongodb';

type Equivalences = {
  cup?: number,
  tbsp?: number,
  tsp?: number,
  stick?: number,
  gr?: number,
  ml?: number,
  oz?: number,
  lb?: number,
};

export interface Ingredient {
  _id?: ObjectID,
  name: string,
  variants?: string[],
  equivalences: Equivalences,
  prefferedUnit: keyof Equivalences,
  referenceUnit: keyof Equivalences,
  translation?: {
    english?: string,
    dutch?: string,
    spanish?: string
  }
}

export interface IngredientDB extends Ingredient {
  _id: ObjectID,
}

export default Ingredient;