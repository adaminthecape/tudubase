import { Stack } from "@mui/joy";

export type InventoryItemsListProps = {
};

export function InventoryItemsList(props: InventoryItemsListProps)
{
	return (
		<Stack spacing={1} direction="row">
			<Stack spacing={1} direction="row">
				<div>Item 1</div>
				<div>Item 2</div>
			</Stack>
		</Stack>
	);
}
