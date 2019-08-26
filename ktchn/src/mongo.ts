import { Db, Cursor, MongoClient, InsertOneWriteOpResult, Collection, ObjectID, FilterQuery, ObjectId, UpdateWriteOpResult, WriteOpResult, CollectionAggregationOptions, AggregationCursorResult } from 'mongodb';

export interface IDDocument {
  _id: ObjectID
}

export type IDBDocument<T> = IDDocument & T;

export interface IMongoService {
  insertOne<T>(data: T): Promise<IDBDocument<T>>,
  insertMany<T>(data: T[]): Promise<IDBDocument<T>[]|any[]>,
  findOne<T>(query: FilterQuery<T>): Promise<IDBDocument<T>|null>,
  findOneById<T>(idParam: string): Promise<IDBDocument<T>|null>,
  find<T>(query: FilterQuery<T>, optionalQuery?: FilterQuery<T>): Promise<IDBDocument<T>[]>,
  update<T>(id: string, data: T): Promise<WriteOpResult>,
  aggregate<T>(pipeline: Object[]): Promise<T[]>
}

export const mongoService = (db: Db) => (col: string): IMongoService => {
  const collection: Collection = db.collection(col);

  return {
    insertOne: <T>(data: T): Promise<IDBDocument<T>> => collection.insertOne(data).then(insertOneResult => insertOneResult.ops[0]),
    insertMany: <T>(data: T[]): Promise<any[]|IDBDocument<T>[]> => collection.insertMany(data).then(insertManyResult => insertManyResult.ops),
    findOne: <T>(query: FilterQuery<T>) => collection.findOne(query),
    findOneById: (idParam: string) => collection.findOne({ _id: new ObjectId(idParam) }),
    find: <T>(query: FilterQuery<T>, optionalQuery: FilterQuery<T> = {} ): Promise<IDBDocument<T>[]> => collection.find(query, optionalQuery).toArray(),
    update: <T>(id: string, data: T) => collection.update({_id: new ObjectId(id)}, data),
    aggregate: <T>(pipeline: Object[]) => collection.aggregate<T>(pipeline).toArray()
  }
};

export default mongoService;
