import React, { useState } from 'react';

import './styles.scss';

type StrikeTextProps = {
};

const StrikeText: React.FunctionComponent<StrikeTextProps> = ({ children }) => {
  const [ strike, toggleStrike ] = useState(false);
  return (
    <span className={`cbk-strike-text ${strike ? 'cbk-strike-text--strike' : ''}`} onClick={() => toggleStrike(!strike)}>
      { children }
    </span>
  )
}

export default StrikeText;