import React, { ReactNode, ReactChildren, createElement } from 'react';
import ReactDOMServer from 'react-dom/server';
import Drawer, {
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
} from '@material/react-drawer';
import List, { ListItem } from '@material/react-list';
import { ReactComponent as Logo } from 'svgs/logo.svg';
import { ReactNodeArray } from 'prop-types';
import Icon from 'components/Icon';
import Svgs from 'svgs';
import ReactSVG from 'react-svg';

import '@material/react-drawer/dist/drawer.min.css';
import '@material/react-list/dist/list.min.css';

import './styles.scss';

type CBKDrawerProps = {
  children: ReactNodeArray,
}

function CBKDrawer(props: CBKDrawerProps) {
  return (
    <Drawer className='cbk-drawer'>
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