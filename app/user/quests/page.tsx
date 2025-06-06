'use client';

import { Stack } from "@mui/joy";
import { useInitJoyTheme } from "@/hooks/useInitJoyTheme";
import { CharacterEquipment } from "@/components/character/CharacterEquipment";
import { CharacterInventory } from "@/components/character/CharacterInventory";
import { CharacterStats } from "@/components/character/CharacterStats";
import { CharacterView } from "@/components/character/CharacterView";
import { SxProps } from "@mui/material";

/**
 * Main Character Page
 *
 * This page displays the character information and equipment.
 * This includes stats, inventory, and other character-specific information.
 */
export default function QuestPage()
{
	useInitJoyTheme();

	const sxStackProps: SxProps = {
		maxHeight: '800px',
	};

	return (
		<Stack
			spacing={0.5}
			direction="column"
		>
			<CharacterView>
				<CharacterStats />
				<Stack
					direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
					spacing={4}
					padding={2}
				>
					<CharacterEquipment sx={sxStackProps} />
					<CharacterInventory sx={{
						maxHeight: '600px',
					}} />
				</Stack>
			</CharacterView>
		</Stack>
	);
}
