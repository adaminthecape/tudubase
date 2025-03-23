import { DbFilterOperator } from "@/zencore/Filters";
import { FieldData, ItemTypes } from "@/zencore/ItemTypes";
import { Select, Option } from "@mui/joy";

export default function FilterOperatorInput({
	field,
	itemType,
	value,
	updateValue,
}: {
	field?: FieldData;
	itemType: ItemTypes;
	value: DbFilterOperator;
	updateValue: (newValue: DbFilterOperator) => void;
})
{
	// determine operators allowed for this field type
	const allowedOperators = [];

	// show a dropdown with the allowed operators

	return (
		<Select>
			<Option value="key1">Key 1</Option>
			<Option value="key2">Key 2</Option>
		</Select>
	);
}