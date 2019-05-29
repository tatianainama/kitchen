import { Request, Response, Router, NextFunction } from 'express';
import { Db } from 'mongodb';
import { mongoService, IMongoService } from '../mongo';
import piddleware from '../promise-all-middleware';
import { create } from './controller'

class IngredientRoutes {
  public router: Router;
  private IngredientDB: IMongoService;

  public constructor(db: Db) {
    this.router = Router();
    this.IngredientDB = mongoService(db)('ingredients');
    this.init();
  }

  private init() {
    this.router.get('/all/');
    this.router.get('/create', piddleware([create(this.IngredientDB)]))
  }
}

export default IngredientRoutes;