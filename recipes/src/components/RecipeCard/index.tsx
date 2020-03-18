import React, { Component } from 'react';
import Recipe, { SubRecipe, Ingredient } from '../../types/recipes';
import Card, {
  CardMedia,
} from "@material/react-card";
import Icon from 'components/Icon';
import { List as Ingredients } from 'components/Ingredient';
import StrikeText from 'components/StrikeText';
import moment from 'moment';

import sample_img from "components/Card/sample.png";
const API: string = process.env.REACT_APP_API || '';

import './styles.scss';

type RecipeCardProps = {
  recipe: Recipe,
}

const CBKRecipeCard: React.FunctionComponent<RecipeCardProps> = ({ recipe }) => {
  const prepTime = moment.duration(recipe.details.preparationTime).humanize();
  const cookTime = moment.duration(recipe.details.cookingTime).humanize();

  return (
    <div className="cbk-recipe-card">
      <div className="cbk-recipe-card__header">
        <div className="cbk-recipe-card__header__media" style={recipe.image ? {backgroundImage: `url(${API}/${recipe.image})`} : undefined}></div>
        <div className="cbk-recipe-card__header__name">
          <h4>
            { recipe.name }
          </h4>
          <p>
            { recipe.summary }
          </p>
        </div>
        <div className="cbk-recipe-card__header__information">
          <div className="cbk-recipe-card__header__information__author">
            by { recipe.details.url ? (
              <a href={recipe.details.url}>{ recipe.author.name }</a>
            ) : (
              <label>{recipe.author.name}</label>
            )
            }
          </div>
          <div className="cbk-recipe-card__header__information__recipe-data">
            <ul>
              {
                prepTime && (
                  <li>
                    <Icon width={32} height={32} icon='preparation' />
                    <label>{prepTime}</label>
                  </li>
                )
              }
              {
                cookTime && (
                  <li>
                    <Icon width={32} height={32} icon='cooking' />
                    <label>{cookTime}</label>
                  </li>
                )
              }
              {
                recipe.details.servings && (
                  <li>
                    <Icon width={32} height={32} icon='servings' />
                    <label>{recipe.details.servings}</label>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
      <div className="cbk-recipe-card__content">
        <div className="cbk-recipe-card__content__ingredients">
          <Ingredients ingredients={recipe.ingredients} />
        </div>
        <div className="cbk-recipe-card__content__instructions">
          <ol>
            {
              recipe.instructions.map((instruction, i) => (
                <li key={i}>
                  <StrikeText>
                    {instruction}
                  </StrikeText>
                </li>
              ))
            }            
          </ol>
        </div>
      </div>
    </div>
  );
}

function CBKRecipeCard2(props: RecipeCardProps) {
  const { recipe } = props;
  const prepTime = moment.duration(recipe.details.preparationTime).humanize();
  const cookTime = moment.duration(recipe.details.cookingTime).humanize();
  const servings = recipe.details.servings;


  return (
    <Card outlined className='cbk-recipe-card'>
      <div className='cbk-recipe-card__primary'>
        <CardMedia square imageUrl={recipe.image ? `${API}/${recipe.image}` : sample_img} className='cbk-recipe-card__primary__image'/>
        <div className='cbk-recipe-card__primary__title'>
          <h4>{recipe.name}</h4>
          <p>{recipe.summary}</p>
          <p>
            <b>Author:</b> {recipe.author.name} {recipe.details.url && (<a href={recipe.details.url}>(website)</a>)}
          </p>
          <ul>
            <li>
              <Icon width={32} height={32} icon='preparation' />
              <label>{prepTime}</label>
            </li>
            <li>
              <Icon width={32} height={32} icon='cooking' />
              <label>{cookTime}</label>
            </li>
            <li>
              <Icon width={32} height={32} icon='servings' />
              <label>{servings}</label>
            </li>
          </ul>
        </div>
      </div>
      <div className='cbk-recipe-card__content'>
        <div className='cbk-recipe-card__content__ingredients'>
          <Ingredients ingredients={recipe.ingredients} />
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