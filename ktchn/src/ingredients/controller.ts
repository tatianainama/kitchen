import { Ingredient } from './model';
import { IMongoService } from '../mongo';
import { Request, Response, NextFunction } from 'express';
import data from './data';

const create = (db: IMongoService) => (req: Request, res: Response, next: NextFunction) => {
  const ingredients = data;

  return db.insertMany(ingredients)
    .then(dbIngredient => res.json(dbIngredient))
}

export {
  create,
}