'use client';

import { loadItem } from '@/api/actions/Generic';
import { CollectionHandler } from '@/zencore/arch/Collection';
import { ItemTypes } from '@/zencore/ItemTypes';
import { RamDatabase } from '@/zencore/MemoryDatabase';
import { Uuid } from '@/zencore/Utils';
import { LRUCache } from 'lru-cache';

type FetchMethod<T = Record<string, unknown>> = (
	key: string,
	staleValue: unknown,
	opts: {
		options: unknown;
		signal: unknown;
		context: unknown;
	}
) => Promise<T>;
type DisposeMethod = (value: Record<string, unknown>, key: string, reason: string) => void;
type OnInsertMethod = (value: Record<string, unknown>, key: string, reason: string) => void;
type SizeCalculationMethod = (value: Record<string, unknown>, key: string) => number;

// At least one of 'max', 'ttl', or 'maxSize' is required, to prevent
// unsafe unbounded storage.
//
// In most cases, it's best to specify a max for performance, so all
// the required memory allocation is done up-front.
//
// All the other options are optional, see the sections below for
// documentation on what each one does.  Most of them can be
// overridden for specific items in get()/set()
const options = {
	max: 500,

	// for use with tracking overall storage size
	maxSize: 5000,
	sizeCalculation: (value: Record<string, unknown>, key: string) =>
	{
		return 1;
	},

	// for use when you need to clean up something when objects
	// are evicted from the cache
	dispose: (value: Record<string, unknown>, key: string, reason: string) =>
	{
		console.log('dispose:', key, value?.typeId, reason);
	},

	onInsert: (value: Record<string, unknown>, key: string, reason: string) =>
	{
		console.log('cache:', key, value?.typeId);
	},

	// how long to live in ms
	ttl: 1000 * 60 * 5,

	// return stale items before removing from cache?
	allowStale: false,

	updateAgeOnGet: false,
	updateAgeOnHas: false,

	// async method to use for cache.fetch(), for
	// stale-while-revalidate type of behavior
	fetchMethod: async (
		key: string,
		staleValue: unknown,
		{ options, signal, context }
	) =>
	{
		console.log('Incorrect fetch method called:', key, staleValue);

		return {};
	},
};

// const cache = new LRUCache(options);
// cache.set('key', { typeId: 'value' });
// cache.get('key'); // { typeId: 'value' }
// non-string keys ARE fully supported
// but note that it must be THE SAME object, not
// just a JSON-equivalent object.
// const someObject = { a: 1 };
// cache.set(someObject, 'a value');
// Object keys are not toString()-ed
// cache.set('[object Object]', 'a different value');
// assert.equal(cache.get(someObject), 'a value');
// A similar object with same keys/values won't work,
// because it's a different object identity
// assert.equal(cache.get({ a: 1 }), undefined);
// cache.clear(); // empty the cache

function getGenericFetchMethod(itemType: ItemTypes): FetchMethod
{
	return (async (
		key: string,
		staleValue: unknown,
		{ options, signal, context }
	) =>
	{
		const { success, data } = await loadItem({ id: key, itemType });

		// TODO: compare stale value with data & process unexpected changes

		return data ?? {};
	});
}

const optsForItemType: Partial<Record<ItemTypes, Partial<typeof options>>> = {
	[ItemTypes.Archetype]: {},
	[ItemTypes.Collection]: {
		max: 25,
		fetchMethod: getGenericFetchMethod(ItemTypes.Collection),
	},
	[ItemTypes.Character]: {
		max: 5,
		fetchMethod: getGenericFetchMethod(ItemTypes.Character),
	},
	[ItemTypes.CustomItem]: {},
	[ItemTypes.Equipment]: {
		max: 100,
		fetchMethod: getGenericFetchMethod(ItemTypes.Equipment),
	},
	[ItemTypes.EquipmentType]: {
		max: 100,
		fetchMethod: getGenericFetchMethod(ItemTypes.EquipmentType),
	},
	[ItemTypes.Field]: {},
	[ItemTypes.ImageAsset]: {
		max: 50,
		fetchMethod: getGenericFetchMethod(ItemTypes.ImageAsset),
	},
	[ItemTypes.InAppNotification]: {
		max: 50,
		fetchMethod: getGenericFetchMethod(ItemTypes.InAppNotification),
	},
	[ItemTypes.Profile]: {
		max: 5,
		fetchMethod: getGenericFetchMethod(ItemTypes.Profile),
	},
	[ItemTypes.Reminder]: {
		max: 100,
		fetchMethod: getGenericFetchMethod(ItemTypes.Reminder),
	},
	[ItemTypes.Reward]: {
		max: 100,
		fetchMethod: getGenericFetchMethod(ItemTypes.Reward),
	},
	[ItemTypes.Tag]: {
		max: 100,
		fetchMethod: getGenericFetchMethod(ItemTypes.Tag),
	},
	[ItemTypes.Task]: {
		max: 200,
		fetchMethod: getGenericFetchMethod(ItemTypes.Task),
	},
	[ItemTypes.TaskActivity]: {
		max: 500,
		fetchMethod: getGenericFetchMethod(ItemTypes.TaskActivity),
	},
	[ItemTypes.TaskMaster]: {
		max: 25,
		fetchMethod: getGenericFetchMethod(ItemTypes.TaskMaster),
	},
}

function createOptions(itemType: ItemTypes): typeof options
{
	if(itemType && (itemType in optsForItemType))
	{
		console.log('createOptions:', itemType, optsForItemType[itemType]);
		return {
			...options,
			...optsForItemType[itemType],
		};
	}
	
	return options;
}

const itemCaches: Partial<Record<
	ItemTypes,
	LRUCache<string, Record<string, unknown>>
>> = {};

export function getItemCache(
	itemType: ItemTypes
): LRUCache<string, Record<string, unknown>>
{
	if(!itemCaches[itemType])
	{
		const cacheOpts = createOptions(itemType);

		itemCaches[itemType] = new LRUCache(cacheOpts);
	}

	return itemCaches[itemType];
}

export function getItemFromCache<T = Record<string, unknown>>(
	itemType: ItemTypes,
	key: string
): Record<string, unknown> | undefined
{
	const cache = getItemCache(itemType);

	const value = cache.get(key);

	if(!value)
	{
		cache.fetch(key);
	}

	return cache.get(key);
}

export function getItemsFromCache<T = Record<string, unknown>>(
	itemType: ItemTypes,
	keys: string[]
): Record<string, T | undefined>
{
	return keys.reduce((agg: Record<string, T>, key) =>
	{
		agg[key] = getItemFromCache(itemType, key) as T;

		return agg;
	}, {});
}

export function setItemInCache<T = Record<string, unknown>>(
	itemType: ItemTypes,
	key: string,
	value: T
): void
{
	const cache = getItemCache(itemType);

	cache.set(key, value as Record<string, unknown>);
}
