import React from 'react';
import Input from 'components/Input';
import Button from 'components/Button';
import { assocPath, remove } from 'ramda';
import classnames from 'classnames';

import './styles.scss';

type TabBarProps = {
  tabs: string[]
  onUpdateTab?: (key: string|number[], newValue: string) => void,
  onDeleteTab?: (deletedIndex: number) => void,
  onSelectTab?: (selectedIndex: number) => void,
  onAddTab?: () => void,
  activeIndex?: number,
}

type TabBarPropsII = {
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

const TabBar = ({tabs, onUpdateTab, onDeleteTab, onSelectTab, onAddTab, activeIndex}: TabBarPropsII) => (
  <div className='cbk-tab-bar' role="tablist">
    { tabs.map((tab, index) => (
      <div
        className={classnames({
          'cbk-tab': true,
          'cbk-tab--active': index === activeIndex
        })}
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

class CBKTabBar extends React.Component<TabBarProps, TabBarState> {
  constructor(props: TabBarProps) {
    super(props);
    this.state = {
      activeIndex: this.props.activeIndex || 0,
      tabs: props.tabs
    };
  }

  updateTabs = (key: string|number[]) => {
    return (e: any) => {
      const newValue = e.currentTarget.value;
      this.setState({
        tabs: assocPath(key, newValue, this.state.tabs)
      });
      if (this.props.onUpdateTab) {
        this.props.onUpdateTab(key, newValue);
      }
    }
  }

  deleteTab = (index: number) => {
    return (e: any) => {
      this.setState({
        tabs: remove(index, 1, this.state.tabs)
      })
    }
  }

  clickTab = (activeIndex: number) => (event: any) => {
    this.setState({
      activeIndex
    })
  } 

  addTab = (e: any) => {
    this.setState({
      tabs: this.state.tabs.concat([''])
    })
  }

  render () {
    const { tabs, activeIndex } = this.state;

    return (
      <div className='cbk-tab-bar' role="tablist">
        { tabs.map((tab, index) => (
          <div
            className={classnames({
              'cbk-tab': true,
              'cbk-tab--active': index === activeIndex
            })}
            onClick={this.clickTab(index)}>
            <div className='cbk-tab__content'> 
              <Input
                value={tab}
                label=''
                onChange={this.updateTabs([index])}
              />
            </div>
            <div className='cbk-tab__actions'>
              <Button icon='clear' onClick={this.deleteTab(index)}></Button>
            </div>
          </div>
        )) }
        <div className='cbk-tab cbk-tab-add'>
          <Button icon='add' onClick={this.addTab}></Button>
        </div>
      </div>
    )
  }
}

export {
  CBKTabBar,
  TabBar,
};

export default CBKTabBar;