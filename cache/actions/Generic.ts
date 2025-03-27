'use client';

import { ActionResponse } from "./types";
import { FieldData, Item, ItemTypes } from "@/zencore/ItemTypes";
import { Uuid } from "@/zencore/Utils";
import { DbFilters } from "@/zencore/Filters";
import { DbPaginationOpts, PaginatedItemResponse } from "@/zencore/Pagination";
import { CustomItemHandler } from "@/zencore/CustomItem";
import { getFieldsForItemType } from "@/apiUtils/fieldUtils";
import { RamDatabase } from "@/zencore/MemoryDatabase";
import { getArchetypeForItemType } from "@/api/ItemUtils";
import {
	createItem as createItemOnServer,
	loadItem as loadItemOnServer,
	updateItem as updateItemOnServer,
	searchItems as searchItemsOnServer,
} from "@/api/actions/Generic";

export const cache: RamDatabase = new RamDatabase({});

const swrTimeout = 1000 * 60 * 5; // 5 minutes
const lastFetchedMs: Record<`${ItemTypes}:${string}`, number> = {};
const isOptimistic: boolean = true;

function getLastFetchedMs(itemType: ItemTypes, id: string): number
{
	return lastFetchedMs[`${itemType}:${id}`] || 0;
}

function isStale(itemType: ItemTypes, id: string): boolean
{
	const lastFetched = getLastFetchedMs(itemType, id);

	return (Date.now() - lastFetched) > swrTimeout;
}

export async function getORM()
{
	return cache;
}

export async function getItemFields(
	itemType: ItemTypes
): Promise<FieldData[] | undefined>
{
	return getFieldsForItemType(itemType);
}

export async function cacheItem(opts: {
	itemType: ItemTypes;
	id?: string | undefined;
	data?: Partial<Item<Record<string, unknown>>> | undefined;
	isNew?: boolean;
}): Promise<void>
{
	const handler = await getItemHandler({
		id: opts.id,
		itemType: opts.itemType,
		data: opts.data,
	});

	if(opts.isNew)
	{
		await handler?.create();
	}
	else
	{
		await handler?.save();
	}
}

export async function getItemHandler(opts: {
	itemType: ItemTypes;
	id?: string | undefined;
	data?: Partial<Item<Record<string, unknown>>> | undefined;
}): Promise<CustomItemHandler | undefined>
{
	const arch = getArchetypeForItemType(opts.itemType);

	if(!arch)
	{
		return undefined;
	}

	const handler = new CustomItemHandler({
		id: opts.id || Uuid.generateUuid(),
		db: await getORM(),
		fieldDataArray: await getItemFields(opts.itemType),
		definition: arch.getData(),
		itemType: opts.itemType,
	});

	if(opts.data)
	{
		handler.setData(opts.data);
	}

	return handler;
}

function cacheIfOptimistic(opts: {
	id: string;
	itemType: ItemTypes;
	data: Record<string, unknown>;
})
{
	if(isOptimistic)
	{
		cacheItem(opts);
	}
}

export async function createItem<T = Record<string, unknown>>(opts: {
	itemType: ItemTypes;
	id: string;
	data: Partial<Item<T>>;
}): Promise<ActionResponse<Item<T>>>
{
	// pass the data to the server directly
	const res = await createItemOnServer(opts);

	if(res.success)
	{
		await cacheItem({
			id: opts.id,
			itemType: opts.itemType,
			data: res.data,
			isNew: true,
		});
	}

	return res;
}

export async function updateItem<T = Record<string, unknown>>(opts: {
	itemType: ItemTypes;
	id: string;
	data: Partial<Item<T>>;
}): Promise<ActionResponse<Item<T>>>
{
	const res = await updateItemOnServer(opts);

	if(res.success)
	{
		await cacheItem({
			id: opts.id,
			itemType: opts.itemType,
			data: res.data,
		});
	}

	return res;
}

export async function loadItem<T = Record<string, unknown>>(opts: {
	itemType: ItemTypes;
	id: string;
}): Promise<ActionResponse<Item<T> | undefined>>
{
	// if the item is already in the cache, and not stale, return it
	const handler = await getItemHandler({
		id: opts.id,
		itemType: opts.itemType,
	});

	const existing = await handler?.load();

	if(!existing)
	{
		return loadItemOnServer(opts);
	}

	if(isStale(opts.itemType, opts.id))
	{
		return loadItemOnServer(opts);
	}

	return {
		success: true,
		data: existing as Item<T>,
	};
}

class SearchCache<T = Record<string, unknown>>
{
	private cache: Record<string, PaginatedItemResponse<Item<T>>> = {};
	private timeout: number = swrTimeout;
	private lastFetchMs: Record<string, number> = {};

	public isStale(key: string): boolean
	{
		if(!this.cache[key])
		{
			return true;
		}

		const lastFetched = this.lastFetchMs[key];

		return (Date.now() - lastFetched) > this.timeout;
	}

	public has(key: string): boolean
	{
		return !!this.cache[key];
	}

	public get(key: string): PaginatedItemResponse<Item<T>>
	{
		return this.cache[key] || {
			results: [],
			totalItems: 0,
			pagination: {
				page: 1,
				pageSize: 10,
			},
			hasMore: false,
		};
	}

	public set(key: string, data: PaginatedItemResponse<Item<T>>): void
	{
		this.cache[key] = data;
	}
}

const searchCache = new SearchCache();

export async function searchItems<T = Record<string, unknown>>(opts: {
	itemType: ItemTypes;
	filters?: DbFilters;
	pagination?: DbPaginationOpts;
}): Promise<ActionResponse<PaginatedItemResponse<Item<T>>>>
{
	const key = JSON.stringify(opts);

	if(!searchCache.isStale(key))
	{
		return {
			success: true,
			data: searchCache.get(key) as PaginatedItemResponse<Item<T>>,
		};
	}

	const res = await searchItemsOnServer(opts);

	if(res.success)
	{
		searchCache.set(key, res.data as any);
	}

	return res as ActionResponse<PaginatedItemResponse<Item<T>>>;
}
