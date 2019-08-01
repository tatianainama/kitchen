import React from 'react';
import List, {ListItem, ListItemText, ListItemMeta} from '@material/react-list';

import '@material/react-list/dist/list.css';

type ListProps = {
  nonInteractive?: boolean,
  dense?: boolean,
  items: {
    primaryText: string,
    secondaryText?: string,
  }[]
}

const CBKList = (props: ListProps) => (
  <List dense={props.dense} nonInteractive={props.nonInteractive}>
    {
      props.items.map((item, index) => (
        <ListItem key={index}>
          <ListItemText
            primaryText={item.primaryText}
          />
        </ListItem>
      ))
    }
  </List>
);

export default CBKList