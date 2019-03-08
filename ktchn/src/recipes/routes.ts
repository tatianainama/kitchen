import { Request, Response, Router, NextFunction } from "express";
import Scrape from "./scrape";
import { Recipe } from './model';
import { save, get, getById, getAll, getByIngredients } from './controller';
import MongoClient from 'mongodb';
import { mongoService, IMongoService } from '../mongo';
import piddleware from '../promise-all-middleware';

class RecipeRoutes {
  public router: Router;
  private RecipeDB: IMongoService;

  public constructor(db: MongoClient.Db) {
    this.router = Router();
    this.RecipeDB = mongoService(db)('recipes');
    this.init();
  }

  private init() {
    this.router.get("/all/", piddleware([getAll(this.RecipeDB)]));
    this.router.get("/query/", piddleware([get(this.RecipeDB)]));
    this.router.get("/ingredients/", piddleware([getByIngredients(this.RecipeDB)]));
    this.router.get("/id/:id", piddleware([getById(this.RecipeDB)]));
    
    this.router.post("/", piddleware([save(this.RecipeDB)]));
    this.router.post("/scrape", (req, res, next) => {
       return Scrape(req.body.url).then((x)=>{
         res.json(x)
       }).catch((error: Error) => res.status(400).send(
        {
          name: error.name,
          message: error.message,
        }
      ));
    })
  }

  private logData(req:Request, res:Response, next: NextFunction): void {
    console.log(`data: ${res.locals.savedData}`);
    next();
  }
}

export default RecipeRoutes;
