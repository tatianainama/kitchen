import { Request, Response, Router, NextFunction } from "express";
import { save, get, getById, getAll, getByIngredients, scrapeRecipe } from './controller';
import MongoClient from 'mongodb';
import { mongoService, IMongoService } from '../mongo';
import piddleware, { chainP } from '../promise-all-middleware';

class RecipeRoutes {
  public router: Router;
  private RecipeDB: IMongoService;
  private IngredientDB: IMongoService;

  public constructor(db: MongoClient.Db) {
    this.router = Router();
    this.RecipeDB = mongoService(db)('recipes');
    this.IngredientDB = mongoService(db)('ingredients');
    this.init();
  }

  private init() {
    this.router.get("/all/", piddleware([getAll(this.RecipeDB)]));
    this.router.get("/query/", piddleware([get(this.RecipeDB)]));
    this.router.get("/ingredients/", piddleware([getByIngredients(this.RecipeDB)]));
    this.router.get("/id/:id", piddleware([getById(this.RecipeDB)]));
    this.router.post("/", piddleware([save(this.RecipeDB)]));
    this.router.post("/scrape", chainP([scrapeRecipe(this.IngredientDB)]));
  }

  private logData(req:Request, res:Response, next: NextFunction): void {
    console.log(`data: ${res.locals.savedData}`);
    next();
  }
}

export default RecipeRoutes;
