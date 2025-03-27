'use client';

import { createItem, loadItem, updateItem, searchItems } from "@/api/actions/Generic";
import { Collection } from "@/zencore/arch/Collection";
import { DbFilterHandler } from "@/zencore/Filters";
import { Item, Task, TaskActivity, ItemTypes, TaskActivityType } from "@/zencore/ItemTypes";
import { Uuid } from "@/zencore/Utils";

export async function addTaskToCollection(opts: {
	baseData: Partial<Item<Task>>;
	collectionId: string;
	id?: string;
}): Promise<{
	taskId: string;
	success: boolean;
	taskData: Item<Task> | undefined;
	activityData: Item<TaskActivity> | undefined;
	collectionData: Item<Collection> | undefined;
}>
{
	const { id, collectionId, baseData } = opts;
	const res: {
		taskId: string;
		success: boolean;
		taskData: Item<Task> | undefined;
		activityData: Item<TaskActivity> | undefined;
		collectionData: Item<Collection> | undefined;
	} = {
		taskId: id || Uuid.generateUuid(),
		success: false,
		taskData: undefined,
		activityData: undefined,
		collectionData: undefined,
	};

	const taskRes = await createItem<Task>({
		itemType: ItemTypes.Task,
		id: res.taskId,
		data: baseData,
	});

	if(!taskRes?.success || !taskRes?.data)
	{
		return res;
	}

	res.taskData = taskRes.data;

	const collectionData = await loadItem<Collection>({
		itemType: ItemTypes.Collection,
		id: collectionId
	});

	if(!collectionData?.success || !collectionData?.data?.id)
	{
		return res;
	}

	res.collectionData = collectionData.data;

	const newTasksArray = [
		...(collectionData.data.items || []),
		taskRes.data.id
	];

	// add the new task's id to the Collection
	const updateRes = await updateItem<Collection>({
		itemType: ItemTypes.Collection,
		id: collectionId,
		data: {
			items: newTasksArray
		},
	});

	if(!updateRes?.success)
	{
		return res;
	}

	// add an activity log that the task was added
	const activityRes = await createItem<TaskActivity>({
		itemType: ItemTypes.TaskActivity,
		id: Uuid.generateUuid(),
		data: {
			taskId: res.taskId,
			activityType: TaskActivityType.Created,
		},
	});

	if(!activityRes?.success)
	{
		return res;
	}

	res.activityData = activityRes.data;
	res.success = true;

	return res;
}

export async function getCollectionAndTaskAndActivityData(opts: {
	collectionIds: string[];
}): Promise<{
	collections: Item<Collection>[];
	tasks: Item<Task>[];
	activity: Item<TaskActivity>[];
}>
{
	const result: {
		collections: Item<Collection>[];
		tasks: Item<Task>[];
		activity: Item<TaskActivity>[];
	} = {
		collections: [],
		tasks: [],
		activity: [],
	};

	if(!(Array.isArray(opts?.collectionIds) && opts.collectionIds.length))
	{
		return result;
	}

	// search for collections
	const collectionsRes = await searchItems<Collection>({
		itemType: ItemTypes.Collection,
		filters: [DbFilterHandler.create('id', 'in', opts.collectionIds)],
	});

	if(!(
		Array.isArray(collectionsRes?.data?.results) &&
		collectionsRes.data.results.length
	))
	{
		return result;
	}

	result.collections = collectionsRes.data.results;

	const allTaskIds = collectionsRes.data.results.reduce((agg, collection) =>
	{
		if(Array.isArray(collection.items))
		{
			agg.push(...collection.items);
		}

		return agg;
	}, [] as string[]);

	if(!allTaskIds.length)
	{
		return result;
	}

	const tasksRes = await searchItems<Task>({
		itemType: ItemTypes.Task,
		filters: [DbFilterHandler.create('id', 'in', allTaskIds)],
	});

	if(!(
		Array.isArray(tasksRes?.data?.results) &&
		tasksRes.data.results.length
	))
	{
		return result;
	}

	result.tasks = tasksRes.data.results;

	const activityRes = await searchItems<TaskActivity>({
		itemType: ItemTypes.TaskActivity,
		filters: [DbFilterHandler.create('taskId', 'in', allTaskIds)],
	});

	if(!(
		Array.isArray(activityRes?.data?.results) &&
		activityRes.data.results.length
	))
	{
		return result;
	}

	result.activity = activityRes.data.results;

	return result;
}