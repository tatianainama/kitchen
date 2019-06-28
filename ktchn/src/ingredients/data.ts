import Ingredient from "./model";

const data: Ingredient[] = [{
  name: 'all purpose flour',
  variants: ['plain flour', 'all purpose flour', 'regular flour'],
  equivalence: 125,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  translation: {
    dutch: 'patentbloem'
  },
  measure: 0
}, {
  name: 'bread flour',
  variants: ['bread flour'],
  equivalence: 127,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  translation: {
    dutch: 'tarwebloem'
  },
  measure: 0
}, {
  name: 'pastry flour',
  variants: ['pastry flour'],
  equivalence: 114,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  translation: {
    dutch: 'zeeuwsebloem'
  },
  measure: 0
}, {
  name: 'almond flour',
  equivalence: 96,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'cornflour',
  equivalence: 150,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'self raising flour',
  equivalence: 125,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'honey',
  equivalence: 340,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'semolina',
  equivalence: 167,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'long rice',
  equivalence: 185,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'short rice',
  variants: ['sushi rice'],
  equivalence: 200,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'basmati rice',
  equivalence: 195,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'granulated sugar',
  variants: ['sugar', 'plain sugar'],
  equivalence: 200,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'icing sugar',
  variants: ['confectioner sugar', 'powdered sugar'],
  equivalence: 125,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'caster sugar',
  variants: ['fine sugar'],
  equivalence: 225,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'brown sugar',
  equivalence: 200,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'yeast',
  equivalence: 2.83,
  referenceUnit: 'tsp',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'yogurt',
  variants: ['plain yogurt'],
  equivalence: 245,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 2
},  {
  name: 'cocoa powder',
  variants: ['cocoa'],
  equivalence: 118,
  referenceUnit: 'cup',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'chicken breast',
  variants: ['chicken', 'skinless chicken'],
  referenceUnit: 'lb',
  prefferedUnit: 'gr',
  measure: 0
}, {
  name: 'olive oil',
  variants: [],
  referenceUnit: 'tbsp',
  prefferedUnit: 'tbsp',
  measure: 1
}];

export default data;