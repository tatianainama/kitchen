import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { IconButton, IconButtonProps } from '@rmwc/icon-button';

export default {
  title: 'RMWC/IconButton',
  components: IconButton
} as Meta;

const Template: Story<IconButtonProps> = args => <IconButton {...args}/>

export const Basic = Template.bind({});
Basic.args = {
  icon: 'star'
}