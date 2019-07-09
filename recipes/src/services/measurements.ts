import convert from 'convert-units';

type Measure = 'mass'|'volume'|'temperature';

const units = {
  cup: 'cup',
  gallon: 'gal',
  ounce: 'oz',
  pint: 'pt',
  pound: 'lb',
  quart: 'qt',
  tablespoon: 'tbsp',
  teaspoon: 'tsp',
  gram: 'g',
  kilogram: 'kg',
  liter: 'l',
  milligram: 'mg',
  milliliter: 'ml',
  package: 'pkg',
  stick: 'sticks',
}

const measureValues: { [key:string]: string[] } = {
  mass: ['g', 'kg', 'oz', 'lb'],
  volume: [ 'ml', 'tsp', 'tbsp', 'cup', 'pnt', 'gal', 'oz', 'l'],
  misc: ['unit', 'pinch', 'to taste'],
  temperature: ['C', 'F'],
} 
const MeasuresTypes = (measure?: Measure) => {
  return measure ?
  measureValues[measure] :
  [ ...measureValues.mass, ...measureValues.volume, ...measureValues.misc ]
};

const GetMeasure: (unit:string) => Measure | undefined = unit => {
  try {
    // @ts-ignore
    const data = convert().describe(units[unit]);
    console.log("unit", unit, data)
    return data.measure;
  } catch {
    return undefined;
  }
}

export {
  MeasuresTypes,
  GetMeasure,
};