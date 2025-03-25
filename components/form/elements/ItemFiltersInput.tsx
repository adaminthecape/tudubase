import { DbFilters } from "@/zencore/Filters";
import { GenericInputProps } from "./GenericInput";
import ItemFilterList from "../filters/ItemFilterList";
import { ItemTypes, Nullable } from "@/zencore/ItemTypes";
import { FormLabel, Stack, Typography } from "@mui/joy";

export default function ItemFiltersInput({
	itemType,
	field,
	value,
	updateValue,
	updateError,
	i18n: propsI18n,
}: GenericInputProps<DbFilters>)
{
	function update(newValue: Nullable<DbFilters>)
	{
		updateValue?.({ field, value: newValue });
	}

	return (
		<Stack spacing={0.5} sx={{ mt: 0.25, mb: 0.25 }}>
			<FormLabel>
				<Typography fontSize={12}>
					&nbsp;&nbsp;{propsI18n?.label || field.label || field.key}
				</Typography>
			</FormLabel>
			<ItemFilterList
				itemType={itemType ?? ItemTypes.Task}
				value={Array.isArray(value) ? value : []}
				setValue={update}
				dense={true}
			/>
		</Stack>
	);
}