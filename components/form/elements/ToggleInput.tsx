import { FieldData, Nullable } from "@/zencore/ItemTypes";
import { GenericInputProps, GenericChangeEvent } from "./GenericInput";
import { FormControl, FormLabel, Stack, Switch } from "@mui/joy";

export default function ToggleInput({
	field,
	value,
	updateValue,
	updateError,
	i18n,
}: GenericInputProps<boolean>)
{
	const i18nVars: GenericInputProps<any>['i18n'] = {
		...(i18n || {}),
		label: field.label || i18n?.label || field.key || 'Input',
	};

	function update(opts: {
		field: FieldData;
		value: Nullable<boolean>;
		event: GenericChangeEvent;
	}): void
	{
		const valToUse = Boolean(opts.event?.target?.checked);

		updateValue?.({ field: opts.field, value: valToUse });
		updateError?.({ field: opts.field, error: undefined });
	}

	return (
		<FormControl>
			<Stack direction="row" spacing={1} sx={{ mt: 0.5, mb: 0.5 }}>
				<Switch
					aria-label={i18nVars.label || field.key || 'Input'}
					checked={value}
					onChange={(event) => update({ field, value, event })}
				/>
				<FormLabel>{i18nVars.label || field.key || 'Input'}</FormLabel>
			</Stack>
		</FormControl>
	);
}
