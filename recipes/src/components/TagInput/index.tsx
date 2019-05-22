
import React, { Component } from 'react';
import { ChipSet, Chip } from '@material/react-chips';
import MaterialIcon from '@material/react-material-icon';
import Input from 'components/Input';

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
  tags: Tag[],
  newTag: string,
}

class TagInput extends Component<TagInputProps, TagInputState> {
  
  constructor(props: TagInputProps) {
    super(props);
    const tags = props.initialValues ? props.initialValues.map(this.mkTag) : [];
    this.state = {
      tags: tags,
      newTag: '',
    }
  }
  
  mkTag = (tagLike: string): Tag => ({
    label: tagLike,
    id: tagLike.replace(/\s/g,''),
  })

  updateTags = (newTags: Tag[]) => {
    this.setState({
      tags: newTags,
      newTag: '',
    });
    this.props.onNewTag(newTags.map(t => t.label||''))
  }

  handleKeyDown = (e: any) => {
    const label = e.target.value;
    if (!!label && e.key === 'Enter') {
      this.updateTags(this.state.tags.concat([this.mkTag(label)]))
    }
  }

  render() {
    return (
      <div className="cbk-tag-input">
        <Input
          value={this.state.newTag}
          label={this.props.label || 'Tags'}
          onChange={(e) => this.setState({newTag: e.currentTarget.value})}
          onKeyDown={this.handleKeyDown}
          icon='waiter'
        />
        <ChipSet
          input
          updateChips={this.updateTags}
        >
          {this.state.tags.map((tag: any) =>
            <Chip
              id={tag.id}
              key={tag.id}
              label={tag.label}
              trailingIcon={<MaterialIcon icon='cancel' />}
            />
          )}
        </ChipSet>
      </div>
    );
  }
}

export default TagInput;