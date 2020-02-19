import axios, { AxiosPromise } from 'axios';
import Recipe, { DBRecipe } from 'types/recipes';

//@ts-ignore
const API: string = process.env.REACT_APP_API_RECIPES;

export const getRecipes = (query: string): Promise<DBRecipe[]> => 
  axios.get(`${API}/all/?name=${query}`)
  .then(response => response.data);

export const saveRecipe = (recipe: Recipe): Promise<any> => 
  axios.post(`${API}`, recipe)

export const getRecipeById = (id: string): Promise<DBRecipe> =>
  axios.get(`${API}/id/${id}`)
  .then(response => response.data)

export const scrapeRecipe = (url: string): Promise<Recipe> => 
  axios.post(
    `${API}/scrape`,
    { url }
  ).then(response => response.data);

export const updateRecipe = (recipe: DBRecipe): Promise<any> => 
    axios.put(
      `${API}/edit/${recipe._id}`,
      recipe
    ).then(response => response);

export const deleteRecipe = (id: string): Promise<any> =>
  axios.delete(`${API}/${id}`)
      .then(response => ({
        data: response.data,
        statusText: response.statusText
      }))

export default {
  getRecipes,
  getRecipeById,
  scrapeRecipe,
  saveRecipe,
  updateRecipe,
  deleteRecipe
}