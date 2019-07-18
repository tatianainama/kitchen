import React, { useState, useEffect } from 'react';
import { getRecipeById } from './../services';
import { RouteComponentProps } from 'react-router';

import RecipeCard from 'components/RecipeCard';
import { _recipe } from 'types/recipes';

interface ViewRecipeProps extends RouteComponentProps<{id: string}>{

}

const ViewRecipe = (props: ViewRecipeProps) => {
  const [ recipe, setRecipe ] = useState({..._recipe});

  useEffect(() => {
    getRecipeById(props.match.params.id).then(recipe => setRecipe(recipe))
  });

  return (
    <div className='cbk-recipe-viewer'>
      <RecipeCard recipe={recipe}/>
    </div>
  )
}

export default ViewRecipe;