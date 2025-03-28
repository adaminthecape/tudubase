import { EquipmentSlotType, EquipmentType, fieldsForEquipmentType } from "@/zencore/arch/EquipmentType";
import { Stack } from "@mui/joy";
import bg from './char_bg_c.png'
import { FieldData, FieldType, Item, ItemTypes } from "@/zencore/ItemTypes";
import ItemSearchInputModal from "../search/ItemSearchInputModal";
import { GenericInput } from "../form/elements/GenericInput";
import { useState } from "react";
import { DbFilterOperator, DbFilters } from "@/zencore/Filters";

/**
 * The Equipment Slot is essentially a small display square for the selected
 * equipment, and a popup search container for selecting new equipment.
 */

export type CharacterEquipmentSlotProps = {
	slotName: EquipmentSlotType;
	equipmentType?: Item<EquipmentType>;
};

export function CharacterEquipmentSlot({
	slotName,
	equipmentType,
}:  CharacterEquipmentSlotProps)
{
	const [searchFilter, setSearchFilter] = useState<string>('');

	if(!slotName)
	{
		return <div>No slot yet...</div>;
	}

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
			<ItemSearchInputModal
				itemType={ItemTypes.EquipmentType}
				activator={
					<div
						style={{
							border: '1px solid red',
							width: '60px',
							height: '60px',
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							borderRadius: '10px',
							color: 'white',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{slotName}
					</div>
				}
				label={<div>Search for {slotName}</div>}
				renderResults={(results) => (
					<Stack
						direction="row"
						spacing={1}
						sx={{
							flexWrap: 'nowrap',
						}}
					>
						{results.map((item) => (
							<div
								key={`equipment-result-${item.id}`}
								style={{
									height: '100px',
									width: '18%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									border: '1px solid #aaa',
									borderRadius: '10px',
								}}
							>
								<div>{`${item.name}`}</div>
								<div>{`${item.slots}`}</div>
							</div>
						))}
					</Stack>
				)}
				hideFilters={true}
				initialFilters={[
					{
						key: 'slots',
						operator: DbFilterOperator.in,
						value: [slotName],
					}
				]}
				renderFilters={(filters, updateFilters, search) => (
					<GenericInput
						field={{
							...fieldsForEquipmentType.find((f) => f.key === 'name'),
							validation: null,
						} as FieldData}
						value={searchFilter}
						updateValue={({ field, value, event }) =>
						{
							const filtersToUpdate: DbFilters = [
								{
									key: field.key,
									operator: DbFilterOperator.fuzzyEqual,
									value,
								}
							];

							setSearchFilter(value as string);
							updateFilters({ field, value: filtersToUpdate, event });
							search();
						}}
						updateError={() => {}}
					/>
				)}
			/>
		</Stack>
	);
}
