'use server';

import { fieldsForTask, fieldsForTaskActivity, Task, TaskHandler } from "@/zencore/arch/Task";
import { ActionResponse } from "./types";
import { FieldData, Item } from "@/zencore/ItemTypes";
import { Utils, Uuid } from "@/zencore/Utils";
import { DrizzleHandler } from "../DrizzleInterface";
import { DbFilterOperator, DbFilters } from "@/zencore/Filters";
import { DbPaginationOpts } from "@/zencore/Pagination";
import { createClient } from "@/utils/supabase/server";

export async function getTaskFields(): Promise<FieldData[]>
{
	return [
		...fieldsForTask,
		...fieldsForTaskActivity,
	];
}

export async function getORM()
{
	return new DrizzleHandler({});
}

export async function getTaskHandler(opts?: {
	id?: string | undefined;
	data?: Partial<Item<Task>> | undefined;
}): Promise<TaskHandler>
{
	const handler = new TaskHandler({
		id: opts?.id || Uuid.generateUuid(),
		db: await getORM(),
	});

	if(opts?.data)
	{
		handler.setData(opts.data);
	}

	return handler;
}

export async function createTask(opts: {
	id: string;
	data: Partial<Item<Task>>;
}): Promise<ActionResponse>
{
	console.log('createTask:', opts);
	if(!opts.id)
	{
		return {
			success: false,
			message: 'No task ID provided',
		}
	}

	if(!Utils.isPopulatedObject(opts.data))
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

	const handler = await getTaskHandler({
		id: opts.id,
		data: opts.data,
	});

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

export async function updateTask(opts: {
	id: string;
	data: Partial<Item<Task>>;
}): Promise<ActionResponse<Item<Task>>>
{
	if(!opts?.id)
	{
		return {
			success: false,
			message: 'No task ID provided',
		};
	}

	const handler = await getTaskHandler({
		id: opts.id,
	});

	const existingData = await handler.load();

	const snapshot1 = JSON.stringify(handler.getData());

	if(!Utils.isPopulatedObject(existingData))
	{
		return {
			success: false,
			message: `Task with ID ${opts.id} not found`,
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

export async function loadTask(opts: {
	id: string;
}): Promise<ActionResponse<Item<Task> | undefined>>
{
	if(!opts?.id)
	{
		return {
			success: false,
			message: 'No task ID provided',
		}
	}

	const handler = await getTaskHandler();

	const task = await handler.load();

	if(!task)
	{
		// task does not exist
		return {
			success: false,
			message: `Task with ID ${opts.id} not found`,
		}
	}

	return {
		success: true,
		data: handler.getData(),
	};
}

export async function loadTasks(opts?: {
	filters?: DbFilters;
	pagination?: DbPaginationOpts;
}): Promise<ActionResponse<Item<Task>[]>>
{
	const handler = await getTaskHandler();

	const tasks = await handler.search({
		filters: opts?.filters,
		pagination: opts?.pagination || {
			page: 1,
			pageSize: 20,
		}
	});

	return {
		success: true,
		data: tasks,
	};
}