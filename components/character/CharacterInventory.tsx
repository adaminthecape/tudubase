import { Item, ItemTypes } from "@/zencore/ItemTypes";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/material";
import ItemSearchContainer from "../search/ItemSearchContainer";
import { createItem } from "@/cache/actions/Generic";
import { EquipmentType, EquipmentSlotType } from "@/zencore/arch/EquipmentType";
import { Utils, Uuid } from "@/zencore/Utils";
import itemNames from '@/itemNames.json';

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
			{/* <button onClick={generateEquipment}>Generate equipment</button> */}
			<ItemSearchContainer
				itemType={ItemTypes.EquipmentType}
				renderResults={(results) => (
					<Stack
						direction="row"
						spacing={1}
						sx={{
							flexWrap: 'nowrap',
							maxHeight: '500px',
							overflowY: 'auto',
							overflowX: 'hidden'
						}}
					>
						{results.map((item) => (
							<Stack
								key={`equipment-result-${item.id}`}
								sx={{
									height: '200px',
									width: '18%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
									alignContent: 'center',
									alignItems: 'center',
									border: '1px solid #aaa',
									borderRadius: '10px',
									padding: 1,
								}}
							>
								<div>{`${item.name}`}</div>
								<Stack direction={'column'} spacing={-0.5}>
									<div>STR: {`${item.strengthModifier}`}</div>
									<div>AGI: {`${item.agilityModifier}`}</div>
									<div>INT: {`${item.intelligenceModifier}`}</div>
								</Stack>
								<div>{`${item.slots}`}</div>
							</Stack>
						))}
					</Stack>
				)}
			/>
		</Stack>
	);
}

function randomModifier(
	min?: number,
	max?: number,
): number
{
	min = min ?? 0;
	max = max ?? 20;

	return Math.floor(Math.random() * (max - min) + min);
}

function randomEquipment(): EquipmentType
{
	const slots = Object.values(EquipmentSlotType);

	const baseData: EquipmentType = {
		// name: `Test Equipment ${Math.floor(Math.random() * 1000)}`,
		name: itemNames[Math.floor(Math.random() * itemNames.length)],
		description: undefined,
		icon: undefined,
		slots: [slots[Math.floor(Math.random() * slots.length)]],
		healthModifier: randomModifier(0, 2),
		manaModifier: randomModifier(-1, 2),
		strengthModifier: randomModifier(5, 10),
		agilityModifier: randomModifier(5, 10),
		intelligenceModifier: randomModifier(5, 10),
	};

	return baseData;
}

async function generateEquipment(): Promise<Item<EquipmentType> | undefined>
{
	const baseData = randomEquipment();

	const id = Uuid.generateUuid();

	const { success, data } = await createItem({
		id,
		itemType: ItemTypes.EquipmentType,
		data: baseData,
	});

	console.log('createItem:', success, data);

	return data;
}