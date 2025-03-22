'use client';

import { FieldData, FieldType } from "@/zencore/ItemTypes";
import { Input, Stack, Typography } from "@mui/joy";
import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/form/elements/TextInput";
import NumberInput from "./elements/NumberInput";

function unknownField(field: FieldData): JSX.Element
{
	return (<Input disabled={true} value={`Unsupported: ${field.key} (${field.fieldType})`} size="sm" />);
}

function resolveField({
	field,
	formValues,
	updateFormValue,
	updateFormError,
}: {
	field: FieldData & { key: string; };
	formValues: Record<string, unknown>;
	updateFormValue: (key: string, value: unknown) => void;
	updateFormError: (key: string, message: string | undefined) => void;
}): JSX.Element
{
	switch(field.fieldType)
	{
		case FieldType.checkbox:
			return (unknownField(field));
		case FieldType.dropdown:
			return (unknownField(field));
		case FieldType.fieldType:
			return (unknownField(field));
		case FieldType.item:
			return (unknownField(field));
		case FieldType.itemArray:
			return (unknownField(field));
		case FieldType.itemFilters:
			return (unknownField(field));
		case FieldType.itemType:
			return (unknownField(field));
		case FieldType.multiSelect:
			return (unknownField(field));
		case FieldType.number:
			return (
				<NumberInput
					value={formValues[field.key] as number}
					updateValue={(value: unknown) => updateFormValue(field.key, value)}
					updateError={(error: string | undefined) => updateFormError(field.key, error)}
					field={field}
				/>
			);
		case FieldType.radio:
			return (unknownField(field));
		case FieldType.readonly:
			return (unknownField(field));
		case FieldType.repeater:
			return (unknownField(field));
		case FieldType.text:
			return (
				<TextInput
					value={formValues[field.key] as string}
					updateValue={(value: unknown) => updateFormValue(field.key, value)}
					updateError={(error: string | undefined) => updateFormError(field.key, error)}
					field={field}
				/>
			);
		case FieldType.textarea:
			return (
				<TextInput
					value={formValues[field.key] as string}
					updateValue={(value: unknown) => updateFormValue(field.key, value)}
					updateError={(error: string | undefined) => updateFormError(field.key, error)}
					field={field}
				/>
			);
		case FieldType.timestamp:
			return (unknownField(field));
		case FieldType.toggle:
			return (unknownField(field));
		default:
			return (unknownField(field));
	}
}

export function FormContainer({
	fields,
	values,
	updateValues,
	updateErrors,
}: {
	fields: (FieldData & { key: string; })[];
	values: Record<string, unknown>;
	updateValues: (values: Record<string, unknown>) => void;
	updateErrors: (errors: Record<string, string | undefined>) => void;
})
{
	const [formValues, setFormValues] = useState<Record<string, unknown>>({});
	const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

	function updateFormValue(key: string, value: unknown): void
	{
		const newValues = { ...formValues, [key]: value };

		setFormValues(newValues);

		if(updateValues)
		{
			updateValues(newValues);
		}
	}

	function updateFormError(key: string, message: string | undefined): void
	{
		const newValues = { ...formErrors, [key]: message };

		setFormErrors(newValues);

		if(updateErrors)
		{
			updateErrors(newValues);
		}
	}

	return (
		<div>
			<Stack spacing={1}>
				{fields.map((field, f) => (
					<div key={f}>{
						resolveField({
							field,
							formValues,
							updateFormValue,
							updateFormError,
						})
					}</div>
				))}
				<div className="flex flex-col gap-2 items-end">
					<Button type="submit">Submit</Button>
				</div>
			</Stack>
		</div>
	);
}