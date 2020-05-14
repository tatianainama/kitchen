import React from 'react';
import { Route } from 'react-router';
import RecipesContainer from 'containers/Recipes';
import CreateRecipe from 'containers/Recipes/Create';
import ViewRecipe from 'containers/Recipes/View';
import EditRecipe from 'containers/Recipes/Edit';
import ShoppingList from 'containers/ShoppingCart/List';
import PlannerContainer from 'containers/Planner';
import { Redirect } from 'react-router-dom';

const emptyRoute = (title: string) => (props: any) => {
  return (<h1>{title} {props.match.params && props.match.params.id}</h1>);
};

const routes = [
  {
    path: '/',
    exact: true,
    component: () => (<Redirect to='/recipes'/>)
  },
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
    }],
    title: 'recipes'
  }, {
    path: '/planner',
    component: PlannerContainer,
    routes: [{
      path: '/planner/lala',
      component: emptyRoute('planner lala'),
    }],
    title: 'planner'
  }, {
    path: '/shoplist',
    component: ShoppingList,
    title: 'shoplist'
  }
];

export const RouteWithSubRoutes = (route: any) => {
  return (
    <Route
      path={route.path}
      render={props => (
        <route.component location={props.location} routes={route.routes} {...props} />
      )}
    />
  );
}

export default routes;