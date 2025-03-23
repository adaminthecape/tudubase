'use client';

import { DbFilterGroup, DbFilterGroupType, DbFilters } from "@/zencore/Filters";
import { ItemTypes, Nullable } from "@/zencore/ItemTypes";
import ItemFilterList from "./ItemFilterList";
import { useState } from "react";
import { Button, Option, Select, Stack } from "@mui/joy";
import I18N from "@/components/ui/I18N";
import { getDefaultFilter, getDefaultGroupFilter } from "./utils";

export default function ItemFilterGroupItem({
	item,
	itemType,
	updateItem,
	removeItem,
}: {
	item: DbFilterGroup;
	itemType: ItemTypes;
	updateItem: (newItem: Nullable<DbFilterGroup>) => void;
	removeItem: () => void;
})
{
	const [group, setGroup] = useState(item.group);
	const [children, setChildren] = useState(item.children);

	function updateChildren(newValue: Nullable<DbFilters>)
	{
		setChildren(newValue ?? []);
		updateItem({
			group,
			children: (newValue ?? [])
		});
	}

	function updateGroupType(groupType: DbFilterGroupType)
	{
		console.log('updateGroupType:', groupType);
		setGroup(groupType);
		updateItem({
			group: groupType,
			children
		});
	}

	function addGroupFilter()
	{
		setChildren([...children, getDefaultGroupFilter()]);
	}

	function addSingleFilter()
	{
		setChildren([...children, getDefaultFilter()]);
	}

	return (
		<Stack direction="column" spacing={2} sx={{ padding: 2 }}>
			<Select
				value={group ?? DbFilterGroupType.and}
				onChange={(event, newValue) => updateGroupType(newValue as DbFilterGroupType)}
			>
				<Option value={DbFilterGroupType.and}>And</Option>
				<Option value={DbFilterGroupType.or}>Or</Option>
			</Select>
			<ItemFilterList
				itemType={itemType}
				value={children}
				setValue={updateChildren}
			/>
			<Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
				<Button size="sm" onClick={addGroupFilter}>
					<I18N sid="filters.group.addGroupFilter" />
				</Button>
				<Button size="sm" onClick={addSingleFilter}>
					<I18N sid="filters.single.addSingleFilter" />
				</Button>
			</Stack>
		</Stack>
	);
}