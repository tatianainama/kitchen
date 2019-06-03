import { Ingredient } from './model';
import { IMongoService } from '../mongo';
import { Request, Response, NextFunction } from 'express';

const create = (db: IMongoService) => (req: Request, res: Response, next: NextFunction) => {
  const ingredients: Ingredient[] = [{
    name: 'all purpose flour',
    variants: ['plain flour', 'all purpose flour', 'regular flour'],
    equivalences: {
      cup: 1,
      gr: 125,
      tbsp: 15.5,
      tsp: 47,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
    translation: {
      dutch: 'patentbloem'
    }
  }, {
    name: 'bread flour',
    variants: ['bread flour'],
    equivalences: {
      cup: 1,
      gr: 127,
      tbsp: 12.7,
      tsp: 38.1,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
    translation: {
      dutch: 'tarwebloem'
    }
  }, {
    name: 'pastry flour',
    variants: ['pastry flour'],
    equivalences: {
      cup: 1,
      gr: 114,
      tbsp: 16.8,
      tsp: 50.6,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
    translation: {
      dutch: 'zeeuwsebloem'
    }
  }, {
    name: 'almond flour',
    equivalences: {
      cup: 1,
      gr: 96,
      tbsp: 16,
      tsp: 48,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'cornflour',
    equivalences: {
      cup: 1,
      gr: 150,
      tbsp: 16,
      tsp: 48,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'self raising flour',
    equivalences: {
      cup: 1,
      gr: 125,
      tbsp: 15.6,
      tsp: 47,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'honey',
    equivalences: {
      cup: 1,
      gr: 340,
      oz: 12,
      tbsp: 16,
      tsp: 48,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'semolina',
    equivalences: {
      cup: 1,
      gr: 167,
      oz: 5.9,
      lb: 0.37,
      tbsp: 16,
      tsp: 50,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'long rice',
    equivalences: {
      cup: 1,
      gr: 185,
      oz: 6.5,
      lb: 0.44
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'short rice',
    variants: ['sushi rice'],
    equivalences: {
      cup: 1,
      gr: 200,
      oz: 7.05,
      lb: 0.44,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'basmati rice',
    equivalences: {
      cup: 1,
      gr: 195,
      oz: 6.88,
      lb: 0.43,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'granulated sugar',
    variants: ['sugar', 'plain sugar'],
    equivalences: {
      cup: 1,
      gr: 200,
      oz: 7.1,
      tbsp: 14,
      tsp: 42,
      lb: 0.4
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'icing sugar',
    variants: ['confectioner sugar', 'powdered sugar'],
    equivalences: {
      cup: 1,
      gr: 125,
      oz: 0.27,
      tbsp: 15,
      tsp: 45,
      lb: 0.27
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'caster sugar',
    variants: ['fine sugar'],
    equivalences: {
      cup: 1,
      gr: 225,
      oz: 7.9,
      tbsp: 15,
      tsp: 5,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'brown sugar',
    equivalences: {
      cup: 1,
      gr: 200,
      oz: 7.05,
      lb: 0.44,
      tbsp: 14,
      tsp: 42,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }, {
    name: 'yeast',
    equivalences: {
      gr: 2.83,
      tsp: 1,
    },
    referenceUnit: 'tsp',
    prefferedUnit: 'gr',
  }, {
    name: 'yogurt',
    variants: ['plain yogurt'],
    equivalences: {
      cup: 1,
      gr: 245,
      oz: 8.64,
      tbsp: 16,
      tsp: 48,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  },  {
    name: 'cocoa powder',
    variants: ['cocoa'],
    equivalences: {
      cup: 1,
      gr: 118,
      tbsp: 16,
      tsp: 48,
    },
    referenceUnit: 'cup',
    prefferedUnit: 'gr',
  }];

  return db.insertMany(ingredients)
    .then(dbIngredient => res.json(dbIngredient))
}

export {
  create,
}