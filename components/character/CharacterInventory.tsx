import { Stack } from "@mui/joy";
import { InventoryItemsList } from "./InventoryItemsList";

export type CharacterInventoryProps = {
};

export function CharacterInventory(props: CharacterInventoryProps)
{
	return (
		<Stack spacing={1} direction="row">
			<InventoryItemsList items={[]} />
		</Stack>
	);
}
