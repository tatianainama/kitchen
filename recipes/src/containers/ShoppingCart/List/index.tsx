import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import Navbar from 'components/Navbar';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import List from 'components/List';
import ShoppingItem from 'src/types/shopping-cart';
import { addToCart, removeItemFromCart, removeAll } from './../actions';

import Button from 'components/Button';
import { DBRecipe } from 'src/types/recipes';

type ActionsType = {
  addToCart: typeof addToCart,
  removeItemFromCart: typeof removeItemFromCart
}

interface ShoppingListProps extends RouteComponentProps, ActionsType {
  items: ShoppingItem[],
  recipesId: string[],
  removeAll: typeof removeAll
}


const renderItem = (actions: ActionsType) => (props: ShoppingItem) => (
  <>
    <span>{props.name}</span>
    <span>
      <Button icon='delete' onClick={() => actions.removeItemFromCart(props.name)}/>
      <Button icon='remove'/>
      <input type='number' value={props.quantity} readOnly/>
      <Button icon='add'/>
    </span>
  </>
);

class ShoppingList extends Component<ShoppingListProps, {}> {
  constructor(props: ShoppingListProps) {
    super(props);
  }
  render () {
    const { addToCart, removeItemFromCart, removeAll } = this.props;
    console.log(this.props);
    return (
      <div className='cbk-shopping-list'>
        <Navbar
          title='Shopping List'
        >
          <Button onClick={() => removeAll()}>Clear</Button>
        </Navbar>
        <div>
          <List
            dense
            nonInteractive
            items={this.props.items}
            render={renderItem({
              addToCart,
              removeItemFromCart,
            })}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  return state.shoppingCart;
}

export default connect(
  mapStateToProps,
  {addToCart, removeItemFromCart, removeAll}
)(ShoppingList);