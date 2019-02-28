import { Request, Response, NextFunction } from 'express'
import { Recipe } from './model';

function isValidRecipe(data: any): data is Recipe {
  return data.name !== undefined;
}

function validateRecipe({ body }:Request, res:Response, next:NextFunction) {
  if (isValidRecipe(body)) {
    res.locals = {
      data: body as Recipe
    };
    next();
  } else {
    next(new Error('Missing recipe information: name'));
  }
}

export {
  validateRecipe,
}