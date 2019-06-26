import axios, { AxiosPromise } from 'axios';
import Recipe from 'types/recipes';

//@ts-ignore
const API: string = process.env.REACT_APP_API_RECIPES;

export const getRecipes = (query: any): Promise<Recipe[]> => 
  axios.get(`${API}/all`)
  .then(response => response.data);

export const scrapeRecipe = (url: string): Promise<Recipe> => 
  axios.post(
    `${API}/scrape`,
    { url }
  ).then(response => response.data);

export default {
  getRecipes,
  scrapeRecipe,
}