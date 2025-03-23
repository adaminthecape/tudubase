'use server';

import { ActionResponse } from "./types";
import { FieldData, Item, ItemTypes } from "@/zencore/ItemTypes";
import { Utils, Uuid } from "@/zencore/Utils";
import { DrizzleHandler } from "../DrizzleInterface";
import { DbFilters } from "@/zencore/Filters";
import { DbPaginationOpts, PaginatedItemResponse } from "@/zencore/Pagination";
import { createClient } from "@/utils/supabase/server";
import { CustomItemHandler } from "@/zencore/CustomItem";
import { getArchetypeForItemType } from "../ItemUtils";
import { getFieldsForItemType } from "../utils/fieldUtils";

export async function getItemFields(
	itemType: ItemTypes
): Promise<FieldData[] | undefined>
{
	return getFieldsForItemType(itemType);
}

export async function getORM()
{
	return new DrizzleHandler({});
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

export async function createItem(opts: {
	itemType: ItemTypes;
	id: string;
	data: Partial<Item<Record<string, unknown>>>;
}): Promise<ActionResponse>
{
	const { id, itemType, data } = opts;
	console.log('createItem:', opts);
	if(!id)
	{
		return {
			success: false,
			message: 'No task ID provided',
		}
	}

	if(!Utils.isPopulatedObject(data))
	{
		return {
			success: false,
			message: 'No task data provided',
		}
	}

	const supabase = await createClient();

	const { data: { user } } = await supabase.auth.getUser();

	if(!(user?.id && Uuid.isUuid(user.id)))
	{
		return {
			success: false,
			message: 'User not authenticated',
		};
	}

	const handler = await getItemHandler({ itemType, id, data });

	if(!handler)
	{
		return {
			success: false,
			message: `Item type ${itemType} not found`,
		};
	}

	handler.createdBy = user.id;

	try
	{
		await handler.create();
	}
	catch(e)
	{
		console.error(e);

		return {
			success: false,
			message: `An error occurred while saving the task: ${
				(e as Error).message
			}`,
		}
	}

	return {
		success: true,
	};
}

export async function updateItem(opts: {
	itemType: ItemTypes;
	id: string;
	data: Partial<Item<Record<string, unknown>>>;
}): Promise<ActionResponse<Item<Record<string, unknown>>>>
{
	const { id, itemType } = opts;

	if(!opts?.id)
	{
		return {
			success: false,
			message: 'No task ID provided',
		};
	}

	const handler = await getItemHandler({
		itemType,
		id,
	});

	if(!handler)
	{
		return {
			success: false,
			message: `Item type ${itemType} not found`,
		};
	}

	const existingData = await handler.load();

	const snapshot1 = JSON.stringify(handler.getData());

	if(!Utils.isPopulatedObject(existingData))
	{
		return {
			success: false,
			message: `Item with ID ${opts.id} not found`,
		};
	}

	handler.setData(opts.data);

	const snapshot2 = JSON.stringify(handler.getData());

	if(snapshot1 === snapshot2)
	{
		// nothing to change
		return {
			success: true,
			data: handler.getData(),
		};
	}

	try
	{
		await handler.save();
	}
	catch(e)
	{
		console.error(e);

		return {
			success: false,
			message: `An error occurred while saving the task: ${
				(e as Error).message
			}`,
		}
	}

	return {
		success: true,
		data: handler.getData(),
	};
}

export async function loadItem(opts: {
	itemType: ItemTypes;
	id: string;
}): Promise<ActionResponse<Item<Record<string, unknown>> | undefined>>
{
	if(!opts?.id)
	{
		return {
			success: false,
			message: 'No task ID provided',
		}
	}

	const { id, itemType } = opts;

	const handler = await getItemHandler({ id, itemType });

	if(!handler)
	{
		return {
			success: false,
			message: `Item type ${itemType} not found`,
		};
	}

	const task = await handler.load();

	if(!task)
	{
		// task does not exist
		return {
			success: false,
			message: `Item with ID ${opts.id} not found`,
		}
	}

	return {
		success: true,
		data: handler.getData(),
	};
}

export async function searchItems(opts: {
	itemType: ItemTypes;
	filters?: DbFilters;
	pagination?: DbPaginationOpts;
}): Promise<ActionResponse<PaginatedItemResponse<Item<Record<string, unknown>>>>>
{
	const { itemType, filters, pagination } = opts;

	const handler = await getItemHandler({ itemType });

	if(!handler)
	{
		return {
			success: false,
			message: `Item type ${itemType} not found`,
		};
	}

	const response = await handler.search({
		filters: filters,
		pagination: pagination || {
			page: 1,
			pageSize: 20,
		}
	});

	return {
		success: true,
		data: response,
	};
}

