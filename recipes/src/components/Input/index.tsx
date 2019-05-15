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
};

const Input = (props: InputProps) => (
	<TextField
		label={props.label}
		helperText={props.helperText ? (<HelperText>{props.helperText || ''}</HelperText>) : undefined}
		textarea={props.textarea}
	>
		<Field
			value={props.value}
			//@ts-ignore
			onChange={props.onChange}
			onKeyDown={props.onKeyDown}
		/>
	</TextField>
);

export default Input;