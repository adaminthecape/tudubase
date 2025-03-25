import { FieldData } from "@/zencore/ItemTypes";
import TextInput from "../elements/TextInput";

export default function FilterValueInput({
	field,
	value,
	updateValue,
}: {
	field?: FieldData;
	value: unknown;
	updateValue: (newValue: unknown) => void;
})
{
	if(!field)
	{
		return (<div>No field</div>);
	}

	return (
		<TextInput
			key={field.id}
			field={field}
			value={value}
			updateValue={({ field, value, event }) =>
			{
				updateValue(value);
			}}
			updateError={() => {}}
		/>
	);
}