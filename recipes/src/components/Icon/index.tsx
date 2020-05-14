import React from 'react';
import Svgs from 'svgs';
import ReactSVG from 'react-svg';
import { Icon as MaterialIcon } from '@rmwc/icon';

import '@rmwc/icon/styles';

export type IconProps = {
  icon: string,
  className?: string,
  fill?: string,
  width?: 'auto' | number,
  height?: number,
  material?: boolean,
}

export function Icon({ width, height, fill, icon, className, material }: IconProps) {
  const styles = {
    width: width,
    height: height,
    fill: fill,
  };

  const i = material ? icon : (<ReactSVG
    // @ts-ignore
    src={Svgs[icon]}
    className='cbk-icon'
    svgClassName={className}
    svgStyle={styles}
  />);

  return (
    <MaterialIcon
    icon={i}
    className={`material-icons-outlined`}
  />
  )
  // return material ? (
  //   <MaterialIcon icon={icon} className='material-icons-outlined' />
  // ) : (
  //   <ReactSVG
  //     // @ts-ignore
  //     src={Svgs[icon]}
  //     className='cbk-icon'
  //     svgClassName={className}
  //     svgStyle={styles}
  //   />
  // )
}

export default Icon;