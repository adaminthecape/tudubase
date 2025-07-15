'use client';

import { Stack } from "@mui/joy";
import { useInitJoyTheme } from "@/hooks/useInitJoyTheme";
import { CharacterEquipment } from "@/components/character/CharacterEquipment";
import { CharacterInventory } from "@/components/character/CharacterInventory";
import { CharacterStats } from "@/components/character/CharacterStats";
import { SxProps } from "@mui/material";
import { cache, createItem, searchItems, updateItem } from "@/cache/actions/Generic";
import { Item, ItemTypes } from "@/zencore/ItemTypes";
import { useEffect, useState } from "react";
import { Character } from "@/zencore/arch/Character";
import { Utils, Uuid } from "@/zencore/Utils";
import GameModal from "@/components/game/GameModal";

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

	const [character, setCharacter] = useState<Item<Character> | undefined>();
	const [cacheLastUpdated, setCacheLastUpdated] = useState<number>(0);

	useEffect(() =>
	{
		if(
			character?.id &&
			Utils.isPopulatedObject(
				cache?.cacheByType?.[ItemTypes.Character]?.[character?.id || '']
			)
		)
		{
			setCharacter(cache.cacheByType[ItemTypes.Character][character.id] as Item<Character>);
			console.log('char updated:', JSON.stringify(character, null, 4));
		}
	}, [
		cache?.cacheByType?.[ItemTypes.Character]?.[character?.id || '']
	]);

	// get the character stats from the db
	async function getCharacterDetails()
	{
		console.log('getCharacterDetails');
		// for now, one character per user, so let's just search for them all
		const { success, data } = await searchItems({
			ignoreCache: true,
			itemType: ItemTypes.Character,
			pagination: { page: 1, pageSize: 1 }
		});

		console.log({ success, data });
		const character = data?.results?.[0];

		console.log('character:', character);

		setCharacter(character as Item<Character> | undefined);
	}

	useEffect(() =>
	{
		getCharacterDetails();
	}, []);

	async function createCharacter()
	{
		const character: Character = {
			name: 'My Character',
			health: 100,
			mana: 100,
			strength: 10,
			agility: 10,
			intelligence: 10,
			armor: undefined,
			mainHand: undefined,
			offHand: undefined,
			mainArmor: undefined,
			helmet: undefined,
			gloves: undefined,
			boots: undefined,
			necklace: undefined,
			ring: undefined,
			belt: undefined,
			cloak: undefined,
		};
		const characterItem: Item<Character> = {
			...character,
			id: Uuid.generateUuid(),
			typeId: ItemTypes.Character,
			createdAt: Utils.getCurrentSecond(),
			updatedAt: Utils.getCurrentSecond(),
			// createdBy: Utils.getCurrentSecond(),
		};

		const { success, data } = await createItem({
			id: characterItem.id,
			itemType: ItemTypes.Character,
			data: characterItem,
		});

		console.log('created char:', { success, data });
	}

	async function changeStatValue(
		statType: keyof Character,
		valueOffset: number
	)
	{
		if(!character)
		{
			return;
		}

		const updatedCharacter = {
			...character,
			[statType]: parseInt(`${character[statType] ?? 0}`, 10) + valueOffset,
		};

		const { success, data } = await updateItem({
			id: character.id,
			itemType: ItemTypes.Character,
			data: updatedCharacter,
		});

		console.log('updated char:', { success, data });
		await getCharacterDetails();

			const charFromCache = await cache.select({
				itemId: character.id,
				itemType: ItemTypes.Character,
			});

			console.log('charFromCache:', charFromCache);
			setCacheLastUpdated(Utils.getCurrentSecond());
	}

	function renderStats(char: Item<Character> | undefined, cacheKey: number)
	{
		if(!char)
		{
			return <div>Nothing here</div>;
		}

		return (
			<CharacterStats character={char} key={cacheKey} />
		);
	}

	return (
		<Stack
			spacing={0.5}
			direction="column"
		>
			{/* <GameModal
				activator={<div>Open Game Modal</div>}
			/> */}
			{renderStats(character, cacheLastUpdated)}
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
		</Stack>
	);
}
