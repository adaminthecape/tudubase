import { ItemTypes } from "@/zencore/ItemTypes";
import { Select, Option } from "@mui/joy";

export default function FilterKeyInput({
	itemType,
	value,
	updateValue,
}: {
	/** Determines which keys can be selected */
	itemType: ItemTypes;
	value: string;
	updateValue: (newValue: string) => void;
})
{
	return (
		<Select>
			<Option value="key1">Key 1</Option>
			<Option value="key2">Key 2</Option>
		</Select>
	);
}