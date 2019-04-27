import React from 'react';
import RecipesContainer from 'containers/Recipes';
import { Route } from 'react-router';

const emptyRoute = (title: string) => () => (<h1>{title}</h1>);

const routes = [
  {
    path: '/recipes',
    component: RecipesContainer,
    routes: [{
      path: '/recipes/create',
      component: emptyRoute('create recipe'),
    },
    {
      path: '/recipes/edit',
      component: emptyRoute('edit recipe'),
    }]
  }, {
    path: '/planner',
    component: emptyRoute('planner'),
  }, {
    path: '/shoplist',
    component: emptyRoute('shopping list'),
  }
];

export const RouteWithSubRoutes = (route: any) => (
  <Route
    path={route.path}
    render={props => (
      <route.component {...props} routes={route.routes} />
    )}
  />
);

export default routes;