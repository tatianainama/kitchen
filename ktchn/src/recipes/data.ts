import { Recipe, RecipeDB } from './model';
import { Request, Response, NextFunction } from 'express'
import MongoClient from 'mongodb';
import mongo from './../mongo';

function storeRecipe(db: MongoClient.Db) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const data = await db.collection('recipes').insertOne(res.locals.data);
      res.locals.savedData = data.ops[0] as RecipeDB;
      res.json(data.ops[0]);
      next();
    }
    catch (error) {
      return next(error);
    }
  } 
}

export {
  storeRecipe,
}