import  { ObjectID } from 'mongodb';

enum Measures {
  mass,
  volume,
  hybrid,
};

type Units = 
  "cup" |
  "tbsp" |
  "tsp" |
  "stick" |
  "g" |
  "ml" |
  "oz" |
  "lb" |
  "pint" |
  "gal" |
  "unit" |
  "pinch" |
  "to taste"
;


interface Pure {
  measure: Measures.mass | Measures.volume,
}

interface Mixed {
  measure: Measures.hybrid,
  refenceUnit: Units,
  equivalence: number,
}

export interface Ingredient {
  _id?: ObjectID,
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

export interface IngredientDB extends Ingredient {
  _id: ObjectID,
}

export default Ingredient;