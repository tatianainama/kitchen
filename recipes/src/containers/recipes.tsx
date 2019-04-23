import React, { Component } from "react";
import {
  fetchRecipes,
  receiveRecipes,
} from "store/recipes/actions";
import { connect } from "react-redux";
import { Grid, Row, Cell } from "@material/react-layout-grid";
import Card from 'components/Card';

class Recipes extends Component<any, any> {
  constructor(props: any) {
    super(props);
    console.log('props', props);
  }

  componentDidMount() {
    console.log('props', this.props)
    const { dispatch } = this.props;
    dispatch(fetchRecipes({}));
  }

  componentDidUpdate(prevProps: any) {
    const { dispatch, recipes } = this.props;
    dispatch(receiveRecipes(recipes));
  }

  render() {
    console.log(this.props.data);

    return(
      <Cell columns={6}>
        {
          this.props.data.map((recipe: any, i: number) => {
            console.log("card");
            return (
              <Row>
                <Cell columns={10}>
                  <Card
                    key="i"
                    title={recipe.name}
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

function mapStateToProps(state: any) {
  const { recipes } = state;
  return state.recipes;
}

export default  connect(mapStateToProps)(Recipes);