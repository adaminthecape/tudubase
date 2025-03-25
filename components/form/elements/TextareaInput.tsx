import { GenericInputProps, GenericInput } from "./GenericInput";

export default function TextareaInput({
	field,
	value,
	updateValue,
	updateError,
	i18n,
}: GenericInputProps<string | number>)
{
	const i18nVars: GenericInputProps<any>['i18n'] = {
		...(i18n || {}),
		label: field.label || i18n?.label || field.key || 'Input',
	};

	return (
		<GenericInput
			aria-label={i18n?.label || field.key || 'Input'}
			i18n={i18nVars}
			field={field}
			value={value}
			updateValue={updateValue}
			updateError={updateError}
		/>
	);
}
