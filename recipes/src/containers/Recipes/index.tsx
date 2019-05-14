import React from "react";

import { Route, RouteComponentProps } from 'react-router-dom';
import RecipeList from './List';
import Create from './Create';

const RecipesContainer = (props: RouteComponentProps) => {
  return (
    <div>
      <Route
        exact
        path={props.match.path}
        component={RecipeList}
      />
  
      <Route
        path='/recipes/create'
        component={Create}
      />
    </div>
  )
}

export default RecipesContainer;