import React, { InputHTMLAttributes, ChangeEvent } from 'react';
import {FieldProps} from 'formik';

import '@material/react-text-field/dist/text-field.css';
import './styles.scss';

export const Input2: React.FunctionComponent<InputHTMLAttributes<{}>> = (props) => (
	<div className='cbk-input-2'>
		<input
			{...props}
		/>
		<span></span>
	</div>
)

type InputProps = {
	[x: string]: any,
	label?: string,
	type?: 'text' | 'number' ,
	onChange?: (e: React.FormEvent<HTMLInputElement>) => void,
}
export const Input = ({label, type = 'text', ...props }: InputProps) => {
	return (
		<div className="cbk-light-input">
			{ label && (<label htmlFor={props.name}>{label}</label>)}
			<input
				className={props.value ? 'has-value': ''}
				type={type}
				{...props}
			/>
			<span></span>
		</div>
	)
}

type TextareaProps = {
	[x: string]: any,
	label?: string,
	type?: 'text' | 'number' ,
	onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void,
}

export const Textarea = ({label, type = 'text', ...props }: TextareaProps) => {
	return (
		<div className="cbk-light-input">
			{ label && (<label htmlFor={props.name}>{label}</label>)}
			<textarea
				className={props.value ? 'has-value': ''}
				{...props}
			/>
			<span></span>
		</div>
	)
}

export default Input;