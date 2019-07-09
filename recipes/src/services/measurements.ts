import convert from 'convert-units';

type Measure = 'mass'|'volume'|'temperature';

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


export {
  MeasuresTypes,
};