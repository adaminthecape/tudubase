import { EquipmentType } from "@/zencore/arch/EquipmentType";
import { Stack } from "@mui/joy";

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
