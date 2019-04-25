import React from 'react';
import Svgs from 'svgs';
import ReactSVG from 'react-svg';

export type IconProps = {
  icon: string,
  className?: string,
  fill?: string,
  width?: number,
  height?: number,
}

export function Icon(props: IconProps) {
  const styles = {
    width: props.width || 64,
    height: props.height || 'auto',
    fill: props.fill,
  };

  return (
    <ReactSVG
      // @ts-ignore
      src={Svgs[props.icon]}
      className='cbk-icon'
      svgClassName={props.className}
      svgStyle={styles}
    />
  )
}

export default Icon;