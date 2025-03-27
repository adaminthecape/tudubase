import { searchItems } from "@/cache/actions/Generic";
import { ItemTypes } from "@/zencore/ItemTypes";

export function rollForRarity(opts: {
	chanceMultipliers?: {
		common?: number;
		rare?: number;
		epic?: number;
		legendary?: number;
	};
	itemIdsToUse?: string[];
	itemTypesToUse?: ItemTypes[];
}): ({
	roll: number;
	rarity: 'common' | 'rare' | 'epic' | 'legendary';
})
{
	// first roll for a rare
	const baseChances = {
		common: 0.8,
		rare: 0.15,
		epic: 0.04,
		legendary: 0.01,
	};

	const chances = {
		common: baseChances.common * (opts.chanceMultipliers?.common ?? 1),
		rare: baseChances.rare * (opts.chanceMultipliers?.rare ?? 1),
		epic: baseChances.epic * (opts.chanceMultipliers?.epic ?? 1),
		legendary: baseChances.legendary * (opts.chanceMultipliers?.legendary ?? 1),
	};

	const roll = Math.random();

	if(roll < chances.legendary)
	{
		return { roll, rarity: 'legendary' };
	}
	else if(roll < chances.epic)
	{
		return { roll, rarity: 'epic' };
	}
	else if(roll < chances.rare)
	{
		return { roll, rarity: 'rare' };
	}

	return { roll, rarity: 'common' };
}

export function rollForItem(opts: {
	itemType: ItemTypes;
}): Promise<string>
{
	return new Promise((resolve) =>
	{
		// get all items of the given types
		searchItems({
			itemType: opts.itemType,
			filters: [
				{
					key: 'rarity',
					operator: '==',
					value: 'common',
				}
			],
			pagination: { page: 1, pageSize: 1 }
		}).then(({ success, data }) =>
		{
			if(!success)
			{
				resolve('');
				return;
			}

			const items = data?.results ?? [];
			const item = items[Math.floor(Math.random() * items.length)];

			resolve(item.id);
		});
	});
}