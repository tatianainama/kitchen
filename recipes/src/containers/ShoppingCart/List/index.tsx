import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { AppState } from 'store/configureStore';
import { connect } from 'react-redux';
import Navbar from 'components/Navbar';
import { Grid, Row, Cell } from '@material/react-layout-grid';
import List from 'components/List';
import ShoppingItem from 'src/types/shopping-cart';
import { addToCart, removeItemFromCart, removeAll } from './../actions';
import Dialog from 'components/Dialog';
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

interface ShoppingListState {
  openRemoveAll: boolean,
}

const renderItem = (actions: ActionsType) => (props: ShoppingItem) => (
  <>
    <span>
      <span className='primary-text'>{props.name}</span>
      <span className='secondary-text'>{props.recipeName && props.recipeName.join(', ')}</span>
    </span>
    <span className='actions'>
      <Button icon='delete' style={{flexBasis: '20%'}} onClick={() => actions.removeItemFromCart(props.name)}/>
      <input type='number' style={{flexBasis: '60%'}} value={props.quantity} readOnly/>
      <span style={{flexBasis: '20%'}}>{props.unit}</span>
    </span>
  </>
);

class ShoppingList extends Component<ShoppingListProps, ShoppingListState> {
  constructor(props: ShoppingListProps) {
    super(props);
    this.state = {
      openRemoveAll: false
    };
  }
  render () {
    const { addToCart, removeItemFromCart, removeAll } = this.props;
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