import { Db, connect, MongoClient, InsertOneWriteOpResult, Collection } from 'mongodb';
import { Request, Response, NextFunction } from 'express';

export default (db: Db) => (col: string) => {
  const collection:Collection = db.collection(col);

  return {
    insertOne: (data: any):Promise<InsertOneWriteOpResult> => {
      return collection.insertOne(data);
    }
  }
};

