import { FunctionComponent } from 'react';

export type IconProps = {
  size?: number,
  filled?: boolean,
  color?: 'primary' | 'secondary' | 'default'
}

export type IconComponent = FunctionComponent<IconProps>;
