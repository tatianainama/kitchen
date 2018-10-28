import { Request, Response, Router } from "express";

class Root {
  public router: Router;
  public constructor() {
    this.router = Router();
    this.init();
  }
  private init() {
    this.router.get("/", (req, res, next) => {
      res.json({
        message: 'hello world'
      });
    })
  }
}

const rootRoutes = new Root();
export default rootRoutes.router;