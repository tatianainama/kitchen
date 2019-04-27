import axios, { AxiosPromise } from 'axios';
import IRecipe from 'types/recipes';

//@ts-ignore
const API: string = process.env.REACT_APP_API_RECIPES;

export const getRecipes = (query: any): Promise<IRecipe[]> => 
  axios.get(`${API}/all`)
  .then(response => response.data);

export default {
  getRecipes,
}