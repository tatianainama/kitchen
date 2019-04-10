import React, { ReactNode, ReactChildren } from 'react';
import Drawer, {
  DrawerHeader,
  DrawerSubtitle,
  DrawerTitle,
  DrawerContent,
} from '@material/react-drawer';
import List, {ListItem, ListItemText} from '@material/react-list';

import '@material/react-drawer/dist/drawer.min.css';
import '@material/react-list/dist/list.min.css';

import './styles.scss';
import { ReactNodeArray } from 'prop-types';

type CBKDrawerProps = {
  children: ReactNodeArray,
}

function CBKDrawer(props: CBKDrawerProps) {
  return (
    <Drawer className='cbk-drawer'>
      <DrawerHeader>
        <DrawerTitle tag='h1'>
          cookbook
        </DrawerTitle>
      </DrawerHeader>

      <DrawerContent tag='main'>
        <List>
          {
            props.children.map((child: any, i) => (
              <ListItem key={i}>
                { child }
              </ListItem>
            ))
          }
        </List>
      </DrawerContent>
    </Drawer>
  );
}

export default CBKDrawer;