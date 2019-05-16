import React from 'react';
import TextField, { HelperText, Input as Field } from '@material/react-text-field';

import '@material/react-text-field/dist/text-field.css';
import './styles.scss';

type InputProps = {
	label: string,
	helperText?: string,
	value: string|number,
	onChange: (e: any) => void,
	textarea?: boolean,
	onKeyDown? : (e: any) => void,
	type?: "text"|"number"
};

const Input = ({label, helperText, textarea, value, onChange, onKeyDown, type = "text"}: InputProps) => (
	<TextField
		label={label}
		helperText={helperText ? (<HelperText>{helperText || ''}</HelperText>) : undefined}
		textarea={textarea}
	>
		<Field
			value={value}
			//@ts-ignore
			onChange={onChange}
			onKeyDown={onKeyDown}
			type={type}
			min={0}
		/>
	</TextField>
);

export default Input;