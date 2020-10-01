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
  style?: CSSProperties
}

const AvatarGraphic: FunctionComponent<{
  img?: string,
}> = ({ img }) => (
  <div style={{
    width: 48,
    height: 24,
    backgroundImage: `url(${img || SAMPLE})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}></div>
);

export const List: FunctionComponent<ListProps> = ({ items, className, listItemClassName, avatarList, ...props }) => {
  
  return (
    <RMWCList
      {...props}
      avatarList={avatarList}
      twoLine={items.some(item => item.secondaryText)}
      className={cx('cbk-list', className)}
    >
      {
        items.map((item, i) => {
          return (
            <SimpleListItem
              { ...item }
              graphic={avatarList ? (
                <AvatarGraphic img={item.img}/>
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