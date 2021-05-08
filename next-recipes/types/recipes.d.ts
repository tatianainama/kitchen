export type Recipe = {
  id: string;
  name: string;
  summary: string;
  tags: string[];
  course: string[];
  image: string;
  autor: {
    name: string;
    website: string;
  };
  details: {
    url: string;
    video: string;
    preparationTime: string;
    cookingTime: string;
    servings: number;
  };
  ingredients: {
    name: string;
    ingredients: {
      name: string;
      quantity: number;
      unit: string;
      _original: string;
    }[];
  }[];
  instructions: string[];
};
