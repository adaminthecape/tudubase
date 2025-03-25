import { Stack } from "@mui/joy";
import { CharacterEquipmentSlot } from "./CharacterEquipmentSlot";

export type CharacterEquipmentProps = {
};

export function CharacterEquipment(props: CharacterEquipmentProps)
{
	return (
		<Stack spacing={1} direction="row">
			<Stack spacing={0} direction="row">
				<CharacterEquipmentSlot equipmentType="Helmet" />
			</Stack>
			<Stack spacing={1} direction="row">
				<CharacterEquipmentSlot equipmentType="MainHand" />
				<CharacterEquipmentSlot equipmentType="MainArmor" />
				<CharacterEquipmentSlot equipmentType="OffHand" />
			</Stack>
			<Stack spacing={1} direction="row">
				<CharacterEquipmentSlot equipmentType="Gloves" />
				<CharacterEquipmentSlot equipmentType="Belt" />
				<CharacterEquipmentSlot equipmentType="Boots" />
			</Stack>
			<Stack spacing={1} direction="row">
				<CharacterEquipmentSlot equipmentType="Necklace" />
				<CharacterEquipmentSlot equipmentType="Cloak" />
				<CharacterEquipmentSlot equipmentType="Ring" />
			</Stack>
		</Stack>
	);
}
