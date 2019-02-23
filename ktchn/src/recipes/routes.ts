import { Request, Response, Router } from "express";
import Scrape from "./scrape";
import { Recipe } from './model';

class RecipeRoutes {
  public router: Router;
  public constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get("/", (req, res, next) => {
      res.json({
        message: 'hey recipes bb'
      });
    })
    this.router.post("/", (req, res, next) => {
      const recipe = req.body as Recipe;
      console.log(req.app.locals.db);
      res.json({
        message: 'k'
      });
    })
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
}

const recipeRoutes = new RecipeRoutes();
export default recipeRoutes.router;
