import { EquipmentRarity, rollForItem, rollForRarity } from "@/utils/chance";
import { EquipmentType } from "@/zencore/arch/EquipmentType";
import { ItemTypes } from "@/zencore/ItemTypes";
import { Box, Button, Typography } from "@mui/joy";
import { useEffect, useState } from "react";

export default function Reward()
{
	const [rarity, setRarity] = useState(EquipmentRarity.common);
	const [item, setItem] = useState<EquipmentType | undefined>();

	console.log('rarity:', rarity);

	function reroll()
	{
		setRarity(rollForRarity({}).rarity);

		console.log('new rarity:', rarity);
	}

	async function getItem()
	{
		const item = await rollForItem<EquipmentType>({
			itemType: ItemTypes.EquipmentType,
			rarity,
			filters: [],
		});

		console.log('item:', item);

		return item;
	}

	useEffect(() =>
	{
		getItem().then((item) =>
		{
			console.log({ item });
			setItem(item);
		});
	}, [rarity]);

	return (
		<div>
			<Box className="mt-2 mb-1" sx={{
				padding: 1,
				border: '1px solid #aaa',
				borderRadius: 10,
			}}>
				<Typography color="warning">{item.name}</Typography>
				<Typography color={{
					common: 'primary',
					rare: 'warning',
					epic: 'danger',
					legendary: 'danger',
					}[rarity]}>{rarity}</Typography>
			</Box>
			<Button className="mt-2" onClick={reroll}>Reroll</Button>
		</div>
	);
}