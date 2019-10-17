import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { update } from 'ramda';

import './styles.scss';

type ItemProps = { focused?: boolean } ;

type ListProps<T extends ItemProps> = {
  nonInteractive?: boolean,
  focusOnClick?: boolean,
  dense?: boolean,
  focusMultiple?: number[],
  focus?: number,
  items: T[],
  render: (item: T, index: number) => React.ComponentElement<T, any>,
  onClick?: (item: T, index: number) => void,
}

const CBKList = <T extends ItemProps>(props: ListProps<T>) => {
  return (
    <ul className={
      classnames({
        'cbk-list': true,
        'cbk-list--non-interactive': props.nonInteractive,
        'cbk-list--dense': props.dense
      })
    }>
      {
        props.items.map((item, index) => (
          <li
            key={index}
            className={
              classnames({
                'cbk-list__item': true,
                'cbk-list__item--focus': index === props.focus || item.focused || (props.focusMultiple && props.focusMultiple.includes(index))
              })
            }
            onClick={() => { props.onClick ? props.onClick(item, index) : null }}
          >
            {props.render(item, index)}
          </li>
        ))
      }
    </ul>
  );
};

export default CBKList