import { DbFilter, DbFilterGroup, DbFilterGroupType, DbFilterOperator, DbFilters } from "@/zencore/Filters";
import { Nullable } from "@/zencore/ItemTypes";
import { Utils } from "@/zencore/Utils";
import ItemFilterGroupItem from "./ItemFilterGroupItem";
import ItemFilterListItem from "./ItemFilterListItem";
import { useState } from "react";
import { Button, Stack } from "@mui/joy";
import { getDefaultGroupFilter, getDefaultFilter } from "./utils";

export default function ItemFilterList({
	itemType,
	value,
	setValue,
}: {
	itemType: string;
	value: DbFilters;
	setValue: (value: Nullable<DbFilters>) => void;
})
{
	const [inputValue, setInputValue] = useState(value || []);

	function addGroupFilter()
	{
		setInputValue([...inputValue, getDefaultGroupFilter()]);
	}

	function addSingleFilter()
	{
		setInputValue([...inputValue, getDefaultFilter()]);
	}

	function removeItem(index: number)
	{
		const newValue = inputValue.filter((_, i) => i !== index);
		setInputValue(newValue);
		setValue(newValue);
	}

	function updateItem(index: number, newItem: Nullable<DbFilterGroup | DbFilter>)
	{
		const newValue = inputValue.map((item, i) => i === index ? newItem : item);
		setInputValue(newValue as DbFilters);
		setValue(newValue as DbFilters);
	}

	return (
		<Stack spacing={0.5} sx={{
			padding: 0.5,
			border: '1px solid #333',
			borderRadius: 6,
		}}>
			{/* If the list item is a group, show a GroupItem, else show a ListItem */}
			{inputValue.map((item, index) =>
			{
				if(Utils.isGroupFilter(item))
				{
					return (
						<ItemFilterGroupItem
							key={`group-${index}`}
							item={item}
							itemType={itemType}
							updateItem={(newItem) => updateItem(index, newItem)}
							removeItem={() => removeItem(index)}
						/>
					);
				}
				else if(Utils.isSingleFilter(item))
				{
					return (
						<ItemFilterListItem
							key={`single-${index}`}
							item={item}
							itemType={itemType}
							updateItem={(newItem) => updateItem(index, newItem)}
							removeItem={() => removeItem(index)}
						/>
					);
				}
				else
				{
					return (<div>Unknown</div>);
				}
			})}
			<Stack spacing={1} direction="row" sx={{ justifyContent: 'center' }}>
				<Button
					size="sm"
					onClick={addGroupFilter}
				>
					Add Group
				</Button>
				<Button
					size="sm"
					onClick={addSingleFilter}
				>
					Add Single Filter
				</Button>
			</Stack>
		</Stack>
	);
}