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
import SAMPLE from 'sample.png';

interface Item extends ListItemProps {
  img?: string,
}

export interface ListProps extends RMWCListProps {
  items: Item[],
  className?: string,
  listItemClassName?: string,
  style?: CSSProperties,
  bordered?: boolean,
}

const AvatarGraphic: FunctionComponent<{
  img?: string,
}> = ({ img }) => (
  <div 
    className="cbk-list__item__avatar"
    style={{
      backgroundImage: `url(${img || SAMPLE})`
    }}
  ></div>
);

export const List: FunctionComponent<ListProps> = ({ items, className, listItemClassName, avatarList, bordered, ...props }) => {
  return (
    <RMWCList
      {...props}
      avatarList={avatarList}
      twoLine={items.some(item => item.secondaryText) || props.twoLine}
      className={cx(
        'cbk-list',
        {'cbk-list--bordered': bordered},
        className
      )}
    >
      {
        items.map(({img, ...item}, i) => {
          return (
            <SimpleListItem
              { ...item }
              graphic={avatarList ? (
                <AvatarGraphic img={img} />
              ) : undefined }
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