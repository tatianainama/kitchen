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

//{ $or: [{"ingredients.ingredients.name": { "$regex": "beef", "$options": "i"}}, {"ingredients.ingredients.name": { "$regex": "cheese", "$options": "i"}}, {"ingredients.ingredients.name": { "$regex": "mix", "$options": "i"}}]}


const queryKeys: {[s: string]: (q: string) => {}} = {
  'ing': (query: string) => {
    return {
      '$or': query.split(',').map(x => {
        return {
          'ingredients.ingredients.name': {
            '$regex': x,
            '$options': 'i'
          }
        };
      })
    }    
  }
}

function queryParser(query: any): FilterQuery<any> {
  let q = {};
  for (const key of Object.keys(query)) {
    q = {
      ...q,
      ...queryKeys[key](query[key]),
    }
  }
  return q;
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
  return db.find<Recipe>(queryParser(query)).then(recipes => res.json(recipes))
}

export {
  save,
  getById,
  get,
  getAll,
  getByIngredients,
}