import { Recipe } from './model';
import { create } from './data';
import { DocumentInsertResponse } from 'nano';

export const saveRecipe = (data: Recipe): Promise<DocumentInsertResponse> => create(data);
