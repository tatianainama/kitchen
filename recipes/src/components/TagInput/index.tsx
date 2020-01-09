
import React, { Component } from 'react';
import { ChipSet, Chip } from '@material/react-chips';
import MaterialIcon from '@material/react-material-icon';
import Input, {LightInputNotFormk} from 'components/Input';
import { uniq } from 'ramda';

import './styles.scss';

interface Tag {
  label?: string,
  id?: string
};

type TagInputProps = {
  onNewTag: (tags: string[]) => void,
  initialValues?: string[],
  label?: string,
}

type TagInputState = {
  tags: string[],
  newTag: string,
}

class TagInput extends Component<TagInputProps, TagInputState> {
  
  constructor(props: TagInputProps) {
    super(props);
    this.state = {
      tags: props.initialValues || [],
      newTag: '',
    }
  }
  
  mkTagId = (tag: string) => tag.replace(/\s/g,'');

  updateTags = (newTags: string[]) => {
    this.setState({
      tags: newTags,
      newTag: ''
    });
    this.props.onNewTag(newTags);
  }

  handleKeyDown = (e: any) => {
    const label = e.target.value;
    if (!!label && e.key === 'Enter') {
      this.updateTags(uniq([...this.state.tags, label]));
    }
  }

  render() {
    return (
      <div className="cbk-tag-input">
        <LightInputNotFormk
          label={this.props.label}
          value={this.state.newTag}
          onChange={(e: any) => this.setState({newTag: e.currentTarget.value})}
          onKeyDown={this.handleKeyDown}
        />
        <ChipSet
          input
          updateChips={(chips) => this.updateTags(chips.map(chip => chip.label || ''))}
        >
          {this.state.tags.map((tag) => {
            const id = this.mkTagId(tag);
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
    );
  }
}

export default TagInput;