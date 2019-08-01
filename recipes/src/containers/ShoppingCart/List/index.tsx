import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import Navbar from 'components/Navbar';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import List from 'components/List';
import ShoppingItem from 'src/types/shopping-cart';

interface ShoppingListProps extends RouteComponentProps {
  items: ShoppingItem[],
}

class ShoppingList extends Component<ShoppingListProps, {}> {
  render () {
    console.log(this.props)
    return (
      <div className='cbk-shopping-list'>
        <Navbar
          title='Shopping List'
        >

        </Navbar>
        <div>
          <List
            dense
            items={this.props.items.map((item) => ({
              primaryText: item.name
            }))}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  return state.shoppingCart;
}

const mapDispatchToProps = (dispatch: any) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShoppingList);