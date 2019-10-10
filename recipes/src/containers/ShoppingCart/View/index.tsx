import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';

import ShoppingList from 'components/ShoppingList';

import shoppingCartActions, { fetchCartActionCreator } from 'containers/ShoppingCart/actions';

import { ShoppingItem, ShoppingCartState } from 'types/shopping-cart';
import { AppState } from 'store/configureStore';

import './styles.scss';

type shoppingCartActionTypes = typeof shoppingCartActions;

interface ShoppingCartViewProps extends ShoppingCartState, shoppingCartActionTypes {
  fetch: typeof fetchCartActionCreator,
}

const ShoppingCartView: React.FunctionComponent<ShoppingCartViewProps> = ( props ) => {
  return (
    <section className='cbk-shopping-cart-view'>
      {
        props.items.length ? (
          <ShoppingList
            items={props.items}
          />
        ) : (
          <div className='cbk-shopping-cart-view--empty'>
            Shopping cart is empty
          </div>
        )
      }
    </section>
  )
};

const mapStateToProps = (state: AppState) => {
  return {
    ...state.shoppingCart
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, any, any>) => ({
  fetch: () => dispatch(fetchCartActionCreator()),
  ...bindActionCreators(shoppingCartActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShoppingCartView);
