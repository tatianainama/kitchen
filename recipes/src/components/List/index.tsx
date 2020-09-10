import React from 'react';
import classnames from 'classnames';
import { includes } from 'ramda';

import './styles.scss';

type ItemProps = { focused?: boolean } ;

type ListProps<T extends any> = {
  nonInteractive?: boolean,
  focusOnClick?: boolean,
  dense?: boolean,
  focusMultiple?: T[],
  focus?: number,
  items: T[],
  render: (item: T, index: number) => React.ComponentElement<T, any>,
  onClick?: (item: T, index: number) => void,
}

const CBKList = <T extends any>({onClick = () => {}, ...props}: ListProps<T>) => {
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
                'cbk-list__item--focus': index === props.focus || (props.focusMultiple && includes(item, props.focusMultiple))
              })
            }
            onClick={() => onClick(item, index)}
          >
            {props.render(item, index)}
          </li>
        ))
      }
    </ul>
  );
};

export default CBKList