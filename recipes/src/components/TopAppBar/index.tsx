import React from 'react';
import {
  TopAppBar, TopAppBarRow, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarTitle,

} from '@rmwc/top-app-bar';
import { Icon } from 'components/Icon';
import { NavLink } from 'react-router-dom';

import './styles.scss';
type CBKTopAppBarProp = {
  routes: {
    path: string,
    title: string,
  }[]
}
const CBKTopAppBar: React.FunctionComponent<CBKTopAppBarProp> = ({ routes }) => {

  return (
    <TopAppBar fixed className="cbk-app-bar">
      <TopAppBarRow>
        <TopAppBarSection alignStart>
          <TopAppBarNavigationIcon
            icon={<Icon icon='logo' fill="white" />}
          />
        </TopAppBarSection>
        <TopAppBarSection alignEnd>
          {
            routes.map((route, key) => (
              <TopAppBarTitle key={key}>
                <NavLink
                  to={route.path}
                  activeClassName="cbk-path-route--active"
                  className="cbk-path-route"
                >
                  { route.title }
                </NavLink>
              </TopAppBarTitle>
            ))
          }
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  )
}

export default CBKTopAppBar;