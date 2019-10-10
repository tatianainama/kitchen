import { Router } from 'express';
import mongoService, { IMongoService } from '../mongo';
import MongoClient from 'mongodb';
import { chainP as chain } from '../promise-all-middleware';
import { getShoppingList, validateShoppingList, saveShoppingList, deleteShoppingList } from './controller';

class ShoppingRoutes {
  public router: Router;
  private shoppingDB: IMongoService;

  public constructor(db: MongoClient.Db) {
    this.router = Router();
    this.shoppingDB = mongoService(db)('shopping');
    this.init();
  }

  private init() {
    this.router.get('/', chain([getShoppingList(this.shoppingDB)]));
    this.router.post('/', chain([validateShoppingList(this.shoppingDB), saveShoppingList(this.shoppingDB)]));
    this.router.delete('/', chain([deleteShoppingList(this.shoppingDB)]));
  }
}

export default ShoppingRoutes;