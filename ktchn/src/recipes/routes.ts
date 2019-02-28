import { Request, Response, Router, NextFunction } from "express";
import Scrape from "./scrape";
import { Recipe } from './model';
import { validateRecipe } from './controller';
import { storeRecipe } from './data';
import MongoClient from 'mongodb';

class RecipeRoutes {
  public router: Router;

  public constructor(db: MongoClient.Db) {
    this.router = Router();
    this.init(db);
  }

  private init(db: MongoClient.Db) {
    this.router.get("/", (req, res, next) => {
      res.json({
        message: 'hey recipes bb'
      });
    })
    this.router.post("/", validateRecipe, storeRecipe(db), this.logData)
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
