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
  onChange: (x: any) => void
}
class CBKSelect extends React.Component<CBKSelectProps> {
  state = {
    value: this.props.value || ''
  }

  onChange = (index:number) => this.props.onChange(this.props.options[index])

  render() {
    return (
      <Select
        className='cbk-select'
        enhanced
        disabled={this.props.disabled}
        label={this.props.label}
        value={this.props.value}
        onEnhancedChange={this.onChange}
        options={this.props.options}
      >

      </Select>
    )
  }
}

export const CBKSelect2: React.FunctionComponent<CBKSelectProps> = (props) => (
  <select defaultValue={props.value || ''} className='cbk-select-2' onChange={props.onChange} placeholder={props.label}>
    <option value='' disabled> {props.label} </option>
    { 
      props.options.map(option => (
        <option key={option.value} disabled={option.disabled} value={option.value}> {option.label} </option>
      ))
    }
  </select>
)

export default CBKSelect