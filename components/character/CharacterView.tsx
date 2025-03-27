import { loadItem, searchItems } from "@/api/actions/Generic";
import { getFieldsForItemTypeSync } from "@/apiUtils/fieldUtils";
import { DbFilter, DbFilterHandler, DbFilters } from "@/zencore/Filters";
import { ItemTypes } from "@/zencore/ItemTypes";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/material";
import { useEffect } from "react";

export function CharacterView({
	children,
	sx,
}: {
	children: React.ReactNode;
	sx?: SxProps;
})
{
	// get the character stats from the db
	function getCharacterDetails()
	{
		console.log('getCharacterDetails');
		// for now, one character per user, so let's just search for them all
		searchItems({
			itemType: ItemTypes.Character,
			pagination: { page: 1, pageSize: 1 }
		}).then(({ success, data }) =>
		{
			console.log({ success, data });
			const character = data?.results?.[0];

			console.log('character:', character);
		});
	}

	useEffect(getCharacterDetails, []);

	return (
		<Stack
			spacing={1}
			direction="column"
			sx={sx}
		>
			{children}
		</Stack>
	);
}
