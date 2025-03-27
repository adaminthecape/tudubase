import { Item, ItemTypes } from "@/zencore/ItemTypes";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/material";
import ItemSearchContainer from "../search/ItemSearchContainer";
import { createItem } from "@/cache/actions/Generic";
import { EquipmentType, EquipmentSlotType } from "@/zencore/arch/EquipmentType";
import { Uuid } from "@/zencore/Utils";

export type CharacterInventoryProps = {
	sx?: SxProps;
};

export function CharacterInventory(props: CharacterInventoryProps)
{
	return (
		<Stack
			spacing={1}
			direction="column"
			sx={{
				width: '100%',
				flexGrow: 1,
				...props.sx,
			}}
		>
			<ItemSearchContainer
				itemType={ItemTypes.EquipmentType}
				renderResults={(results) => (
					<Stack spacing={1} sx={{ 
						maxHeight: '500px',
						overflowY: 'auto',
						overflowX: 'hidden'
					}}>
						{results.map((item) => (
							<div key={item.id}>{JSON.stringify(item)}</div>
						))}
					</Stack>
				)}
			/>
		</Stack>
	);
}
