import React from 'react';
import Input from 'components/Input';
import Button from 'components/Button';
import { assocPath, remove } from 'ramda';
import classnames from 'classnames';

import './styles.scss';

type TabBarProps = {
  tabs: string[]
  onUpdateTab: (index: number, newValue: string) => void,
  onDeleteTab: (deletedIndex: number) => void,
  onSelectTab: (selectedIndex: number) => void,
  onAddTab: () => void,
  activeIndex?: number,
}

type TabBarState = {
  activeIndex: number,
  tabs: string[],
}

const TabBar = ({tabs, onUpdateTab, onDeleteTab, onSelectTab, onAddTab, activeIndex}: TabBarProps) => (
  <div className='cbk-tab-bar' role="tablist">
    { tabs.map((tab, index) => (
      <div
        className={classnames({
          'cbk-tab': true,
          'cbk-tab--active': index === activeIndex
        })}
        key={index}
        onClick={(e: any) => onSelectTab(index)}>
        <div className='cbk-tab__content'> 
          <Input
            value={tab}
            label=''
            onChange={({ currentTarget }) => onUpdateTab(index, currentTarget.value)}
          />
        </div>
        <div className='cbk-tab__actions'>
          <Button icon='clear' onClick={(e: any) => onDeleteTab(index)}></Button>
        </div>
      </div>
    )) }
    <div className='cbk-tab cbk-tab-add'>
      <Button icon='add' onClick={(e: any) => onAddTab()}></Button>
    </div>
  </div>
);

export default TabBar;