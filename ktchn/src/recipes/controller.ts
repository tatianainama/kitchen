import { Request, Response, NextFunction } from 'express'
import { Recipe } from './model';
import { IMongoService } from '../mongo';

function isValidRecipe(data: any): data is Recipe {
  return data.name !== undefined;
}

function validRecipe(data: any): Promise<Recipe> {
  return new Promise(function(resolve, reject) {
    return data.name !== undefined ? resolve(data) : reject('Missing data');
  })
}

const save = (db: IMongoService) => ({ body }: Request, res: Response, next: NextFunction): Promise<any> => {
  return validRecipe(body).then(
    recipe => db.insertOne(recipe).then(
      dbRecipe => res.json(dbRecipe)
  ));
};

export {
  save,
}