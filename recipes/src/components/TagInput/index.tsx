
import React, { Component, useState, FunctionComponent } from 'react';
import { ChipSet, Chip } from '@material/react-chips';
import MaterialIcon from '@material/react-material-icon';
import { Input } from 'components/Input';
import { uniq } from 'ramda';

import './styles.scss';

type TagInputProps = {
  onNewTag: (tags: string[]) => void,
  tags: string[],
  label?: string,
}

export const TagInput:FunctionComponent<TagInputProps> = ({ label, onNewTag, tags }) => {
  const [tag, setTag] = useState('');
  
  const mkTagId = (tag: string) => tag.replace(/\s/g,'');

  const updateTags = (newTags: string[]) => {
    setTag('');
    onNewTag(newTags);
  }

  const handleKeyDown = (e: any) => {
    const label = e.target.value;
    if (!!label && e.key === 'Enter') {
      updateTags(uniq([...tags, label]));
    }
  }

  return (
    <div className="cbk-tag-input">
      <Input
        label={label}
        value={tag}
        onChange={e => setTag(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
      <ChipSet
        input
        updateChips={(chips) => updateTags(chips.map(chip => chip.label || ''))}
      >
        {tags && tags.map((tag) => {
          const id = mkTagId(tag);
          return (
            <Chip
              id={id}
              key={id}
              label={tag}
              trailingIcon={<MaterialIcon icon='cancel' />}
            />
          )
        }
        )}
      </ChipSet>
    </div>
  ) 
}

export default TagInput;