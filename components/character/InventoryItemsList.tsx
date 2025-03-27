import { Stack } from "@mui/joy";
import ItemSearchContainer from "../search/ItemSearchContainer";
import { ItemTypes } from "@/zencore/ItemTypes";
import { CharacterEquipmentSlot } from "./CharacterEquipmentSlot";

export type InventoryItemsListProps = {
};

export function InventoryItemsList(props: InventoryItemsListProps)
{
	return (
		<Stack
			spacing={1}
			direction="column"
			sx={{
				width: '100%',
				flexGrow: 1,
			}}
		>
			<ItemSearchContainer
				itemType={ItemTypes.Task}
				renderResult={(result) => (<div>{JSON.stringify(result)}</div>)}
			/>
		</Stack>
	);
}
