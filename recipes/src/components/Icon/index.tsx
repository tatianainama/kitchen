import React from 'react';
import Svgs from 'svgs';
import ReactSVG from 'react-svg';
import MaterialIcon from '@material/react-material-icon';

import '@material/react-material-icon/dist/material-icon.css';

export type IconProps = {
  icon: string,
  className?: string,
  fill?: string,
  width?: number,
  height?: number,
  material?: boolean,
}

export function Icon({ width, height, fill, icon, className, material }: IconProps) {
  const styles = {
    width: width || 64,
    height: height || 'auto',
    fill: fill,
  };

  return material ? (
    <MaterialIcon icon={icon} className='material-icons-outlined' />
  ) : (
    <ReactSVG
      // @ts-ignore
      src={Svgs[icon]}
      className='cbk-icon'
      svgClassName={className}
      svgStyle={styles}
    />
  )
}

export default Icon;