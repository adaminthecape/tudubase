'use client';

import { Stack } from "@mui/joy";
import { useInitJoyTheme } from "@/hooks/useInitJoyTheme";
import { CharacterEquipment } from "@/components/character/CharacterEquipment";
import { CharacterInventory } from "@/components/character/CharacterInventory";
import { CharacterStats } from "@/components/character/CharacterStats";
import { CharacterView } from "@/components/character/CharacterView";

/**
 * Main Character Page
 *
 * This page displays the character information and equipment.
 * This includes stats, inventory, and other character-specific information.
 */
export default function QuestPage()
{
	useInitJoyTheme();

	return (
		<Stack spacing={0.5} direction={'column'}>
			<CharacterView>
				<CharacterStats />
				<CharacterInventory />
				<CharacterEquipment />
			</CharacterView>
		</Stack>
	);
}
