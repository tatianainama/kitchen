import convert from 'convert-units';

type Measure = 'mass'|'volume';
type UnitDic = {
  [unitName: string]: number
}

const conversionTable: {
  [measure: string]: UnitDic
  mass: UnitDic,
  volume: UnitDic,
} = {
  mass: {
    mg: 1/1000,
    g: 1,
    kg: 1000,
    lb: 453.59,
    oz: 28.35
  },
  volume: {
    ml: 1,
    l: 1000,
    cup: 240,
    tbsp: 14.78,
    tsp: 4.92,
    gal: 3785.41,
    pt: 473.176,
  }
}

const Convert = (qty: number, from: string, to: string, measure: Measure) => {
  const toAnchor = (unit: string, amount: number) => conversionTable[measure][unit] * amount;
  return (qty * toAnchor(from, qty)) / toAnchor(to, 1);
}

const measurements = [
  {
    name: 'mass',
    values: ['g', 'kg', 'oz', 'lb'],
  }, {
    name: 'volume',
    values: ['ml', 'tsp', 'tbsp', 'cup', 'pnt', 'gal', 'oz', 'l']
  }
];

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

const ParseUnit = (unit: string): Measure => {
  measurements.forEach(measure => {
    if (measure.values.includes(unit)) {
      return measure.name;
    }
  })
  return 'mass';
}

export {
  MeasuresTypes,
  Convert,
  ParseUnit,
};