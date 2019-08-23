import React from 'react';
import { Route } from 'react-router';
import RecipesContainer from 'containers/Recipes';
import CreateRecipe from 'containers/Recipes/Create';
import ViewRecipe from 'containers/Recipes/View';
import EditRecipe from 'containers/Recipes/Edit';
import ShoppingList from 'containers/ShoppingCart/List';
import PlannerContainer from 'containers/Planner';

const emptyRoute = (title: string) => (props: any) => {
  return (<h1>{title} {props.match.params && props.match.params.id}</h1>);
};

const routes = [
  {
    path: '/recipes',
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
    }]
  }, {
    path: '/planner',
    component: PlannerContainer,
    routes: [{
      path: '/planner/lala',
      component: emptyRoute('planner lala'),
    }]
  }, {
    path: '/shoplist',
    component: ShoppingList,
  }
];

export const RouteWithSubRoutes = (route: any) => (
  <Route
    path={route.path}
    render={props => (
      <route.component location={props.location} routes={route.routes} {...props} />
    )}
  />
);

export default routes;