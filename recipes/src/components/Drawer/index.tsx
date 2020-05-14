import React from 'react';

import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerContent
} from '@rmwc/drawer';

import {
  List,
  ListItem
} from '@rmwc/list';

import { ReactNodeArray } from 'prop-types';
import Icon from 'components/Icon';

import '@rmwc/drawer/styles';
import '@rmwc/list/styles';
import './styles.scss';

type CBKDrawerProps = {
  open?: boolean,
  children: ReactNodeArray,
}

function CBKDrawer(props: CBKDrawerProps) {
  return (
    <Drawer dismissible open={props.open} className='cbk-drawer'>
      <DrawerHeader>
        <Icon icon='logo' />
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