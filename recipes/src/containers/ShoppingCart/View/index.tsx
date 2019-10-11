import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';

import ShoppingList from 'components/ShoppingList';
import Button from 'components/Button';
import Dialog from 'components/Dialog';

import shoppingCartActions, { fetchCartActionCreator, saveCartActionCreator } from 'containers/ShoppingCart/actions';

import { ShoppingItem, ShoppingCartState } from 'types/shopping-cart';
import { AppState } from 'store/configureStore';

import './styles.scss';

type shoppingCartActionTypes = typeof shoppingCartActions;

interface ShoppingCartViewProps extends ShoppingCartState, shoppingCartActionTypes {
  fetch: typeof fetchCartActionCreator,
  save: typeof saveCartActionCreator,
}

class ShoppingCartView extends React.Component<ShoppingCartViewProps, { dialogOpen: boolean }> {

  constructor (props: ShoppingCartViewProps) {
    super(props);
    this.state = {
      dialogOpen: false
    }
  }
  
  private actions = {
    cancel: {
      label: 'cancel',
      onSelect: () => { this.openDialog(false) }
    },
    delete: {
      label: 'delete',
      onSelect: () => { this.deleteCart(); this.openDialog(false); }
    }
  };

  componentDidMount() {
    if(!this.props.items.length) {
      this.props.fetch();
    }
  }

  deleteCart = () => {
    this.props.save([], true);
  }

  openDialog = (state: boolean) => {
    this.setState({
      dialogOpen: state
    })
  }

  render () {
    return (
          <section className='cbk-shopping-cart-view'>
              {
                this.props.items.length ? (
                  <>
                    <div className='cbk-shopping-cart-view__items'>
                      <ShoppingList
                        items={this.props.items}
                      />
                    </div>
                    <div className='cbk-shopping-cart-view__actions'>
                      <Button
                        outlined
                        onClick={() => this.openDialog(true) }
                      > Delete
                      </Button>
                      <Button
                        raised
                        onClick={() => this.props.save(this.props.items)}
                      > Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className='cbk-shopping-cart-view--empty'>
                    Shopping cart is empty
                  </div>
                )
              }
              {
                this.state.dialogOpen ? (
                  <Dialog
                    isOpen={this.state.dialogOpen}
                    actions={this.actions}
                  >
                    <span>Are you sure you want to delete the shopping cart?</span>
                  </Dialog>
                ) : null
              }
          </section>
        )
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    ...state.shoppingCart
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, any, any>) => ({
  fetch: () => dispatch(fetchCartActionCreator()),
  save: (cart: ShoppingItem[], deleted?: boolean) => dispatch(saveCartActionCreator(cart, deleted)),
  ...bindActionCreators(shoppingCartActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShoppingCartView);
