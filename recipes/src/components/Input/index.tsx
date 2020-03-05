import React, { InputHTMLAttributes, ChangeEvent, forwardRef } from 'react';
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
	error?: string,
}

export const Input = ({label, type = 'text', error, children, ...props }: InputProps) => {
	return (
		<div className={`cbk-light-input${error ? ' cbk-light-input--invalid' : ''}`}>
			{ label && (<label htmlFor={props.name}>{label}</label>)}
			<input
				className={props.value ? 'has-value': ''}
				type={type}
				{...props}
			/>
			<span></span>
			{ error && (
				<div className="cbk-light-input--invalid__error"> { error } </div>
			)}
		</div>
	)
}

export const ControlledInput = forwardRef<HTMLInputElement, InputProps>(({label, type = 'text', error, children, ...props }, ref) => {
	return (
		<div className={`cbk-light-input${error ? ' cbk-light-input--invalid' : ''}`}>
			{ label && (<label htmlFor={props.name}>{label}</label>)}
			<input
				ref={ref}
				className={props.value ? 'has-value': ''}
				type={type}
				{...props}
			/>
			<span></span>
			{ error && (
				<div className="cbk-light-input--invalid__error"> { error } </div>
			)}
		</div>
	)
})

type TextareaProps = {
	[x: string]: any,
	label?: string,
	rows?: number
	onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void,
	error?: string,
}

export const Textarea = ({label, type = 'text', rows = 3, error, children, ...props }: TextareaProps) => {
	return (
		<div className={`cbk-light-input${error ? ' cbk-light-input--invalid' : ''}`}>
			{ label && (<label htmlFor={props.name}>{label}</label>)}
			<textarea
				rows={rows}
				className={props.value ? 'has-value': ''}
				{...props}
			/>
			<span></span>
			{ error && (
				<div className="cbk-light-input--invalid__error"> { error } </div>
			)}
		</div>
	)
}

export default Input;