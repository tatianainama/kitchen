import React, { Component } from "react";
import {
  fetchIfNeeded as fetch,
  receiveRecipes as receive,
  selectRecipe as select,
} from "containers/Recipes/actions";
import { connect } from "react-redux";
import { Grid, Row, Cell } from "@material/react-layout-grid";
import { Button } from "@material/react-button";
import Card from 'components/Card';
import RecipeCard from 'components/RecipeCard';
import Recipe from 'types/recipes';
import Navbar from 'components/Navbar';
import { Link } from 'react-router-dom';

type RecipeListProps = {
  data: Recipe[],
  isFetching: boolean,
  selectedRecipe: any | undefined,
  fetchRecipes: (query: any) => undefined,
  receiveRecipes: (recipes: Recipe[]) => undefined,
  selectRecipe: (recipe: Recipe) => undefined,
};

class RecipeList extends Component<RecipeListProps> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    const { fetchRecipes } = this.props;
    fetchRecipes({});
  }

  componentDidUpdate(prevProps: any) {
    const { data, receiveRecipes, isFetching } = this.props;
    if (isFetching === false && data.length !== prevProps.data.length) {
      receiveRecipes(data);
    }
  }

  handleRecipeSelection(recipe: any) {
    return (event: React.MouseEvent) => this.props.selectRecipe(recipe);
  }

  handler(event: React.MouseEvent) {
    console.log('click');
  }

  render() {
    const {data, selectedRecipe, selectRecipe} = this.props;
    const actions = [{
      label: 'edit',
      handler: this.handler,
    }, {
      label: 'shopping',
      handler: this.handler
    }];
    const navbarActions = [{
      label: 'create recipe',
      onClick: () => {}
    }];

    return(
      <div>
        <Navbar
          title="Recipes"
        >
          <Button unelevated>
            <Link to='/recipes/create'>Create Recipe</Link>
          </Button>
        </Navbar>

        <Grid>
          <Row>
            <Cell columns={6}>
              {
                data.map((recipe: any, i: number) => {
                  return (
                    <Card
                      key={i}
                      title={recipe.name}
                      onClick={this.handleRecipeSelection(recipe)}
                      summary={recipe.summary}
                      actions={actions}
                    />
                  )
                })
              }
            </Cell>
            <Cell columns={6}>
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

const mapStateToProps = ({ recipes }: any, ownProps: any) => {
  return recipes;
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchRecipes: (query: any) => {
      dispatch(fetch(query))
    },
    receiveRecipes: (recipes: Recipe[]) => {
      dispatch(receive(recipes))
    },
    selectRecipe: (recipe: Recipe) => {
      dispatch(select(recipe))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeList);