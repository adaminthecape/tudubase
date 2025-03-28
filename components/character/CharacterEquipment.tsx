import { Stack } from "@mui/joy";
import { CharacterEquipmentSlot } from "./CharacterEquipmentSlot";
import bg from './char_bg_a.png'
import { SxProps } from "@mui/material";
import { EquipmentSlotType } from "@/zencore/arch/EquipmentType";

export type CharacterEquipmentProps = {
	sx?: SxProps;
};

export function CharacterEquipment(props: CharacterEquipmentProps)
{
	const width = {
		xs: '100vw',
		sm: '100vw',
		md: '50vw',
		lg: '50vw',
	};

	return (
		<Stack
			direction="column"
			spacing={1}
			padding={16}
			sx={{
				backgroundImage: `url(${bg.src})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: '100%',
				width: width,
				maxWidth: { xs: 'calc(100dvw - 4rem)', sm: 'calc(100dvw - 4rem)', md: '525px', lg: '525px' },
				height: `calc(${width} * 1.25)`,
				flexWrap: 'wrap',
				justifyContent: 'center',
				alignContent: 'center',
				alignItems: 'center',
				...props.sx,
			}}
		>
			<Stack spacing={1} direction="row">
				<CharacterEquipmentSlot slotName={EquipmentSlotType.Helmet} />
			</Stack>
			<Stack spacing={2} direction="row">
				<CharacterEquipmentSlot slotName={EquipmentSlotType.MainHand} />
				<CharacterEquipmentSlot slotName={EquipmentSlotType.Armor} />
				<CharacterEquipmentSlot slotName={EquipmentSlotType.OffHand} />
			</Stack>
			<Stack spacing={6} direction="row">
				<CharacterEquipmentSlot slotName={EquipmentSlotType.Gloves} />
				<CharacterEquipmentSlot slotName={EquipmentSlotType.Belt} />
				<CharacterEquipmentSlot slotName={EquipmentSlotType.Boots} />
			</Stack>
			<Stack spacing={4} direction="row">
				<CharacterEquipmentSlot slotName={EquipmentSlotType.Necklace} />
				<CharacterEquipmentSlot slotName={EquipmentSlotType.Cloak} />
				<CharacterEquipmentSlot slotName={EquipmentSlotType.Ring} />
			</Stack>
		</Stack>
	);
}
