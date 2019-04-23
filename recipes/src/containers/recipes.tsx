import React, { Component } from "react";
import {
  fetchIfNeeded as fetch,
  receiveRecipes as receive,
  selectRecipe as select,
} from "store/recipes/actions";
import { connect } from "react-redux";
import { Grid, Row, Cell } from "@material/react-layout-grid";
import Card from 'components/Card';

type RecipesContainerProps = {
  data: [],
  isFetching: boolean,
  selectedRecipe: {} | undefined,
  fetchRecipes: (query: any) => undefined,
  receiveRecipes: (recipes: []) => undefined,
  selectRecipe: (recipe: any) => undefined,
};

class Recipes extends Component<RecipesContainerProps> {
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

  render() {
    return(
      <Cell columns={6}>
        {
          this.props.data.map((recipe: any, i: number) => {
            return (
              <Row key={i}>
                <Cell columns={10}>
                  <Card
                    title={recipe.name}
                    recipe={recipe}
                    onClick={() => this.props.selectRecipe(recipe)}
                  />
                </Cell>
              </Row>
            )
          })
        }
      </Cell>
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
    receiveRecipes: (recipes: []) => {
      dispatch(receive(recipes))
    },
    selectRecipe: (recipe: any) => {
      dispatch(select(recipe))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recipes);