import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import { remove, equals } from 'ramda';
import { toast } from "react-toastify";

import Button from 'components/Button';
import Dialog from 'components/Dialog';
import List from 'components/List';
import { CBKSelect2 as Select } from 'components/Select';

import shoppingCartActions, { fetchCartActionCreator, saveCartActionCreator } from 'containers/ShoppingCart/actions';

import { ShoppingItem, ShoppingCartState, SortType } from 'types/shopping-cart';
import { AppState } from 'store/configureStore';

import { combineMultipleItems } from '../services';
import { GetMeasure } from 'services/measurements';

import './styles.scss';

type shoppingCartActionTypes = typeof shoppingCartActions;

interface ShoppingCartViewProps extends ShoppingCartState, shoppingCartActionTypes {
  fetch: typeof fetchCartActionCreator,
  save: typeof saveCartActionCreator
}

interface ShoppingCartViewState {
  dialogOpen: boolean,
  selected: ShoppingItem[],
  selectedMeasure?: {
    name: string, values: string[]
  },
  saveDisabled: boolean,
}

class ShoppingCartView extends React.Component<ShoppingCartViewProps, ShoppingCartViewState> {

  constructor (props: ShoppingCartViewProps) {
    super(props);
    this.state = {
      dialogOpen: false,
      selected: [],
      selectedMeasure: undefined,
      saveDisabled: true
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

  selectItem = (item: ShoppingItem) => {
    const duplicated = this.state.selected.findIndex(equals(item));
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
          item
        ],
        selectedMeasure: !this.state.selectedMeasure ? GetMeasure(item.unit) : this.state.selectedMeasure
      });
    }
  }

  mergeItems = () => {
    const { selected, selectedMeasure } = this.state;
    if (selectedMeasure && selected.every(item => selectedMeasure.values.includes(item.unit))) {
      try {
        const result = this.props.mergeItemsCart(this.state.selected, combineMultipleItems(this.state.selected));
        this.clearSelection(() => {
          this.setState({
            saveDisabled: false
          })
        });
      } catch(error) {
        toast.error("There was an error merging items:", error);
      }
    } else {
      toast.error("Can't merge those items, check measurements and units");
    }
  }

  clearSelection = (callback?: () => void) => {
    this.setState({
      selected: [],
      selectedMeasure: undefined
    }, callback)
  }

  removeItems = () => {
    this.props.removeMultipleItemsFromCart(this.state.selected);
    this.clearSelection(() => {
      this.setState({
        saveDisabled: false
      })
    });
  }

  sortItems = (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const sort: SortType = parseInt(event.target.value);
      this.props.sortCart(sort);
    } catch (error) {
      toast.error("There was an error sorting items: ", error);
    }
  }

  saveChanges = () => {
    // @ts-ignore: https://github.com/reduxjs/redux-thunk/issues/213
    this.props.save(this.props.items).then((result: any) => {
      if (result.error) {
        toast.error('There was an error saving the changes: ', result.error);
        this.setState({
          saveDisabled: false
        })
      } else {
        toast.success('Shopping list was saved correctly');
        this.setState({
          saveDisabled: true
        })
      }
    })
  }

  render () {
    return (
      <section className='cbk-shopping-cart-view'>
          {
            this.props.items.length ? (
              <>
                <div className='cbk-shopping-cart-view__actions'>
                  <div className='cbk-shopping-cart-view__actions--selection-actions'>
                    <Button outlined onClick={this.mergeItems} disabled={this.state.selected.length < 2}>
                      Merge
                    </Button>
                    <Button outlined onClick={() => this.clearSelection()} disabled={!this.state.selected.length}>
                      Clear
                    </Button>
                    <Button unelevated onClick={this.removeItems} disabled={!this.state.selected.length}>
                      Remove
                    </Button>
                  </div>
                  <Select
                    onChange={this.sortItems}
                    options={[
                      { label: 'name', value: SortType.Ingredient.toString() },
                      { label: 'recipe', value: SortType.Recipe.toString() }
                    ]}
                    label='sort by'
                    value=''
                  />
                  <Button outlined onClick={() => this.openDialog(true) }>
                    Delete
                  </Button>
                  <Button raised onClick={this.saveChanges} disabled={this.state.saveDisabled}>
                    Save
                  </Button>
                </div>
                <div className='cbk-shopping-cart-view__items'>
                  <div className='cbk-shopping-list'>
                    <List
                      dense
                      focusMultiple={this.state.selected}
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
                      onClick={ item => this.selectItem(item) }
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
