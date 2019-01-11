import { Request, Response, Router } from "express";
import Scrape from "./scrape";

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
    this.router.post("/scrape", (req, res, next) => {
       return Scrape(req.body.url).then((x)=>{
         res.json(x)
       });
    })
  }
}

const recipeRoutes = new RecipeRoutes();
export default recipeRoutes.router;
