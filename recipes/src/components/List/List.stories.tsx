import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import List, { ListProps } from './index';
import { ListOnActionEventT } from '@rmwc/list';

const items = new Array(10).fill({}).map((_, i) => ({
  text: `list item ${i}`,
  secondaryText: `this is a secondary text for list item ${i}`
}));

export default {
  title: 'Components/List',
  component: List,
  argTypes: { onAction: {action: 'clicked'} },
  args: {
    items,
    dense: false,
    nonInteractive: false,
    onAction: (e: ListOnActionEventT) => console.log(`clicked: ${e.detail.index}`)
  }
} as Meta;

const Template: Story<ListProps> = (args) => <List {...args}/>

export const BasicList = Template.bind({});

export const SingleLine = Template.bind({});
SingleLine.args = {
  items: items.map(i => ({text: i.text}))
}

export const DisabledAndSelectedItems = Template.bind({});
DisabledAndSelectedItems.args = {
  items: [
    {
      ...items[0],
      selected: true,
      text: 'This item is selected'
    },
    {
      ...items[1],
      disabled: true,
      text: 'This item is disabled'
    },
    ...items.slice(2)
  ]
}

export const WithMetaIconsAndGraphic = Template.bind({});
WithMetaIconsAndGraphic.args = {
  items: items.map(item => ({
    ...item,
    graphic: 'star_border',
    metaIcon: 'info'
  }))
}


