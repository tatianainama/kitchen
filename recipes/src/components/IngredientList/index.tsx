import React from 'react';
import { ISubRecipe } from 'src/types/recipes';

import './styles.scss';

type ShowIngredientsProps = {
  ingredients: ISubRecipe[],
  className?: string,
};

export default function ShowIngredients(props: ShowIngredientsProps) {
  const { ingredients } = props;
  return (
    <div className={`cbk-ingredient-list ${props.className ? props.className : ''}`} >
      {
        ingredients.map((subRecipe, i) => (
          <ul key={i}>
            {
              subRecipe.name ? 
                <li className='cbk-ingredient-list__sub-recipe'>
                  {subRecipe.name}
                </li>
                : null
            }
            {
              subRecipe.ingredients.map((ing, j) => (
                <li className='cbk-ingredient-list__ingredient' key={j}>
                  <span>{ing.name}</span>
                  <span>{ing.quantity + ing.unit}</span>
                </li>
              ))
            }
          </ul>
        ))
      }
    </div>
  )
};