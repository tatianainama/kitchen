import React, { FunctionComponent } from 'react';
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
  listItemClassName?: string
}

export const List: FunctionComponent<ListProps> = ({ items, ...props }) => {
  return (
    <RMWCList
      twoLine={items.some(item => item.secondaryText)}
      className={cx(props.className, 'cbk-list')}
      {...props}
    >
      {
        items.map((item, i) => (
          <SimpleListItem
            key={i}
            className={cx(props.listItemClassName, 'cbk-list__item')}
            { ...item }
          />
        ))
      }
    </RMWCList>
  )
};

export default List;