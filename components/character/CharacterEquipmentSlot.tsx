import { EquipmentType } from "@/zencore/arch/EquipmentType";
import { Stack } from "@mui/joy";

/**
 * The Equipment Slot is essentially a small display square for the selected
 * equipment, and a popup search container for selecting new equipment.
 */

export type CharacterEquipmentSlotProps = {
	equipmentType: EquipmentType;
};

export function CharacterEquipmentSlot({
	equipmentType,
}:  CharacterEquipmentSlotProps)
{
	return (
		<Stack spacing={1} direction="row">
			{equipmentType}
		</Stack>
	);
}
