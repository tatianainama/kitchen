import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import Button, { CBKButtonProps as ButttonProps } from './index';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  decorators: [
    story => <div>{story()}</div>
  ]
} as Meta;

const Template: (label: string) => Story<ButttonProps> = label => (args) => <Button {...args}>{label}</Button>;

export const Raised = Template('raised').bind({});
Raised.args = {
  raised: true,
};

export const Unelevated = Template('unelevated').bind({});
Unelevated.args = {
  unelevated: true,
};

export const Outlined = Template('outlined').bind({});
Outlined.args = {
  outlined: true,
};

export const Link = Template('link').bind({});
Link.args = {
  link: true,
  active: false,
};

export const IconButton = Template('').bind({});
IconButton.args = {
  icon: 'favorite',
  onClick: () => {},
  small: true
};
