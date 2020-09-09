import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import Navbar from 'components/Navbar';
import ShoppingItem from 'src/types/shopping-cart';
import { addRecipeToCart, removeItemFromCart, removeAll } from './../actions';
import Dialog from 'components/Dialog';
import Button from 'components/Button';

type ActionsType = {
  addToCart: typeof addRecipeToCart,
  removeItemFromCart: typeof removeItemFromCart
}

interface ShoppingListProps extends RouteComponentProps, ActionsType {
  items: ShoppingItem[],
  recipesId: string[],
  removeAll: typeof removeAll
}

interface ShoppingListState {
  openRemoveAll: boolean,
}

class ShoppingList extends Component<ShoppingListProps, ShoppingListState> {
  constructor(props: ShoppingListProps) {
    super(props);
    this.state = {
      openRemoveAll: false
    };
  }
  render () {
    const { removeAll } = this.props;
    return (
      <div className='cbk-shopping-list'>
        <Navbar
          title='Shopping List'
        >
          <Button onClick={() => this.setState({openRemoveAll: true})}>Clear</Button>
        </Navbar>
        <div>
          <Dialog
            isOpen={this.state.openRemoveAll}
            actions={{
              cancel: { label: 'cancel', onSelect: () => this.setState({openRemoveAll: false})},
              accept: { label: 'delete', onSelect: () => removeAll(), isDefault: true}
            }}
          >
            <p>Are you sure you want to remove all items from shopping list ?</p>
          </Dialog>
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
  {addToCart: addRecipeToCart, removeItemFromCart, removeAll}
)(ShoppingList);