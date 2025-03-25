/**
 * Main Character Page
 *
 * This page displays the character information and equipment.
 * This includes stats, inventory, and other character-specific information.
 */

import { Character } from "@/zencore/arch/Character";
import { EquipmentType } from "@/zencore/arch/EquipmentType";
import { Stack } from "@mui/joy";

export function CharacterView({
	children,
}: {
	children: React.ReactNode;
})
{
	return (
		<Stack spacing={1} direction="row">
			{children}
		</Stack>
	);
}

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

export type CharacterStatProps = {
	statType: 'health' | 'mana' | 'strength' | 'agility' | 'intelligence';
};

export function CharacterStat(props: CharacterStatProps)
{
	return (
		<Stack spacing={1} direction="row">'
			asdf
		</Stack>
	);
}

export type CharacterStatsProps = {
};

export function CharacterStats(props: CharacterStatsProps)
{
	return (
		<Stack spacing={1} direction="row">
			<CharacterStat statType="health" />
			<CharacterStat statType="mana" />
			<CharacterStat statType="agility" />
			<CharacterStat statType="strength" />
			<CharacterStat statType="intelligence" />
		</Stack>
	);
}

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

export default function CharacterPage()
{
	return (
		<div className="w-full">
			<CharacterView>
				<CharacterEquipment />
				<CharacterInventory />
				<CharacterStats />
			</CharacterView>
		</div>
	);
}
