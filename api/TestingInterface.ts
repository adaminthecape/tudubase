import { Collection } from "@/zencore/arch/Collection";
import { IItemType, ItemTypes, Item, Task } from "@/zencore/ItemTypes";
import { RamDatabase } from "@/zencore/MemoryDatabase";
import { Utils } from "@/zencore/Utils";
import { readFileSync, writeFileSync } from "fs";

const db = new RamDatabase({});

const filename = 'db.json';

function archiveDb()
{
	if(db)
	{
		writeFileSync(filename, JSON.stringify(db.cacheByType, null, 2));
	}
}

// function makeUuids()
// {
// 	const uuids = [...Array(1000)].map(() => Uuid.generateUuid());

// 	writeFileSync('uuids.json', JSON.stringify(uuids, null, 2));
// }

// makeUuids();

const uuids = JSON.parse(readFileSync('uuids.json', 'utf-8'));

function getArchivedDb()
{
	if(!db)
	{
		return;
	}

	try
	{
		const data = readFileSync(filename, 'utf-8');

		if(!data?.startsWith('{'))
		{
			return undefined;
		}

		const dataToReturn = JSON.parse(data);

		return dataToReturn;
	}
	catch(e)
	{
		console.log('Error reading db:', e);
		return undefined;
	}
}

async function fillDb()
{
	console.log('FILLING DB...');

	const dbData = getArchivedDb();

	if(Utils.isPopulatedObject(dbData))
	{
		db.cacheByType = dbData as Record<string, Record<string, IItemType>>;
	}

	function toItem<T = any>(typeId: ItemTypes, data: T): Item<T>
	{
		return {
			id: uuids.pop(),
			typeId: ItemTypes.Character,
			createdAt: Utils.getCurrentSecond(),
			updatedAt: Utils.getCurrentSecond(),
			createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
			...data,
		};
	}

	await db.insertMultiple({
		itemType: ItemTypes.Character,
		items: {
			[uuids.pop()]: {
				name: 'Test Character',
				level: 1,
				health: 100,
				mana: 100,
				strength: 10,
				intelligence: 10,
				agility: 10,
			}
		}
	});

	const tasks: Item<Task>[] = [
		{
			title: 'Task 1',
			notes: 'This is a task',
			due: Utils.getCurrentSecond() + 86400,
			priority: 'low',
			recurring: false,
			tags: [],
			activity: [],
			completed: null,
			completedAt: null,
		},
	].map((data) => toItem(ItemTypes.Task, data));
	await db.insertMultiple<Item<Task>>({
		itemType: ItemTypes.Task,
		items: Utils.reduceIntoAssociativeArray(tasks, 'id'),
	});

	const collections: Item<Collection>[] = [
		{
			name: 'Test Collection',
			description: 'This is a test collection',
			items: [tasks[0].id],
		}
	].map((data) => toItem(ItemTypes.Collection, data));
	await db.insertMultiple<Item<Collection>>({
		itemType: ItemTypes.Collection,
		items: Utils.reduceIntoAssociativeArray(collections, 'id'),
	});
	console.log('DB FILLED');
}

fillDb();

export async function getDb()
{
	if(!Utils.isPopulatedObject(db.cacheByType))
	{
		await fillDb();
	}

	archiveDb();

	return db;
}