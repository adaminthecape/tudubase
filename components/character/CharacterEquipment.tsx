import { Stack } from "@mui/joy";
import { CharacterEquipmentSlot } from "./CharacterEquipmentSlot";
import bg from './char_bg_a.png'
import { SxProps } from "@mui/material";

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
				<CharacterEquipmentSlot equipmentType="Helmet" />
			</Stack>
			<Stack spacing={2} direction="row">
				<CharacterEquipmentSlot equipmentType="MainHand" />
				<CharacterEquipmentSlot equipmentType="Armor" />
				<CharacterEquipmentSlot equipmentType="OffHand" />
			</Stack>
			<Stack spacing={6} direction="row">
				<CharacterEquipmentSlot equipmentType="Gloves" />
				<CharacterEquipmentSlot equipmentType="Belt" />
				<CharacterEquipmentSlot equipmentType="Boots" />
			</Stack>
			<Stack spacing={4} direction="row">
				<CharacterEquipmentSlot equipmentType="Necklace" />
				<CharacterEquipmentSlot equipmentType="Cloak" />
				<CharacterEquipmentSlot equipmentType="Ring" />
			</Stack>
		</Stack>
	);
}
