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
};

const Input = (props: InputProps) => (
	<TextField
		label={props.label}
		helperText={<HelperText>{props.helperText || ''}</HelperText>}
		style={{ width: '100%' }}
		textarea={props.textarea}
	>
		<Field
			value={props.value}
			//@ts-ignore
			onChange={props.onChange}
		/>
	</TextField>
);

export default Input;