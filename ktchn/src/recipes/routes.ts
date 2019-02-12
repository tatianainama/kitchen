import { Request, Response, Router } from "express";
import Scrape from "./scrape";
import { saveRecipe } from "./controller";
import nano = require("nano");

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
      return saveRecipe(req.body).then((x)=>{
        res.json(x)
      }).catch((error: any) => { // TODO: Reserch on CouchDB responses types
        res.status(error.headers.statusCode).send(
          {
            name: error.error,
            message: error.message,
          }
        )
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
