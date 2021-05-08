import { Recipe } from '@/types/recipes';
import { FunctionComponent, FC } from 'react';
import styles from './RecipeItem.module.css';

type RecipeItemProps = {
  tagName?: keyof JSX.IntrinsicElements,
  recipe: Recipe
};

export const RecipeItem: FC<RecipeItemProps> = ({ tagName, recipe }) => {
  const Tag = tagName as keyof JSX.IntrinsicElements;
  return (
    <Tag>
      <h3>{recipe.name}</h3>
    </Tag>
  )
};

RecipeItem.defaultProps = {
  tagName: 'div',
};

export default RecipeItem;