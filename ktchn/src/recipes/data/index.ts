import CouchDb from "../../couchdb";
import { Recipe } from "../model";
import { MaybeIdentifiedDocument, ViewDocument, MaybeDocument, DocumentInsertResponse } from "nano";

const Recipes = CouchDb.use('recipes');

type CouchDBTypes = 'recipe';

function identifyDocument<T>(document: T, type: CouchDBTypes):MaybeDocument {
  return {
    ...document,
    couchdb_type: type,
  } as MaybeDocument;
}

export const create = (recipe: Recipe): Promise<DocumentInsertResponse> => Recipes.insert(identifyDocument(recipe, 'recipe'));