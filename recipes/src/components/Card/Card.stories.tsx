import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import Card, { CBKCardProps as CardProps } from './index';

export default {
  title: 'Components/Card',
  components: Card,
} as Meta;

const Template: Story<CardProps> = args => <Card {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  title: 'Basic card',
  summary: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla repudiandae autem commodi. Eligendi perspiciatis voluptatum iusto laudantium ipsa perferendis. Harum adipisci exercitationem quod debitis ratione vitae maxime placeat ullam vel!',
  onClick: () => {},
  actions: [{
    label: 'action A',
    handler: () => {}
  }, {
    label: 'action B',
    handler: () => {}
  }],
  icons: [{
    icon: 'favorite',
    handler: () => {}
  }, {
    icon: 'star',
    handler: () => {}
  }],
  highlight: false
}