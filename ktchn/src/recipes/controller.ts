import { Request, Response, NextFunction } from 'express'
import { Recipe, IIngredient, IIngredientHelper } from './model';
import { IMongoService } from '../mongo';
import { FilterQuery } from 'mongodb';
import Scrape from './scrape/index';
import { ISubRecipe, ScrapedRecipe } from './model';
import Ingredient from '../ingredients/model';

function validRecipe(data: any): Promise<Recipe> {
  return new Promise(function(resolve, reject) {
    return data.name !== undefined ? resolve(data) : reject('Missing data');
  })
}

type Controller<T> = (db: IMongoService) => (req: Request, res: Response, next: NextFunction) => Promise<T>;

const getPossibleValues = (db: IMongoService) => async function(ingredient: IIngredient): Promise<IIngredientHelper> {
  const possibleValues = await db.find<Ingredient>({$text: {$search: ingredient.name}}, { score: { $meta: "textScore" } });
  return {
    ...ingredient,
    possibleValues: possibleValues,
  }
}

const scrape: Controller<void|ScrapedRecipe> = (db) => (req: any, res, next) => {
  return Scrape(req.body.url)
    .then(async scrapedRecipe => {
      const recipeIngredients = await Promise.all(scrapedRecipe.ingredients.map(async subGroup => {
        const subgroupIngredients = await Promise.all(subGroup.ingredients.map(getPossibleValues(db)));
        return ({
          name: subGroup.name,
          ingredients: subgroupIngredients
        });
      }));
      res.json({
        ...scrapedRecipe,
        ingredients: recipeIngredients
      })
    })
    .catch(error => console.log(error));
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

async function buildQuery(tryQuery:()=>FilterQuery<any>): Promise<FilterQuery<any>> {
  try {
    return Promise.resolve(tryQuery());
  } catch(error) {
    return Promise.reject(error);
  }
} 
const getByIngredients = (db: IMongoService) => ({ query, params }: Request, res: Response, next: NextFunction) => {
  const ingredientsQuery = (query: FilterQuery<any>) => () => {
    if(query.ingredients) {
      const ingredients: string[] = query.ingredients.split(',');
      return {
        '$or': ingredients.map((ing) => ({
          'ingredients.ingredients.name': {
            '$regex': ing,
            '$options': 'i'        
          }
        }))
      };  
    } else {
      throw new Error('Invalid query key');
    }
  }
  return buildQuery(ingredientsQuery(query)).then(
    builtQuery => db.find<Recipe>(builtQuery).then(
      recipes => res.json(recipes)
    )
  )
}

export {
  save,
  scrape,
  getById,
  get,
  getAll,
  getByIngredients,
}