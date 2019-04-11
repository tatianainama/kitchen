import React, { FunctionComponent, ReactElement, SVGProps } from 'react';

export type IconProps = {
  children: any, // ReactElement throws error wtf
  className?: string|undefined,
  height?: number,
  width?: number,
  color?: string,
}

function Icon({ color, children, width, height, className }: IconProps) {
  return (
    <div className='cbk-icon'>
      {
        React.cloneElement(children, {
          viewBox: '0 0 100 100',
          className,
          fill: color,
          width,
          height,
        })
      }
    </div>
  )
}

export default Icon;