import { JSX } from "react";
import { DbFilters } from "@/zencore/Filters";
import { FieldData, ItemTypes, FieldType } from "@/zencore/ItemTypes";
import CheckboxInput from "./elements/CheckboxInput";
import DropdownInput from "./elements/DropdownInput";
import { GenericInputProps } from "./elements/GenericInput";
import ItemFiltersInput from "./elements/ItemFiltersInput";
import MultiSelectInput from "./elements/MultiSelectInput";
import NumberInput from "./elements/NumberInput";
import RadioInput from "./elements/RadioInput";
import TextInput from "./elements/TextInput";
import TimestampInput from "./elements/TimestampInput";
import ToggleInput from "./elements/ToggleInput";
import { Input } from "@mui/joy";

function unknownField(field: FieldData): JSX.Element
{
	return (<Input disabled={true} value={`Unsupported: ${field.key} (${field.fieldType})`} size="sm" />);
}

export default function resolveField({
	field,
	formValues,
	updateFormValue,
	updateFormError,
}: {
	itemType?: ItemTypes;
	field: FieldData & { key: string; };
	formValues: Record<string, unknown>;
	updateFormValue: (key: string, value: unknown) => void;
	updateFormError: (key: string, message: string | undefined) => void;
}): JSX.Element
{
	const updateValue: GenericInputProps['updateValue'] = (opts) =>
	{
		updateFormValue(opts.field.key, opts.value);
	}

	const updateError: GenericInputProps['updateError'] = (opts) =>
	{
		updateFormError(opts.field.key, opts.error);
	}

	switch(field.fieldType)
	{
		case FieldType.checkbox:
			return (
				<CheckboxInput
					value={formValues[field.key] as string}
					updateValue={updateValue}
					updateError={updateError}
					field={field}
				/>
			);
		case FieldType.dropdown:
			return (
				<DropdownInput
					value={formValues[field.key] as string}
					updateValue={updateValue}
					updateError={updateError}
					field={field}
				/>
			);
		case FieldType.fieldType:
			return (
				<DropdownInput
					value={formValues[field.key] as string}
					updateValue={updateValue}
					updateError={updateError}
					field={{ ...field, options: Object.values(FieldType) }}
				/>
			);
		case FieldType.item:
			return (unknownField(field));
		case FieldType.itemArray:
			return (unknownField(field));
		case FieldType.itemFilters:
			return (
				<ItemFiltersInput
					itemType={field.itemType as ItemTypes}
					value={Array.isArray(formValues[field.key]) ? formValues[field.key] as DbFilters : []}
					updateValue={updateValue}
					updateError={updateError}
					field={{ ...field, options: Object.values(FieldType) }}
				/>
			);
		case FieldType.itemType:
			return (
				<DropdownInput
					value={formValues[field.key] as string}
					updateValue={updateValue}
					updateError={updateError}
					field={{ ...field, options: Object.values(ItemTypes) }}
				/>
			);
		case FieldType.multiSelect:
			return (
				<MultiSelectInput
					value={Array.isArray(formValues[field.key]) ? formValues[field.key] as string[] : []}
					updateValue={updateValue}
					updateError={updateError}
					field={field}
				/>
			);
		case FieldType.number:
			return (
				<NumberInput
					value={formValues[field.key] as number}
					updateValue={updateValue}
					updateError={updateError}
					field={field}
				/>
			);
		case FieldType.radio:
			return (
				<RadioInput
					value={formValues[field.key] as number}
					updateValue={updateValue}
					updateError={updateError}
					field={field}
				/>
			);
		case FieldType.repeater:
			return (unknownField(field));
		case FieldType.readonly:
		case FieldType.text:
		case FieldType.textarea:
			return (
				<TextInput
					value={formValues[field.key] as string}
					updateValue={updateValue}
					updateError={updateError}
					field={field}
				/>
			);
		case FieldType.timestamp:
			return (
				<TimestampInput
					value={formValues[field.key] as number}
					updateValue={updateValue}
					updateError={updateError}
					field={field}
				/>
			);
		case FieldType.toggle:
			return (
				<ToggleInput
					value={formValues[field.key] as boolean}
					updateValue={updateValue}
					updateError={updateError}
					field={field}
				/>
			);
		default:
			return (unknownField(field));
	}
}
