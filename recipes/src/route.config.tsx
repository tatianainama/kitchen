import React from 'react';
import { Route } from 'react-router';
import RecipesContainer from 'containers/Recipes';

const emptyRoute = (title: string) => () => {
  return (<h1>{title}</h1>);
};

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
    routes: [{
      path: '/planner/lala',
      component: emptyRoute('planner lala'),
    }]
  }, {
    path: '/shoplist',
    component: emptyRoute('shopping list'),
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