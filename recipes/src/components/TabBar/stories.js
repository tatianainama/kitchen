import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TabBar from './index';

const tabs = [
  'for the chicken',
  'for the sauce',
  'for the rice',
  'for the extra steps',
]

storiesOf('TabBar', module)
  .add('eee', () => <TabBar tabs={tabs} onClickText={action('text-click')} onClickTab={action('tab-click')}/>)