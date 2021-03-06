import React, { ReactElement } from 'react';
import Icon from 'components/Icon';
import { IconButton } from '@rmwc/icon-button';

import classnames from 'classnames';

import '@rmwc/icon-button/styles';

import './styles.scss';

export type CBKButtonProps = {
  children?: string|ReactElement,
  className?: string,
  unelevated?: boolean,
  raised?: boolean,
  outlined?: boolean,
  icon?: string,
  link?: boolean,
  custom?:boolean,
  active?: boolean,
  onClick?: (e: any) => void,
  small?: boolean,
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean
  style?: any;
}

export default function CBKButton(props: CBKButtonProps) {
  const btnClassNames = classnames({
    'cbk-btn': true,
    'cbk-btn--raised': props.raised,
    'cbk-btn--unelevated': props.unelevated,
    'cbk-btn--outlined': props.outlined,
    'cbk-btn--disabled': props.disabled,
    'cbk-btn--small': props.small,
    'cbk-btn--link': props.link,
    'cbk-btn--active active': props.active,
  })

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if(props.onClick) {
      props.onClick(event);
    }
  }

  if (props.icon) {
    let icon = props.custom ? <Icon material={false} icon={props.icon} /> : props.icon;
    return (
      <IconButton
        icon={icon}
        onClick={onClick}
        className={classnames({
          'btn-small': props.small,
          'cbk-icon--active': props.active
        }, props.className)}
        disabled={props.disabled}
        style={props.style}
        ripple
      />
    );
  } else {
    return (
      <button
        disabled={props.disabled}
        className={btnClassNames}
        onClick={props.onClick}
        style={props.style}
        type={props.type || 'button'}
      >
        { props.children }
      </button>
    )
  }
};