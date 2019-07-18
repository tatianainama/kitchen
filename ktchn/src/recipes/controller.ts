import { Request, Response, NextFunction } from 'express'
import { Recipe, IIngredient, IngredientSuggestion } from './model';
import { IMongoService } from '../mongo';
import { FilterQuery } from 'mongodb';
import Scrape from './scrape/index';
import { ScrapedRecipe } from './model';
import Ingredient from '../ingredients/model';

function validRecipe(data: any): Promise<Recipe> {
  return new Promise(function(resolve, reject) {
    return data.name !== undefined ? resolve(data) : reject('Missing data');
  })
}

type Controller = (db: IMongoService) => (req: Request, res: Response, next: NextFunction) => Promise<void|Response>;

type ChainPController<T, U> = (req: Request, res: Response, next: NextFunction) => (result: T) => Promise<U>;

const getSuggestions = (db: IMongoService) => async function(ingredient: IIngredient): Promise<IngredientSuggestion> {
  const suggestions = await db.find<Ingredient>({$text: {$search: ingredient.name}}, { score: { $meta: "textScore" } });
  return {
    ...ingredient,
    suggestions,
  }
}

const scrapeRecipe: (db: IMongoService) => ChainPController<void, ScrapedRecipe> = (db) => (req) => () => {
  return Scrape(req.body.url)
    .then(async scrapedRecipe => {
      const recipeIngredients = await Promise.all(scrapedRecipe.ingredients.map(async subGroup => {
        const subgroupIngredients = await Promise.all(subGroup.ingredients.map(getSuggestions(db)));
        return ({
          name: subGroup.name,
          ingredients: subgroupIngredients
        });
      }));
      return {
        ...scrapedRecipe,
        ingredients: recipeIngredients
      }
    })
}

const save: Controller = (db) => ({ body }, res) => {
  return validRecipe(body).then(
    recipe => db.insertOne(recipe).then(
      dbRecipe => res.json(dbRecipe)
  ));
};

const get: Controller = (db) => ({ query }, res) => {
  return db.findOne<Recipe>(query).then(result => res.json(result));
}

const getById: Controller = (db) => ({ params }, res) => {
  return db.findOneById<Recipe>(params.id).then(recipe => res.json(recipe));
}

const getAll: Controller = (db) => ({ query }, res) => {
  return db.find<Recipe>(query).then(recipes => res.json(recipes));
}

async function buildQuery(tryQuery:()=>FilterQuery<any>): Promise<FilterQuery<any>> {
  try {
    return Promise.resolve(tryQuery());
  } catch(error) {
    return Promise.reject(error);
  }
} 
const getByIngredients: Controller = (db) => ({ query }, res) => {
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

const update: Controller = (db) => ({params, body}, res) => {
  return db.update<Recipe>(params.id, body).then(result => res.json(result))
}

export {
  save,
  scrapeRecipe,
  getById,
  get,
  getAll,
  getByIngredients,
  update,
}