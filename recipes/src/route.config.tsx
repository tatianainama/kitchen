import React, { Component, FunctionComponent } from 'react';
import { Route } from 'react-router';
import RecipesContainer from 'containers/Recipes';
import CreateRecipe from 'containers/Recipes/Create';
import ViewRecipe from 'containers/Recipes/View';
import EditRecipe from 'containers/Recipes/Edit';
import ShoppingList from 'containers/ShoppingCart/List';
import PlannerContainer from 'containers/Planner';
import { Redirect, RouteComponentProps } from 'react-router-dom';

const emptyRoute = (title: string) => (props: any) => {
  return (<h1>{title} {props.match.params && props.match.params.id}</h1>);
};

type RouteType = {
  path: string,
  component: any
}

interface NavbarRoutesType extends RouteType {
  routes?: RouteType[],
  title: string
}

export const navbarRoutes: NavbarRoutesType[] = [{
  path: '/recipes',
  title: 'recipes',
  component: RecipesContainer,
  routes: [{
    path: '/recipes/create',
    component: CreateRecipe,
  }, {
    path: '/recipes/view/:id',
    component: ViewRecipe
  },
  {
    path: '/recipes/edit/:id',
    component: EditRecipe,
  }],
}, {
  path: '/planner',
  title: 'planner',
  component: PlannerContainer,
  routes: [{
    path: '/planner/lala',
    component: emptyRoute('planner lala'),
  }],
}, {
  title: 'shoplist',
  path: '/shoplist',
  component: ShoppingList,
}];

const routes = [
  {
    path: '/',
    exact: true,
    component: () => (<Redirect to='/recipes'/>)
  },
  ...navbarRoutes
];

export const RouteWithSubRoutes = (route: any) => {
  return (
    <Route
      path={route.path}
      render={props => (
        <route.component routes={route.routes} {...props} />
      )}
    />
  );
}

export default routes;