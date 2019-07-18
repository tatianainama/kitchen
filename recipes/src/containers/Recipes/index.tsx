import React, { ReactType } from "react";

import { Route, RouteComponentProps } from 'react-router-dom';
import RecipeList from './List';
import Create from './Create';


const view = (props: any) => (
  <div>
    <h1>id {props.match}</h1>
  </div>
)

interface RecipeContainerProp extends RouteComponentProps {
  routes: {
    path: string,
    component: ReactType<any>
  }[]
};

const RecipesContainer = (props: RecipeContainerProp) => {
  return (
    <div>
      <Route
        exact
        path={props.match.path}
        component={RecipeList}
      />
      {
        props.routes.map((route: any, i: number) => (
          <Route
            key={i}
            path={route.path}
            component={route.component}
          />
        ))
      }
    </div>
  )
}

export default RecipesContainer;