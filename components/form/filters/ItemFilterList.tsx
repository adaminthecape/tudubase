import { DbFilter, DbFilterGroup, DbFilters } from "@/zencore/Filters";
import { ItemTypes, Nullable } from "@/zencore/ItemTypes";
import { Utils } from "@/zencore/Utils";
import ItemFilterGroupItem from "./ItemFilterGroupItem";
import ItemFilterListItem from "./ItemFilterListItem";
import { useState } from "react";
import { Button, Stack } from "@mui/joy";
import { getDefaultGroupFilter, getDefaultFilter } from "./utils";
import I18N from "@/components/ui/I18N";
import AddIcon from '@mui/icons-material/Add';

export default function ItemFilterList({
	itemType,
	value,
	setValue,
	dense,
}: {
	itemType: ItemTypes;
	value: DbFilters;
	setValue: (value: Nullable<DbFilters>) => void;
	dense?: boolean;
})
{
	const isDense = dense ?? true;
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
							group={item}
							itemType={itemType}
							updateItem={(newItem) => updateItem(index, newItem)}
							removeItem={() => removeItem(index)}
							dense={isDense}
						/>
					);
				}
				else
				{
					return (
						<ItemFilterListItem
							key={`single-${index}`}
							filter={item}
							itemType={itemType}
							updateItem={(newItem) => updateItem(index, newItem)}
							removeItem={() => removeItem(index)}
							dense={isDense}
						/>
					);
				}
				// else
				// {
				// 	return (<div>Unknown</div>);
				// }
			})}
			<Stack spacing={1} direction="row" sx={{ justifyContent: 'center' }}>
				{dense ?
					<Button
						variant="soft"
						size="sm"
						onClick={addGroupFilter}
					>
						<AddIcon />
						<I18N sid="filters.group.title" fontSize={12} />
					</Button> :
					<Button
						variant="soft"
						size="sm"
						onClick={addGroupFilter}
					>
						<I18N sid="filters.group.addGroupFilter" />
					</Button>
				}
				{dense ?
					<Button
						variant="soft"
						size="sm"
						onClick={addSingleFilter}
					>
						<AddIcon />
						<I18N sid="filters.single.title" fontSize={12} />
					</Button> :
					<Button
						variant="soft"
						size="sm"
						onClick={addSingleFilter}
					>
						<I18N sid="filters.single.addSingleFilter" />
					</Button>
				}
			</Stack>
		</Stack>
	);
}