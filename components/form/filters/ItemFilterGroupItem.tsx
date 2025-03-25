'use client';

import { DbFilterGroup, DbFilterGroupType, DbFilters } from "@/zencore/Filters";
import { ItemTypes, Nullable } from "@/zencore/ItemTypes";
import ItemFilterList from "./ItemFilterList";
import { useState } from "react";
import { Button, Option, Select, Stack, Typography } from "@mui/joy";
import I18N from "@/components/ui/I18N";
import RemoveIcon from '@mui/icons-material/Remove';

export default function ItemFilterGroupItem({
	group: item,
	itemType,
	updateItem,
	removeItem,
	dense,
}: {
	group: DbFilterGroup;
	itemType: ItemTypes;
	updateItem: (newItem: Nullable<DbFilterGroup>) => void;
	removeItem: () => void;
	dense?: boolean;
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
		setGroup(groupType);
		updateItem({
			group: groupType,
			children
		});
	}

	return (
		<Stack direction="column" spacing={0.5} sx={{ padding: 1 }}>
			<Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
				<Typography variant="h6">
					<I18N sid="filters.group.groupType" />
				</Typography>
				<Select
					value={group ?? DbFilterGroupType.and}
					onChange={(event, newValue) => updateGroupType(newValue as DbFilterGroupType)}
				>
					<Option value={DbFilterGroupType.and}>And</Option>
					<Option value={DbFilterGroupType.or}>Or</Option>
				</Select>
				<div style={{ flexGrow: 1 }} />
				{dense ?
					<Button variant="soft" onClick={removeItem}>
						<RemoveIcon />
						<I18N sid="filters.group.title" fontSize={12} />
					</Button> :
					<Button variant="soft" onClick={removeItem}>
						<I18N sid="filters.group.removeGroupFilter" />
					</Button>
				}
			</Stack>
			<ItemFilterList
				itemType={itemType}
				value={children}
				setValue={updateChildren}
				dense={dense}
			/>
		</Stack>
	);
}