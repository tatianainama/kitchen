import React, { Component } from 'react';

import './styles.scss';

type Ingredient = {
  name: string,
  ingredients: {
    name: string,
    quantity: number,
    unit: string,
    _original: string,
  }[],
}

export type Recipe = {
  _id: string,
  name: string,
  author: {
    name: string,
  },
  details: {
    preparationTime: string,
    cookingTime: string,
    servings: number,
  },
  ingredients: Ingredient[],
  instructions: string[],
  summary: string,
  tags: string[],
}

type RecipeCardProps = {
  recipe: Recipe,
  actions?: boolean,
}

export class RecipeCard extends Component<RecipeCardProps, {}> {
  render() {
    return (
      <h2>recipeCard</h2>
    );
  }
}

export default RecipeCard;