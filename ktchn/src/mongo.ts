import { Db, connect, MongoClient, InsertOneWriteOpResult, Collection, ObjectID } from 'mongodb';

export interface IDBObject<T extends {}> {
  _id: ObjectID
}

export interface IMongoService {
  insertOne<T>(data: T): Promise<IDBObject<T>>,
}

export const mongoService = (db: Db) => (col: string) => {
  const collection:Collection = db.collection(col);

  return {
    insertOne: <T>(data: T): Promise<IDBObject<T>> => collection.insertOne(data).then(insertOneResult => insertOneResult.ops[0])
  }
};

export default mongoService;
