import { Request, Response, NextFunction } from 'express'
import { Recipe, IIngredient, IngredientSuggestion, RecipeDB } from './model';
import { IMongoService } from '../mongo';
import { FilterQuery, ObjectID } from 'mongodb';
import Scrape from './scrape/index';
import { ScrapedRecipe } from './model';
import Ingredient from '../ingredients/model';
import { dissoc } from 'ramda';
import fs from 'fs';

function validRecipe(data: any): Promise<Recipe> {
  return new Promise(function(resolve, reject) {
    return data.name !== undefined ? resolve(data) : reject('Missing data');
  })
}

type Controller = (db: IMongoService) => (req: Request, res: Response, next: NextFunction) => Promise<void|Response>;

type ChainPController<T, U> = (req: Request, res: Response, next: NextFunction) => (result: T) => Promise<U>;

const getSuggestions = (db: IMongoService) => async function(ingredient: IIngredient): Promise<IngredientSuggestion> {
  // @ts-ignore: yes
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

const saveImage = async (recipe: Recipe, _id: ObjectID) => {
  if (recipe.image) {
    try {
      const [ prefix, base64Img ] = recipe.image.split(',');
      const filename = `${_id}.${prefix.replace('data:image/', '').split(';', 1)}`;
      fs.writeFileSync(`${__dirname}/../public/${filename}`, base64Img, { encoding: 'base64'});
      return {
        ...recipe,
        image: filename
      }
    } catch (e) {
      throw Error(e);
    }
  } else {
    return recipe;
  }
}

const save: Controller = (db) => ({ body }, res) => {
  const _id = new ObjectID();
  return validRecipe(body)
    .then(recipe => saveImage(recipe, _id))
    .then(recipe => db.insertOne({ ...recipe, _id }))
    .then(dbrecipe => res.json(dbrecipe));
};

const get: Controller = (db) => ({ query }, res) => {
  return db.findOne<Recipe>(query).then(result => res.json(result));
}

const getById: Controller = (db) => ({ params }, res) => {
  return db.findOneById<Recipe>(params.id).then(recipe => res.json(recipe));
}

const getAll: Controller = (db) => ({ query }, res) => {
  const _query = Object.keys(query).reduce((q, field) => {
    return {
      ...q,
      ...buildSearchQuery(field, query[field])
    }
  }, {});
  return db.find<Recipe>(_query).then(recipes => res.json(recipes));
}

type RegexQuery = {
  '$regex': string,
  '$options': 'i'
};

const buildSearchQuery = (fieldName: string, value: string): { [field: string] : RegexQuery} => ({
  [fieldName]: {
    '$regex': value,
    '$options': 'i'
  }
});

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
        '$or': ingredients.map((ing) => buildSearchQuery('ingredients.ingredients.name', ing))
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

const updateOriginal = (ingredient: IIngredient): string => (`
  ${ingredient.quantity} ${ingredient.unit||''} ${ingredient.unit && 'of'} ${ingredient.name}
`);

const update: Controller = (db) => ({params, body}, res) => {
  let newRecipe = dissoc('_id', body) as Recipe;
  newRecipe.ingredients = newRecipe.ingredients.map(subRecipe => ({
    ...subRecipe,
    ingredients: subRecipe.ingredients.map(ingredient => ({
      ...ingredient,
      _original: updateOriginal(ingredient)
    }))
  }));
  return saveImage(newRecipe, new ObjectID(params.id)).then(
    recipe => db.update<Recipe>(params.id, recipe).then(
      result => res.json(result))
  )
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