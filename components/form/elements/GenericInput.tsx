'use client';

import Input from "@mui/joy/Input";
import { useInput } from '@mui/base/useInput';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useInitJoyTheme } from "@/hooks/useInitJoyTheme";
import { FormControl, FormHelperText, FormLabel, Textarea, Typography } from "@mui/joy";
import { FieldData, FieldType, ItemTypes, Nullable } from "@/zencore/ItemTypes";
import { ChangeEvent, forwardRef, HTMLInputTypeAttribute, useState } from "react";
import { FieldValidator } from "@/zencore/Validation";
import { Utils } from "@/zencore/Utils";

export type GenericChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
export type GenericInputProps<T = any> = {
	itemType?: ItemTypes;
	field: FieldData;
	value?: Nullable<T>;
	updateValue?: (opts: {
		field: FieldData;
		value: Nullable<T>;
		event?: GenericChangeEvent;
	}) => void;
	updateError?: (opts: {
		field: FieldData;
		error?: string | undefined;
		event?: GenericChangeEvent;
	}) => void;
	i18n?: {
		label: string;
		hint?: string;
		placeholder?: string;
		options?: Record<string, string>;
	}
};

export const GenericInput = forwardRef(function CustomInput<T = any>(
	props: React.InputHTMLAttributes<HTMLInputElement> & GenericInputProps<T>,
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

	const [inputVal, setInputVal] = useState<any>(props.value);
	const [isErrored, setIsErrored] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	function updateString(event: GenericChangeEvent): void
	{
		const val = event.target.value;
		const valToUse = (props.field.fieldType && [
			FieldType.number,
			FieldType.timestamp,
		].includes(props.field.fieldType)) ?
			Number(val) :
			val;

		setInputVal(valToUse);
		props.updateValue?.({
			field: props.field,
			value: valToUse ?? null,
			event
		});
	}

	function updateTimestamp(event: GenericChangeEvent)
	{
		const val = (event.target.valueAsNumber ?? 0) / 1000;
		const valToUse = val === 0 ? null : Utils.toNumber(val);

		if(!Number.isNaN(valToUse))
		{
			setInputVal(event.target.value);
			props.updateValue?.({
				field: props.field,
				value: valToUse ?? null,
				event
			});
		}
	}

	function update(event: GenericChangeEvent): void
	{
		if(props.field.fieldType === FieldType.number)
		{
			updateTimestamp(event);
		}
		else if(props.field.fieldType === FieldType.timestamp)
		{
			updateTimestamp(event);
		}
		else
		{
			updateString(event);
		}
	}

	function updateValidation(event: GenericChangeEvent): void
	{
		if(props.field.validation)
		{
			const validator = new FieldValidator({ fieldsArray: [props.field] });

			const { success, message } = validator.validateField({
				value: event.target.value,
				field: props.field,
			});

			setIsErrored(!success);
			setErrorMessage(message);
			props.updateError?.({
				field: props.field,
				error: success ? undefined : message,
				event
			});
		}
	}

	function handleChange(event: GenericChangeEvent)
	{
		update(event);
		updateValidation(event);
	}

	function getInputType(): HTMLInputTypeAttribute
	{
		switch(props.field.fieldType)
		{
			case FieldType.checkbox:
				return 'checkbox';
			case FieldType.number:
				return 'number';
			case FieldType.radio:
				return 'radio';
			case FieldType.text:
				return 'text';
			case FieldType.textarea:
				return 'textarea';
			case FieldType.timestamp:
				return 'datetime-local';
			case FieldType.toggle:
				return 'checkbox';
			case FieldType.readonly:
				return 'text';
			// case FieldType.image:
			// 	return 'image';
			case FieldType.item:
			case FieldType.itemArray:
			case FieldType.dropdown:
			case FieldType.fieldType:
			case FieldType.itemFilters:
			case FieldType.itemType:
			case FieldType.multiSelect:
			case FieldType.repeater:
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
				{props.field.fieldType === FieldType.textarea ? (
					<Textarea
						placeholder={props.i18n?.placeholder}
						variant="soft"
						value={inputVal ?? ''}
						error={isErrored}
						onChange={handleChange}
						minRows={4}
						color={isErrored ? 'danger' : (props.field.validation?.required ? 'primary' : 'neutral')}
					/>
				): (
					<Input
						placeholder={props.i18n?.placeholder}
						variant="soft"
						value={inputVal ?? ''}
						error={isErrored}
						onChange={handleChange}
						type={inputType}
						color={isErrored ? 'danger' : (props.field.validation?.required ? 'primary' : 'neutral')}
					/>
				)}
				{isErrored && (
					<FormHelperText>&nbsp;&nbsp;<Typography
						color="danger"
						fontSize={12}
					>{errorMessage}</Typography></FormHelperText>
				)}
				{props.i18n?.hint && (
					<FormHelperText>&nbsp;&nbsp;{props.i18n.hint}</FormHelperText>
				)}
			</FormControl>
		</div>
	);
});
