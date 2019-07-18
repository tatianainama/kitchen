import React, { Component } from "react";
import {
  fetchIfNeeded as fetch,
  receiveRecipes as receive,
  selectRecipe as select,
} from "containers/Recipes/List/actions";
import { connect } from "react-redux";
import { Grid, Row, Cell } from "@material/react-layout-grid";
import Button from "components/Button";
import Card from 'components/Card';
import RecipeCard from 'components/RecipeCard';
import Recipe from 'types/recipes';
import Navbar from 'components/Navbar';
import { Link, RouteComponentProps } from 'react-router-dom';

interface RecipeListProps extends RouteComponentProps {
  data: Recipe[],
  isFetching: boolean,
  selectedRecipe: any | undefined,
  fetchRecipes: (query: any) => undefined,
  receiveRecipes: (recipes: Recipe[]) => undefined,
  selectRecipe: (recipe: Recipe) => undefined,
};

class RecipeList extends Component<RecipeListProps, {phoneDisplay: boolean}> {
  constructor(props: RecipeListProps) {
    super(props);
    this.state = {
      phoneDisplay: window.innerWidth < 840
    }
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

  handleRecipeSelection(recipe: Recipe) {
    return (event: React.MouseEvent) => {
      this.props.selectRecipe(recipe) 
      if (this.state.phoneDisplay) {
        this.props.history.push('/recipes/view/' + recipe._id)
      }
    };
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
          <Link to='/recipes/create'>
            <Button unelevated>
              Create Recipe
            </Button>
          </Link>
        </Navbar>

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
                      actions={actions}
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

const mapStateToProps = ({ recipes }: any, ownProps: any) => {
  return recipes.list;
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