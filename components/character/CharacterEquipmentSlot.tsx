import { EquipmentSlotType, EquipmentType } from "@/zencore/arch/EquipmentType";
import { Stack } from "@mui/joy";
import bg from './char_bg_c.png'
import { Item } from "@/zencore/ItemTypes";

/**
 * The Equipment Slot is essentially a small display square for the selected
 * equipment, and a popup search container for selecting new equipment.
 */

export type CharacterEquipmentSlotProps = {
	slotName: EquipmentSlotType;
	equipmentType: Item<EquipmentType>;
};

export function CharacterEquipmentSlot({
	slotName,
	equipmentType,
}:  CharacterEquipmentSlotProps)
{
	return (
		<Stack
			spacing={1}
			direction="row"
			width={64}
			height={64}
			sx={{
				borderColor: 'divider',
				color: 'black',
				cursor: 'pointer',
				backgroundImage: `url(${bg.src})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				alignContent: 'center',
				alignItems: 'center',
				height: 100,
				width: 80,
			}}
		>
			{equipmentType ? JSON.stringify(equipmentType) : undefined}
		</Stack>
	);
}
