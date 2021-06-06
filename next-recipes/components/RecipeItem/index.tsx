import { FC, MouseEventHandler } from 'react';
import Image from 'next/image';
import { Recipe } from '@/types/recipes';
import Heart from '@/components/Icon/heart';
import { Subtitle } from '@/components/Typography';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import styles from './RecipeItem.module.css';
import Time from '../Icon/time';
import classNames from 'classnames';

dayjs.extend(duration);

type RecipeItemProps = {
  tagName?: keyof JSX.IntrinsicElements,
  onClick?: MouseEventHandler,
  recipe: Recipe,
};

export const RecipeItem: FC<RecipeItemProps> = ({ tagName, recipe, onClick }) => {
  const Tag = tagName as keyof JSX.IntrinsicElements;
  return (
    <Tag className={classNames(styles.recipeItem, {
      [styles.recipeItemClickeable]: !!onClick,
    })} onClick={onClick}>
      <div className={styles.recipeItemMedia}>
        {recipe.image && <Image src={`http://localhost:3000/${recipe.image}`} alt={recipe.name} layout='fill' />}
      </div>
      <div className={styles.recipeItemContent}>
        <Subtitle alternative>{recipe.name}</Subtitle>
        <p className={styles.recipeItemContentDescription}>
          <Time />
          {`${dayjs.duration(recipe.details.cookingTime).add(recipe.details.preparationTime).asMinutes()}'` || '-'}</p>
      </div>
      <div className={styles.recipeItemAction}>
        <Heart />
      </div>
    </Tag>
  )
};

RecipeItem.defaultProps = {
  tagName: 'div',
};

export default RecipeItem;