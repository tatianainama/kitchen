import React, { FunctionComponent, CSSProperties } from 'react';
import cx from 'classnames';
import {
  List as RMWCList,
  ListProps as RMWCListProps,
  SimpleListItem,
  SimpleListItemProps as ListItemProps
} from '@rmwc/list';

import '@rmwc/list/styles';
import './styles.scss';

export interface ListProps extends RMWCListProps {
  items: ListItemProps[],
  className?: string,
  listItemClassName?: string,
  style?: CSSProperties
}

export const List: FunctionComponent<ListProps> = ({ items, className, listItemClassName, ...props }) => {
  
  return (
    <RMWCList
      {...props}
      twoLine={items.some(item => item.secondaryText)}
      className={cx('cbk-list', className)}
    >
      {
        items.map((item, i) => {
          return (
            <SimpleListItem
              { ...item }
              key={i}
              className={cx(listItemClassName, 'cbk-list__item')}
            />
          )
        })
      }
    </RMWCList>
  )
};

export default List;