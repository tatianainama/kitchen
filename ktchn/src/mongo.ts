import { Db, Collection, ObjectID, FilterQuery, ObjectId, WriteOpResult, FindOneOptions, UpdateWriteOpResult } from 'mongodb';

export interface IDDocument {
  _id: ObjectID
}

export type IDBDocument<T> = IDDocument & T;

export interface IMongoService {
  insertOne<T>(data: T): Promise<IDBDocument<T>>,
  insertMany<T>(data: T[]): Promise<IDBDocument<T>[]|any[]>,
  findOne<T>(query: FilterQuery<T>): Promise<IDBDocument<T>|null>,
  findOneById<T>(idParam: string): Promise<IDBDocument<T>|null>,
  find<T>(query: FilterQuery<T>, optionalQuery?: FindOneOptions): Promise<IDBDocument<T>[]>,
  update<T>(id: string, data: T): Promise<WriteOpResult>,
  updateOne<T>(filter: FilterQuery<T>, data: T, options?: {upsert?: boolean}): Promise<UpdateWriteOpResult>,
  aggregate<T>(pipeline: Object[]): Promise<T[]>
}

export const mongoService = (db: Db) => (col: string): IMongoService => {
  const collection: Collection = db.collection(col);

  return {
    insertOne: data => collection.insertOne(data).then(insertOneResult => insertOneResult.ops[0]),
    insertMany: data => collection.insertMany(data).then(insertManyResult => insertManyResult.ops),
    findOne: query => collection.findOne(query),
    findOneById: (idParam: string) => collection.findOne({ _id: new ObjectId(idParam) }),
    find: (query, optionalQuery) => collection.find(query, optionalQuery).toArray(),
    update: (id, data) => collection.update({_id: new ObjectId(id)}, data),
    updateOne: (filter, data, options) => collection.updateOne(filter, data, options), 
    aggregate: pipeline => collection.aggregate(pipeline).toArray()
  }
};

export default mongoService;
