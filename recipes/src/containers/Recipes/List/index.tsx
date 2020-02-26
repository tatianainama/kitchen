import React, { Component, ReactEventHandler } from "react";
import {
  fetchIfNeeded as fetch,
  receiveRecipes as receive,
  selectRecipe as select,
  deleteRecipeActionCreator as deleteRecipe,
} from "containers/Recipes/List/actions";
import {
  addRecipeToCart,
  removeFromCart
} from 'containers/ShoppingCart/actions';
import plannerActions from 'containers/Planner/actions';

import { connect } from "react-redux";
import { Grid, Row, Cell } from "@material/react-layout-grid";
import Button from "components/Button";
import Card from 'components/Card';
import RecipeCard from 'components/RecipeCard';
import Recipe, { DBRecipe } from 'types/recipes';
import Navbar from 'components/Navbar';
import { Link, RouteComponentProps } from 'react-router-dom';
import Input from 'components/Input';
import { throttle } from 'throttle-debounce';
import Spinner from 'components/Spinner';

import './styles.scss';
import { UiState, Display } from "types/ui";

interface RecipeListProps extends RouteComponentProps {
  data: DBRecipe[],
  isFetching: boolean,
  selectedRecipe: any | undefined,
  ui: UiState,
  fetchRecipes: (query: string) => undefined,
  receiveRecipes: (recipes: DBRecipe[]) => undefined,
  selectRecipe: (recipe?: DBRecipe) => undefined,
  removeFromCart: (recipe: DBRecipe) => undefined,
  addRecipeToCart: (recipe: DBRecipe) => undefined,
  addRecipeToPlanner: (recipe: DBRecipe) => undefined,
  deleteRecipe: (id: string) => undefined
};

class RecipeList extends Component<RecipeListProps, {phoneDisplay: boolean, search: string}> {
  constructor(props: RecipeListProps) {
    super(props);
    this.state = {
      phoneDisplay: this.props.ui.display === Display.Mobile,
      search: '',
    }
  }

  componentDidMount() {
    const { fetchRecipes } = this.props;
    fetchRecipes('');
  }

  autocompleteSearch = throttle(500, (query: string) => {
    this.props.fetchRecipes(query)
  })


  changeQuery = (query: string) => {
    this.setState({
      search: query
    }, () => {
      this.autocompleteSearch(this.state.search)
    })
  }

  componentDidUpdate(prevProps: any) {
    const { data, receiveRecipes, isFetching } = this.props;
    if (isFetching === false && data.length !== prevProps.data.length) {
      receiveRecipes(data);
    }
  }

  cleanRecipeSelection() {
    this.props.selectRecipe();
  }

  handleRecipeSelection(recipe: DBRecipe) {
    return (event: React.MouseEvent) => {
      if (this.state.phoneDisplay) {
        this.props.history.push('/recipes/view/' + recipe._id)
        this.cleanRecipeSelection();
      } else {
        this.props.selectRecipe(recipe) 
      }
    };
  }

  handleEditRecipe = (id = '') => (event: React.MouseEvent) => {
    this.props.history.push('/recipes/edit/' + id)
    this.cleanRecipeSelection();
  }

  handleAddToShopping = (recipe: DBRecipe) => (event: React.MouseEvent) => {
    this.props.addRecipeToCart(recipe)
  }

  handleAddToPlanner = (recipe: DBRecipe) => (event: React.MouseEvent) => {
    this.props.addRecipeToPlanner(recipe)
  }

  handleDeleteRecipe = (id: string) => (event: React.MouseEvent) => {
    this.props.deleteRecipe(id)
  }

  handler = (event: React.MouseEvent) => {
    console.log('click', event);
  }

  actions = (recipe: DBRecipe) => [{
    label: 'edit',
    handler: this.handleEditRecipe(recipe._id),
  }, {
    label: 'shopping',
    handler: this.handleAddToShopping(recipe)
  }, {
    label: 'planner',
    handler: this.handleAddToPlanner(recipe)
  }];

  icons = (id = '') => [{
    icon: 'open_in_new',
    handler: () => this.props.history.push('/recipes/view/' + id)
  }, {
    icon: 'delete_outline',
    handler: this.handleDeleteRecipe(id)
  }]

  render() {
    const {data, selectedRecipe, isFetching} = this.props;
    return(
      <div className='cbk-recipes-list'>
        <Navbar
          title="Recipes"
        >
          <Input
            value={this.state.search}
            label='search'
            onChange={(e) => this.changeQuery(e.currentTarget.value)}
            button={{
              icon: 'clear',
              onClick: () => this.changeQuery('')
            }}
            className='cbk-recipes-list__search'
          />
          <Link to='/recipes/create'>
            <Button unelevated>
              Create Recipe
            </Button>
          </Link>
        </Navbar>
        {
          isFetching && (<Spinner/>)
        }
        <Grid>
          <Row>
            <Cell columns={6} phoneColumns={4} tabletColumns={8}>
              {
                data.map((recipe, i) => {
                  return (
                    <Card
                      key={i}
                      title={recipe.name}
                      onClick={this.handleRecipeSelection(recipe)}
                      summary={recipe.summary}
                      actions={this.actions(recipe)}
                      icons={this.icons(recipe._id)}
                      img={recipe.image}
                    />
                  )
                })
              }
            </Cell>
            <Cell columns={6} phoneColumns={4} tabletColumns={8}>
              { selectedRecipe !== undefined && 
                <RecipeCard 
                  recipe={selectedRecipe}
                />
              }
            </Cell>
          </Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    ...state.recipes,
    ui: state.ui,
    shoppingCart: state.shoppingCart.cart
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchRecipes: (query: string) => {
      dispatch(fetch(query))
    },
    receiveRecipes: (recipes: DBRecipe[]) => {
      dispatch(receive(recipes))
    },
    selectRecipe: (recipe: DBRecipe) => {
      dispatch(select(recipe))
    },
    addRecipeToCart: (recipe: DBRecipe) => {
      dispatch(addRecipeToCart(recipe))
    },
    removeFromCart: (recipe: DBRecipe) => {
      dispatch(removeFromCart(recipe))
    },
    addRecipeToPlanner: (recipe: DBRecipe) => {
      dispatch(plannerActions.addToBacklog(recipe))
    },
    deleteRecipe: (id: string) => {
      dispatch(deleteRecipe(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeList);