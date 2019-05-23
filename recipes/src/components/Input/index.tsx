import React from 'react';
import TextField, { HelperText, Input as Field } from '@material/react-text-field';
import classNames from 'classnames';
import Button from 'components/Button';
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
	button?: {
		icon: string,
		onClick: () => void,
	}
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
	button
}: InputProps) => {
	const fieldClasses = classNames(
		'cbk-input',
		{
			'cbk-input--prefilled': value!=='',
			[`cbk-input-${style}`]: true,
			'mdc-text-field--no-label': style === 'display',
		}
	);
	const containerClasses = classNames({
		'cbk-input-container': !!icon || !!button,
	})

	return (
		<div className={containerClasses}>
			{
				icon && 
				<Icon
					icon={icon}
					width={46}
					fill='#9E9E9E'
				/>
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
			{
				button && 
				<Button className='cbk-input-button' onClick={button.onClick} icon={button.icon} />
			}
		</div>
)};

export default Input;