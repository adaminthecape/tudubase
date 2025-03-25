import { getFieldsForItemType } from "@/apiUtils/fieldUtils";
import { FieldData, ItemTypes } from "@/zencore/ItemTypes";
import { Select, Option } from "@mui/joy";
import { useEffect, useState } from "react";

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
	const [
		fieldsForItemType,
		setFieldsForItemType
	] = useState<FieldData[] | undefined>(undefined);
	const [
		fieldKeysForItemType,
		setFieldKeysForItemType
	] = useState<string[] | undefined>(undefined);
	const [
		selectedField,
		setSelectedField
	] = useState<FieldData | undefined>(undefined);

	// get fields for this item type
	useEffect(() =>
	{
		getFieldsForItemType(itemType).then((fields) =>
		{
			setFieldsForItemType(fields);
			setFieldKeysForItemType(fields?.map((f) => f.key));

			if(value)
			{
				const field = fields?.find((f) => f.key === value);

				setSelectedField(field);

				// if the value is not in the fields, set it to the first field
				if(field?.key)
				{
					updateValue(field?.key ?? '');
				}
			}
		});
	}, [itemType]);

	return (
		<Select value={value} onChange={(e, newValue) => updateValue(newValue)}>
			{fieldKeysForItemType?.map((key) => (
				<Option key={key} value={key}>{key}</Option>
			))}
		</Select>
	);
}