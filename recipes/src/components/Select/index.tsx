import React from 'react';
import Select, { Option } from '@material/react-select';

import '@material/react-select/dist/select.min.css';
import './styles.scss';

type CBKSelectProps = {
  label?: string,
  value?: string,
  options: {
    label: string,
    value: string,
    disabled?: boolean,
  }[],
  disabled?: boolean,
  onChange?: (x: any) => void
}
class CBKSelect extends React.Component<CBKSelectProps> {
  state = {
    value: this.props.value || ''
  }

  onChange = (index:number) => {
    this.setState({
      value: this.props.options[index].value
    })
    if (this.props.onChange) {
      this.props.onChange(this.props.options[index]);
    }
  }

  render() {
    return (
      <Select
        className='cbk-select'
        enhanced
        disabled={this.props.disabled}
        label={this.props.label}
        value={this.state.value}
        onEnhancedChange={this.onChange}
        options={this.props.options}
      >

      </Select>
    )
  }
}

export default CBKSelect