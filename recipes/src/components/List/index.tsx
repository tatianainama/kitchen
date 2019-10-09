import React from 'react';
import classnames from 'classnames';

import './styles.scss';


type ListProps<T> = {
  nonInteractive?: boolean,
  dense?: boolean,
  focus?: number,
  items: T[],
  render: (item: T, index: number) => React.ComponentElement<T, any>
}

const CBKList = <T extends {}>(props: ListProps<T>) => (
  <ul className={
    classnames({
      'cbk-list': true,
      'cbk-list--dense': props.dense
    })
  }>
    {
      props.items.map((item, index) => (
        <li
          key={index}
          className={`cbk-list__item ${index === props.focus ? 'cbk-list__item--focus' : ''}`}
        >
          {props.render(item, index)}
        </li>
      ))
    }
  </ul>
);

export default CBKList