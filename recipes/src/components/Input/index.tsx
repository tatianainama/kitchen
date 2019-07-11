import React from 'react';
import TextField, { HelperText, Input as Field } from '@material/react-text-field';
import classNames from 'classnames';
import Button from 'components/Button';
import Icon from '../Icon';
import {FieldProps} from 'Formik';
import '@material/react-text-field/dist/text-field.css';
import './styles.scss';

type InputProps = {
	label: string,
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
	},
	field?: any,
};

const Input = ({
	label,
	textarea,
	value,
	onChange,
	onKeyDown,
	type = 'text',
	style = 'regular',
	icon,
	button,
	field = { name: '', value: '', onBlur: ()=>{}, onChange: ()=>{}}
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
			<div className="cbk-input-box">
				<TextField
					label={field.name || label}
					textarea={textarea}
					className={fieldClasses}
					fullWidth={style === 'display'}
				>
					<Field
						value={field.value}
						onBlur={field.onBlur}
						//@ts-ignore
						onChange={field.onChange}
						type={type}
						min={0}
						rows={1}
						placeholder={style === 'display' ? label : ''}
						name={field.name}
					/>
				</TextField>
			</div>
			{
				button && 
				<Button className='cbk-input-button' onClick={button.onClick} icon={button.icon} />
			}
		</div>
)};

interface LightInputProps extends FieldProps {
	label?: string,
	type?: 'textarea' | 'text' | 'number',
};

export const LightInput = (label?: string, type = 'text') => ({ field }: FieldProps) => {
	const Tag = type === 'textarea' ? 'textarea' : 'input';

	return (
		<div className="cbk-light-input">
			{ label && (<label>{label}</label>)}
			<Tag
				className={field.value ? 'has-value': ''}
				type={type}
				onChange={field.onChange}
				name={field.name}
				onBlur={field.onBlur} 
			/>
			{/* {
				type === 'text' ?
				(<input className={field.value ? 'has-value': ''} type="text" onChange={field.onChange} name={field.name} onBlur={field.onBlur} />) :
				(<textarea className={field.value ? 'has-value': ''} onChange={field.onChange} name={field.name} onBlur={field.onBlur} />)
			} */}
			
			<span></span>
		</div>
	);
};

export default Input;