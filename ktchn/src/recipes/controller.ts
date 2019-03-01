import { Request, Response, NextFunction } from 'express'
import { Recipe } from './model';
import { IMongoService } from '../mongo';

function isValidRecipe(data: any): data is Recipe {
  return data.name !== undefined;
}

const saveRecipe = (db: IMongoService) => ({ body }: Request, res: Response, next: NextFunction): void => {
  if (isValidRecipe(body)) {
    db.insertOne(body).then(DBRecipe => {
      res.json(DBRecipe);
      next();
    })
  } else {
    next(new Error('Missing recipe information'));
  }
}

export {
  saveRecipe,
}