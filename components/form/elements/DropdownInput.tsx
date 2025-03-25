import { FieldData, Nullable } from "@/zencore/ItemTypes";
import { GenericInputProps } from "./GenericInput";
import { FormControl, FormLabel, Option, Select, Stack } from "@mui/joy";
import { ChangeEvent, useState } from "react";
import I18N from "@/components/ui/I18N";

export default function DropdownInput({
	field,
	value,
	updateValue,
	updateError,
	i18n: propsI18n,
}: GenericInputProps<string>)
{
	interface SelectOption
	{
		label: string;
		value: string;
	}

	function getOptionsI18n(
		options: unknown
	): Record<string, SelectOption> | undefined
	{
		if(!(Array.isArray(options) && options.length))
		{
			return undefined;
		}

		return options.reduce((agg: Record<string, SelectOption>, key) =>
		{
			agg[key] = ({
				label: propsI18n?.options?.[key] || 1 || key,
				value: key,
			});
			return agg;
		}, {});
	}

	const i18nVars = {
		...(propsI18n || {}),
		label: field.label || propsI18n?.label || field.key || 'Input',
		options: getOptionsI18n(field.options),
	};

	const [selectedOption, setSelectedOption] = useState(value || '');

	function update(opts: {
		field: FieldData;
		value: Nullable<string>;
		event: ChangeEvent<HTMLSelectElement>;
	}): void
	{
		const valToUse = opts.value;

		updateValue?.({ field: opts.field, value: valToUse });
		updateError?.({ field: opts.field, error: undefined });
		setSelectedOption(valToUse || '');
	}

	return (
		<FormControl
			size="sm"
		>
			<Stack direction="column" spacing={0} sx={{ mt: 0.25, mb: 0.25 }}>
				<FormLabel>&nbsp;&nbsp;{i18nVars.label || field.key || 'Input'}</FormLabel>
				<Select
					variant="soft"
					renderValue={() => (
						<I18N sid={`fieldOptions.${field.id}.${selectedOption}`} />
					)}
					defaultValue={value}
					onChange={(event, newValue) => update({ field, value: newValue, event })}
					aria-label={i18nVars.label || field.key || 'Input'}
				>
					{field.options?.map((option, index) => (
						<Option
							key={`option-${field.id}-${index}`}
							value={option}
						>
							<I18N sid={`fieldOptions.${field.id}.${option}`} />
						</Option>
					))}
				</Select>
			</Stack>
		</FormControl>
	);
}
