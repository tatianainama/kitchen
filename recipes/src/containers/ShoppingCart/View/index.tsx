import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import { update, includes, remove, findIndex, equals } from 'ramda';

import Button from 'components/Button';
import Dialog from 'components/Dialog';
import List from 'components/List';

import shoppingCartActions, { fetchCartActionCreator, saveCartActionCreator } from 'containers/ShoppingCart/actions';

import { ShoppingItem, ShoppingCartState } from 'types/shopping-cart';
import { AppState } from 'store/configureStore';

import { combineItems, combineMultipleItems } from '../services';
import { GetMeasure } from 'services/measurements';
import './styles.scss';

type shoppingCartActionTypes = typeof shoppingCartActions;
interface SelectedItems extends ShoppingItem {
  index: number
};

interface ShoppingCartViewProps extends ShoppingCartState, shoppingCartActionTypes {
  fetch: typeof fetchCartActionCreator,
  save: typeof saveCartActionCreator,
}

interface ShoppingCartViewState {
  dialogOpen: boolean,
  selected: SelectedItems[],
  selectedMeasure?: {
    name: string, values: string[]
  },
}

class ShoppingCartView extends React.Component<ShoppingCartViewProps, ShoppingCartViewState> {

  constructor (props: ShoppingCartViewProps) {
    super(props);
    this.state = {
      dialogOpen: false,
      selected: [],
      selectedMeasure: undefined,
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

  selectItem = (item: ShoppingItem, index: number) => {
    const duplicated = this.state.selected.findIndex(
      selected => selected._original === item._original && selected.recipeName === item.recipeName
    );
    if (duplicated !== -1) {
      const newSelection = remove(duplicated, 1, this.state.selected);
      this.setState({
        selected: newSelection,
        selectedMeasure: newSelection.length ? GetMeasure(newSelection[0].unit) : undefined
      })
    } else {
      this.setState({
        selected: [
          ...this.state.selected,
          { ...item, index }
        ],
        selectedMeasure: !this.state.selectedMeasure ? GetMeasure(item.unit) : this.state.selectedMeasure
      });
    }
  }

  mergeItems = () => {
    const { selected, selectedMeasure } = this.state;
    console.log(selected, selectedMeasure)
    if (selectedMeasure && selected.every(item => selectedMeasure.values.includes(item.unit))) {
      try {
        this.props.mergeItemsCart(this.state.selected.map(selected => selected._original), combineMultipleItems(this.state.selected));
        this.clearSelection();
      } catch(error) {
        console.log(error)
      }
    } else {
      console.log('one or more items do not match one of the selected measurements')
    }
  }

  clearSelection = () => {
    this.setState({
      selected: [],
      selectedMeasure: undefined,
    })
  }

  render () {
    return (
      <section className='cbk-shopping-cart-view'>
          {
            this.props.items.length ? (
              <>
                <div className='cbk-shopping-cart-view__actions'>
                  {
                    this.state.selected.length >= 2 ? (
                      <>
                        <Button
                          outlined
                          onClick={this.mergeItems}
                        >
                          Merge
                        </Button>
                        <Button
                          outlined
                          onClick={this.clearSelection}
                        >
                          Clear
                        </Button>
                      </>
                    ) : null
                  }
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
                <div className='cbk-shopping-cart-view__items'>
                  <div className='cbk-shopping-list'>
                    <List
                      dense
                      focusMultiple={this.state.selected.map(item => item.index)}
                      items={this.props.items}
                      render={ item => (
                        <div className='cbk-shopping-list__item'>
                          <div className='cbk-shopping-list__item__name'>
                            {item.name}
                            <div className='cbk-shopping-list__item__name__recipes'>
                              {
                                item.recipeName && item.recipeName.join(', ')
                              }
                            </div>
                          </div>
                          <div className='cbk-shopping-list__item__quantity'>
                            {item.quantity} {item.unit}
                          </div>
                        </div>
                      )}
                      onClick={(item, index) => { this.selectItem(item, index) }}
                    />
                  </div>
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
