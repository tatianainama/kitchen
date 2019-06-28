import React from 'react';
import { Suggestion } from 'types/recipes';
import Icon from 'components/Icon';
import Button from 'components/Button';

import './styles.scss';

type SuggestionsProps = {
  suggestions?: Suggestion[],
  onSelect: (index: number) => void,
  onNew: () => void,
}

const Suggestions = ({ suggestions, onSelect, onNew }: SuggestionsProps) => {
  return suggestions && suggestions.length > 1 ? (
    <div className='cbk-suggestions'>
      <Icon material icon={'wb_incandescent'} />
      {
        suggestions.map((suggestion, index) => (
          <Button onClick={() => onSelect(index)} key={index}>{suggestion.name}</Button>
        ))
      }
      <Button onClick={() => onNew()}>Add new</Button>
    </div>
  ) : null
};

export default Suggestions;