import React, { Component } from 'react';
import IRecipe, { IIngComponent, IIngredient } from '../../types/recipes';
import Card, {
  CardActions,
  CardActionButtons,
  CardPrimaryContent,
  CardMedia,
} from "@material/react-card";
import Icon from 'components/Icon';
import moment from 'moment';

import sample_img from "components/Card/sample.png";
import { ReactComponent as Preparation } from 'svgs/preparation.svg';
import { ReactComponent as Cooking } from 'svgs/cooking.svg';
import { ReactComponent as Servings } from 'svgs/servings.svg';

import './styles.scss';


type ShowIngredientsProps = {
  ingredients: IIngComponent[]
};

function ShowIngredients(props: ShowIngredientsProps) {
  const { ingredients } = props;
  return (
    <div className="cbk-ingredient-list">
      {
        ingredients.map((item, i) => (
          <ul key={i}>
            {
              item.name ? 
                <li className="section-name">
                  {item.name}
                </li>
                : null
            }
            {
              item.ingredients.map((ing, j) => (
                <li className='ingredient' key={j}>
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
}


type RecipeCardProps = {
  recipe: IRecipe,
}

function CBKRecipeCard(props: RecipeCardProps) {
  const { recipe } = props;
  const prepTime = moment.duration(recipe.details.preparationTime).humanize();
  const cookTime = moment.duration(recipe.details.cookingTime).humanize();
  const servings = recipe.details.servings;

  return (
    <Card outlined className='cbk-recipe-card'>
      <div className='cbk-recipe-card__primary'>
        <CardMedia square imageUrl={sample_img} className='cbk-recipe-card__primary__image'/>
        <div className='cbk-recipe-card__primary__title'>
          <h6>{recipe.name}</h6>
          <p>{recipe.summary}</p>
          <ul>
            <li>
              <Icon width={32} height={32}><Preparation/></Icon>
              <label>{prepTime}</label>
            </li>
            <li>
              <Icon width={32} height={32}><Cooking/></Icon>
              <label>{cookTime}</label>
            </li>
            <li>
              <Icon width={32} height={32}><Servings/></Icon>
              <label>{servings}</label>
            </li>
          </ul>
        </div>
      </div>
      <div className='cbk-recipe-card__content'>
        <div className='cbk-recipe-card__content__ingredients'>
          <ShowIngredients ingredients={recipe.ingredients} />
        </div>
        <div className='cbk-recipe-card__content__instructions'>
          <ol>
            {
              recipe.instructions.map((instruction, i) => (
                <li key={i}>{instruction}</li>
              ))
            }            
          </ol>
        </div>
      </div>
    </Card>
  )
}

export default CBKRecipeCard;