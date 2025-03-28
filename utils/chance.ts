import { searchItems } from "@/cache/actions/Generic";
import { DbFilterHandler, DbFilters } from "@/zencore/Filters";
import { Item, ItemTypes } from "@/zencore/ItemTypes";

export enum EquipmentRarity {
	common = 'common',
	rare = 'rare',
	epic = 'epic',
	legendary = 'legendary',
};

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
	rarity: EquipmentRarity;
})
{
	// first roll for a rare
	const baseChances = {
		common: 0.45,
		rare: 0.3,
		epic: 0.2,
		legendary: 0.05,
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
		return { roll, rarity: EquipmentRarity.legendary };
	}
	else if(roll < chances.epic)
	{
		return { roll, rarity: EquipmentRarity.epic };
	}
	else if(roll < chances.rare)
	{
		return { roll, rarity: EquipmentRarity.rare };
	}

	return { roll, rarity: EquipmentRarity.common };
}

export async function rollForItem<T = any>(opts: {
	itemType: ItemTypes;
	rarity: EquipmentRarity;
	filters?: DbFilters;
}): Promise<Item<T> | undefined>
{
	// get all items of the given types
	const { success, data } = await searchItems({
		itemType: opts.itemType,
		filters: [
			// DbFilterHandler.create('rarity', '==', opts.rarity),
			...(opts.filters || [])
		],
		pagination: { page: 1, pageSize: 100 }
	});

	if(!success)
	{
		return undefined;
	}

	const items = data?.results ?? [];
	const item = items[Math.floor(Math.random() * items.length)];

	return item as Item<T>;
}