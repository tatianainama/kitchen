import React from 'react';
import Recipe from '../../types/recipes';
import Icon from 'components/Icon';
import { List as Ingredients } from 'components/Ingredient';
import { ScaleTool } from 'components/Ingredient/'
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
          <ScaleTool ingredients={recipe.ingredients}></ScaleTool>
          {/* <Ingredients ingredients={recipe.ingredients} /> */}
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

export default CBKRecipeCard;