import { FC, MouseEventHandler } from 'react';
import Heart from '@/components/Icon/heart';
import { RecipeTypes } from 'additional';
import { Subtitle } from '@/components/Typography';
import Time from '../Icon/time';

import classNames from 'classnames';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from './RecipeItem.module.css';

dayjs.extend(duration);
dayjs.extend(relativeTime);

type RecipeItemProps = {
  tagName?: keyof JSX.IntrinsicElements,
  onClick?: MouseEventHandler,
  recipe: RecipeTypes.Recipe,
};

export const RecipeItem: FC<RecipeItemProps> = ({ tagName, recipe, onClick }) => {

  const Tag = tagName as keyof JSX.IntrinsicElements;

  return (
    <Tag className={classNames(
      styles.recipeItem,
      {
        [styles.recipeItemClickeable]: Boolean(onClick)
      }
    )} onClick={onClick}>
      <div className={styles.recipeItemMedia}>
      </div>
      <div className={styles.recipeItemContent}>
        <Subtitle alternative>{recipe.name}</Subtitle>
        <p className={styles.recipeItemContentDescription}>
          <Time />
        </p>
      </div>
      <div className={styles.recipeItemAction}>
        <Heart />
      </div>
    </Tag>
  );

};

RecipeItem.defaultProps = {
  'tagName': 'div'
};

export default RecipeItem;
