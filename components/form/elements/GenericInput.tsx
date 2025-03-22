'use client';

import Input from "@mui/joy/Input";
import { useInput } from '@mui/base/useInput';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useInitJoyTheme } from "@/hooks/useInitJoyTheme";
import { FormControl, FormHelperText, FormLabel, Typography } from "@mui/joy";
import { FieldData, FieldType } from "@/zencore/ItemTypes";
import { ChangeEvent, forwardRef, HTMLInputTypeAttribute, useState } from "react";
import { FieldValidator } from "@/zencore/Validation";

export type GenericInputProps<T> = {
	field: FieldData;
	value?: T;
	updateValue?: (value: T) => void;
	updateError?: (error: string | undefined) => void;
	i18n?: {
		label: string;
		hint?: string;
		placeholder?: string;
		options?: Record<string, string>;
	}
};

export const GenericInput = forwardRef(function CustomInput(
	props: React.InputHTMLAttributes<HTMLInputElement> & GenericInputProps<string | number>,
	ref: React.ForwardedRef<HTMLInputElement>,
)
{
	useInitJoyTheme();

	const {
		inputRef,
		error,
		required,
		disabled,
		focused,
		getInputProps,
		getRootProps,
		formControlContext,
		value,
	} = useInput();

	const inputProps = getInputProps();

	// Make sure that both the forwarded ref and the ref returned from the
	// getInputProps are applied on the input element
	inputProps.ref = useForkRef(inputProps.ref, ref);

	const [inputVal, setInputVal] = useState(props.value);
	const [isErrored, setIsErrored] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	function update(val: string): void
	{
		const valToUse = (props.field.fieldType && [
			FieldType.number,
			FieldType.timestamp,
		].includes(props.field.fieldType)) ?
			Number(val) :
			val;

		setInputVal(valToUse ?? null);
		props.updateValue?.(valToUse ?? null);
	}

	function handleChange(event: ChangeEvent<HTMLInputElement>)
	{
		update(event.target.value);

		// validate the field
		if(props.field.validation)
		{
			const validator = new FieldValidator({ fieldsArray: [props.field] });

			const { success, message } = validator.validateField({
				value: event.target.value,
				field: props.field,
			});

			setIsErrored(!success);
			setErrorMessage(message);
			props.updateError?.(message);
		}

	}

	function getInputType(): HTMLInputTypeAttribute
	{
		switch(props.field.fieldType)
		{
			case FieldType.number:
				return 'number';
			case FieldType.text:
				return 'text';
			case FieldType.textarea:
				return 'textarea';
			default:
				return 'text';
		}
	}

	const [inputType, setInputType] = useState(getInputType());

	return (
		<div {...getRootProps()}>
			<FormControl
				error={error}
				required={required}
				size="sm"
				disabled={disabled}
			>
				<FormLabel>&nbsp;&nbsp;{props.i18n?.label || props.field.key}</FormLabel>
				<Input
					placeholder={props.i18n?.placeholder}
					variant="soft"
					value={inputVal ?? ''}
					error={isErrored}
					onChange={handleChange}
					type={inputType}
				/>
				{isErrored && (
					<FormHelperText>&nbsp;&nbsp;<Typography color="danger" fontSize={12}>{errorMessage}</Typography></FormHelperText>
				)}
				{props.i18n?.hint && (
					<FormHelperText>&nbsp;&nbsp;{props.i18n.hint}</FormHelperText>
				)}
			</FormControl>
		</div>
	);
});
