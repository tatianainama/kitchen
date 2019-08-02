import React from 'react';

import './styles.scss';


type ListProps<T> = {
  nonInteractive?: boolean,
  dense?: boolean,
  items: T[],
  render: (item: T) => React.ComponentElement<T, any>
}

const CBKList = <T extends {}>(props: ListProps<T>) => (
  <ul className='cbk-list'>
    {
      props.items.map((item, index) => (
        <li
          key={index}
          className='cbk-list__item'
        >
          {props.render(item)}
        </li>
      ))
    }
  </ul>
);

export default CBKList