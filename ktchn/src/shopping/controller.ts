import { ChainPController } from './../promise-all-middleware';
import { IMongoService, IDBDocument } from './../mongo';
import { ShoppingItem, ShoppingList } from './model';

type Controller<U, T> = (db: IMongoService) => ChainPController<U, T>;

const getShoppingList: Controller<void, IDBDocument<ShoppingList>|null> = db => req => (x) => {
  return db.findOne({});
}

const validShoppingList = (mbShoppingList: any): mbShoppingList is IDBDocument<ShoppingList> => {
  return mbShoppingList._id && mbShoppingList.items;
}

const validateShoppingList: Controller<void, IDBDocument<ShoppingList>> = () => req => () => {
  const mbShoppingList = validShoppingList(req.body);
  return mbShoppingList ? Promise.resolve(req.body) : Promise.reject('Invalid Shopping List'); 
}

const saveShoppingList: Controller<IDBDocument<ShoppingList>, IDBDocument<ShoppingList>> = db => () => async shoppingList => {
  const delResult = await db.deleteMany({});
  return await db.insertOne(shoppingList);
}

const deleteShoppingList: Controller<void, any> = db => req => () => db.deleteMany({}).then(
  result => db.insertOne({
    date: new Date(),
    items: []
  })
);

export {
  getShoppingList,
  validateShoppingList,
  saveShoppingList,
  deleteShoppingList
}