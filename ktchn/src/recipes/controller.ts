import { Request, Response, NextFunction } from 'express'
import { Recipe } from './model';
import { IMongoService } from '../mongo';
import { ObjectId } from 'bson';
import { json } from 'body-parser';
import { FilterQuery } from 'mongodb';

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

const get = (db: IMongoService) => ({ query }: Request, res: Response, next: NextFunction) => {
  return db.findOne<Recipe>(query).then(result => res.json(result));
}

const getById = (db: IMongoService) => ({ params }: Request, res: Response, next: NextFunction) => {
  return db.findOneById<Recipe>(params.id).then(recipe => res.json(recipe));
}

const getAll = (db: IMongoService) => ({ query }: Request, res: Response, next: NextFunction) => {
  return db.find<Recipe>(query).then(recipes => res.json(recipes));
}

const getByIngredients = (db: IMongoService) => ({ query, params }: Request, res: Response, next: NextFunction) => {
  const ingredients: string[] = query.ingredients.split(',');
  const builtQuery = {
    '$or': ingredients.map((ing) => ({
      'ingredients.ingredients.name': {
        '$regex': ing,
        '$options': 'i'        
      }
    }))
  };
  return db.find<Recipe>(builtQuery).then(recipes => res.json(recipes))
}

export {
  save,
  getById,
  get,
  getAll,
  getByIngredients,
}