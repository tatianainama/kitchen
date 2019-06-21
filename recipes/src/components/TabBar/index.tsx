import React from 'react';
import Tab from '@material/react-tab';
import TabBar from '@material/react-tab-bar';
import TabIndicator from '@material/react-tab-indicator';
import Input from 'components/Input';
import Button from 'components/Button';
import { assocPath, remove } from 'ramda';
import classnames from 'classnames';

import '@material/react-list/dist/list.min.css';
import '@material/react-tab-bar/dist/tab-bar.css';
import '@material/react-tab-scroller/dist/tab-scroller.css';
import '@material/react-tab/dist/tab.css';
import '@material/react-tab-indicator/dist/tab-indicator.css';

import './styles.scss';

type TabBarProps = {
  tabs: string[]
  onUpdateTab?: (newValue: string) => void,
  onDeleteTab?: (deletedIndex: number) => void,
  onClickText?: (e: any) => void,
  onClickTab?: (e: any) => void,
}

type TabBarState = {
  activeIndex: number,
  tabs: string[],
}

class CBKTabBar extends React.Component<TabBarProps, TabBarState> {
  constructor(props: TabBarProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      tabs: props.tabs
    };
  }

  handleActiveIndexUpdate = (activeIndex:number) => this.setState({activeIndex});

  updateTabs = (key: string|number[]) => {
    return (e: any) => {
      const newValue = e.currentTarget.value;
      this.setState({
        tabs: assocPath(key, newValue, this.state.tabs)
      });
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
    const { onClickText, onClickTab } = this.props;
    const { tabs, activeIndex } = this.state;

    return (
      <div>
        {/* <TabBar
          activeIndex={this.state.activeIndex}
          handleActiveIndexUpdate={this.handleActiveIndexUpdate}
        >
          { tabs.map((tab, index) => (
              <Tab key={index}>
                {tab}
              </Tab>
            ))
          }
        </TabBar> */}
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
              <TabIndicator active={index === activeIndex}/>
            </div>
          )) }
          <div className='cbk-tab cbk-tab-add'>
            <Button icon='add' onClick={this.addTab}></Button>
          </div>
        </div>
      </div>
    )
  }
}

export default CBKTabBar;