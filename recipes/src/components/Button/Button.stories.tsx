import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import Button, { CBKButtonProps as ButttonProps } from './index';

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [
    story => <div>{story()}</div>
  ]
} as Meta;

const Template: Story<ButttonProps> = (args) => <Button {...args}>{args.children}</Button>;

export const Raised = Template.bind({});
Raised.args = {
  raised: true,
  children: 'raised'
};

export const Unelevated = Template.bind({});
Unelevated.args = {
  unelevated: true,
  children: 'unelevated'
};

export const Outlined = Template.bind({});
Outlined.args = {
  outlined: true,
  children: 'outlined'
};

export const Link = Template.bind({});
Link.args = {
  link: true,
  active: false,
  children: 'link'
};

export const ButtonWithIcon = Template.bind({});
ButtonWithIcon.args = {
  icon: 'favorite',
  active: true
};

export const ButtonWithCustomIcon = Template.bind({});
ButtonWithCustomIcon.args = {
  custom: true,
  icon: 'carrots'
}
