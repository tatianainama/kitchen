import { Db, Cursor, MongoClient, InsertOneWriteOpResult, Collection, ObjectID, FilterQuery, ObjectId } from 'mongodb';

export interface IDBDocument<T extends {}> {
  _id: ObjectID
}

export interface IMongoService {
  insertOne<T>(data: T): Promise<IDBDocument<T>>,
  insertMany<T>(data: T[]): Promise<IDBDocument<T>[]|any[]>,
  findOne<T>(query: FilterQuery<T>): Promise<IDBDocument<T>>,
  findOneById<T>(idParam: string): Promise<IDBDocument<T>>,
  find<T>(query: FilterQuery<T>): Promise<IDBDocument<T>[]>,
}

export const mongoService = (db: Db) => (col: string) => {
  const collection:Collection = db.collection(col);

  return {
    insertOne: <T>(data: T): Promise<IDBDocument<T>> => collection.insertOne(data).then(insertOneResult => insertOneResult.ops[0]),
    insertMany: <T>(data: T[]): Promise<any[]|IDBDocument<T>[]> => collection.insertMany(data).then(insertManyResult => insertManyResult.ops),
    findOne: <T>(query: FilterQuery<T>) => collection.findOne(query),
    findOneById: (idParam: string) => collection.findOne({ _id: new ObjectId(idParam) }),
    find: <T>(query: FilterQuery<T>): Promise<IDBDocument<T>[]> => collection.find(query).toArray(),
  }
};

export default mongoService;
