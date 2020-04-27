export type Measure = 'mass'|'volume';
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
    cup: 236.58,
    tbsp: 14.78,
    tsp: 4.92,
    gal: 3785.41,
    pnt: 473.176,
  }
}

const conversionTableDic: { [measure: string]: string[] } = {
  mass: ['mg', 'g', 'kg', 'lb', 'oz'],
  volume: ['ml', 'l', 'cup', 'tbsp', 'tsp', 'gal', 'pnt']
};

const Convert = (qty: number, from: string, to: string, measure: Measure) => {
  const toAnchor = (unit: string, amount: number) => conversionTable[measure][unit] * amount;
  return parseFloat((toAnchor(from, qty) / toAnchor(to, 1)).toFixed(2));
}

const GetMeasure = (unit: string): { name: string, values: string[]} => {
  return ['mass', 'volume'].reduce((result, measure) => {
    return conversionTableDic[measure].includes(unit) ? {
      name: measure,
      values: conversionTableDic[measure]
    } : result
  }, {name: '', values: ['']});
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

const GetMeasuresTypes = (measure?: Measure) => {
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

const FormatFloat = (n: number) => {
  const _n = n.toFixed(2);
  const [ integer, decimal ] = _n.split('.');
  return decimal === '00' ? parseFloat(integer) : parseFloat(_n);
}

const MeasuresTypes = GetMeasuresTypes();

export {
  GetMeasuresTypes,
  MeasuresTypes,
  Convert,
  ParseUnit,
  GetMeasure,
  FormatFloat
};