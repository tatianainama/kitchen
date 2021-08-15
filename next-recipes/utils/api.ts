import { Recipe } from "@/types/recipes";

async function api<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

async function mockAPI<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    resolve(data);
  })
}

export const getAllRecipes = () => api<Recipe[]>(`${process.env.API_RECIPES}/all/`)

type Tag = {
  name: string,
};

export const getAllTags = () => mockAPI<Tag[]>(
  [
    { name: 'Dinner' },
    { name: 'Snack' },
    { name: 'Dessert' },
    { name: 'Lunch' }
  ]
);

export default {
  getAllRecipes,
  getAllTags,
};
