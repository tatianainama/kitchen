import React from 'react';
import List from 'components/List';
import ShoppingItem from 'types/shopping-cart';
import { groupBy } from 'ramda';

import './styles.scss';

interface ShoppingListProps {
  items: ShoppingItem[],
}

const ShoppingList: React.FunctionComponent<ShoppingListProps> = ({ items }) => (
  <div className='cbk-shopping-list'>
    <List
      dense
      items={items}
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
    />
  </div>
)

export default ShoppingList;