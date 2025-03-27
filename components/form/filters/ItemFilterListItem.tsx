import { DbFilter, DbFilterOperator } from "@/zencore/Filters";
import { FieldData, ItemTypes, Nullable } from "@/zencore/ItemTypes";
import { Button, Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import FilterKeyInput from "./FilterKeyInput";
import FilterOperatorInput from "./FilterOperatorInput";
import { getFieldsForItemType } from "@/apiUtils/fieldUtils";
import FilterValueInput from "./FilterValueInput";
import I18N from "@/components/ui/I18N";
import RemoveIcon from '@mui/icons-material/Remove';

export default function ItemFilterListItem({
	filter: item,
	itemType,
	updateItem,
	removeItem,
	dense,
}: {
	filter: DbFilter;
	itemType: ItemTypes;
	updateItem: (newItem: Nullable<DbFilter>) => void;
	removeItem: () => void;
	dense?: boolean;
})
{
	const [inputVal, setInputVal] = useState(item || {});

	function updateOperator(newValue: DbFilterOperator): void
	{
		updateItem({ ...item, operator: newValue });
	}

	const [filterKey, setFilterKey] = useState(item.key);
	const [filterOperator, setFilterOperator] = useState(item.operator);
	const [filterValue, setFilterValue] = useState(item.value);

	function update(newValue: Nullable<DbFilter>)
	{
		updateItem(newValue);
	}

	const [selectedField, setSelectedField] = useState<FieldData | undefined>();

	useEffect(() =>
	{
		// get the field based on the item type and the key
		getFieldsForItemType(itemType).then((fields) =>
		{
			const field = fields?.find((f) => f.key === filterKey);

			if(field)
			{
				setSelectedField(field);
			}
			else
			{
				setSelectedField(undefined);
			}
		});
	}, [filterKey]);

	return (
		<Stack spacing={1} direction={'row'}>
			{/* key input */}
			<FilterKeyInput
				value={filterKey}
				itemType={itemType}
				updateValue={(newValue) =>
				{
					setFilterKey(newValue);
					update({ key: newValue, operator: filterOperator, value: filterValue });
				}}
			/>
			{/* operator input */}
			<FilterOperatorInput
				value={filterOperator}
				field={selectedField}
				itemType={itemType}
				updateValue={(newValue) =>
				{
					setFilterOperator(newValue);
					update({ key: filterKey, operator: newValue, value: filterValue });
				}}
			/>
			{/* value input */}
			<FilterValueInput
				value={filterValue}
				field={selectedField}
				updateValue={(newValue) =>
				{
					setFilterValue(newValue);
					update({ key: filterKey, operator: filterOperator, value: newValue });
				}}
			/>
			<div className="flex-1" />
			{/* remove button */}
			<Button variant="soft" size="sm" onClick={removeItem}>
				{dense ? <RemoveIcon /> : <I18N sid="filters.single.removeSingleFilter" />}
			</Button>
		</Stack>
	);
}