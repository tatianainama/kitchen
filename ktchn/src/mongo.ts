import { Db, connect, MongoClient, InsertOneWriteOpResult, Collection, ObjectID, FilterQuery } from 'mongodb';

export interface IDBDocument<T extends {}> {
  _id: ObjectID
}

export interface IMongoService {
  insertOne<T>(data: T): Promise<IDBDocument<T>>,
}

export const mongoService = (db: Db) => (col: string) => {
  const collection:Collection = db.collection(col);

  return {
    insertOne: <T>(data: T): Promise<IDBDocument<T>> => collection.insertOne(data).then(insertOneResult => insertOneResult.ops[0]),
    findOne: <T>(query: FilterQuery<T>) => collection.findOne(query),
  }
};

export default mongoService;
