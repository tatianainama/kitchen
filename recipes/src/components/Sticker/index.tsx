import React from 'react';

import './styles.scss';

const Sticker: React.FunctionComponent<{}> = (props) => (
  <div className='cbk-sticker'>
    {
      props.children
    }
  </div>
);

export default Sticker