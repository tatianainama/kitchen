import React from 'react';
import TextField, { HelperText, Input as Field } from '@material/react-text-field';
import classNames from 'classnames';
import Icon from '../Icon';

import '@material/react-text-field/dist/text-field.css';
import './styles.scss';

type InputProps = {
	label: string,
	helperText?: string,
	value: string|number,
	onChange: (e: any) => void,
	textarea?: boolean,
	onKeyDown? : (e: any) => void,
	type?: 'text'|'number',
	style?: 'display'|'regular',
	icon?: string,
};

const Input = ({
	label,
	helperText,
	textarea,
	value,
	onChange,
	onKeyDown,
	type = 'text',
	style = 'regular',
	icon,
}: InputProps) => {
	const fieldClasses = classNames(
		'cbk-input',
		{
			'cbk-input--prefilled': value!=='',
			[`cbk-input-${style}`]: true,
			'mdc-text-field--no-label': style === 'display',
		}
	);

	return (
		<div className='cbk-input-container'>
			{
				icon && 
				<Icon
					icon={icon}
					width={46}
					fill='#9E9E9E'
				></Icon>
			}
			<TextField
				label={label}
				helperText={helperText ? (<HelperText>{helperText || ''}</HelperText>) : undefined}
				textarea={textarea}
				className={fieldClasses}
				fullWidth={style === 'display'}
			>
				<Field
					value={value}
					//@ts-ignore
					onChange={onChange}
					onKeyDown={onKeyDown}
					type={type}
					min={0}
					rows={1}
					placeholder={style === 'display' ? label : ''}
				/>
			</TextField>
		</div>
)};

export default Input;