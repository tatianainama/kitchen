import { Recipe } from '@/types/recipes';

type Api = <T>(url: string) => Promise<T>;

const api: Api = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const mockAPI = <T> (data: T): Promise<T> => new Promise((resolve) => {
  resolve(data);

});

export const getAllRecipes = (): Promise<Recipe[]> => api<Recipe[]>(`${process.env.API_RECIPES}/all/`);

export const getRecipeById = (id: string | string[]): Promise<Recipe> => api<Recipe>(`${process.env.API_RECIPES}/id/${id}`);

type Tag = {
  name: string,
};

export const getAllTags = (): Promise<Tag[]> => mockAPI<Tag[]>([
  { name: 'Dinner' },
  { name: 'Snack' },
  { name: 'Dessert' },
  { name: 'Lunch' }
]);

export default {
  getAllRecipes,
  getAllTags,
  getRecipeById
};
