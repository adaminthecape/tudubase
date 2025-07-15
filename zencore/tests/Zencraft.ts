import { CharacterHandler } from "../arch/Character";
import { fieldsForCollection } from "../arch/Collection";
import { fieldsForEquipment } from "../arch/Equipment";
import { fieldsForEquipmentType } from "../arch/EquipmentType";
import { fieldsForImageAsset } from "../arch/ImageAsset";
import { fieldsForInAppNotification } from "../arch/InAppNotification";
import { fieldsForProfile } from "../arch/Profile";
import { fieldsForReminder } from "../arch/Reminder";
import { fieldsForReward } from "../arch/Reward";
import { fieldsForTag } from "../arch/Tag";
import { fieldsForTask } from "../arch/Task";
import { fieldsForTaskMaster } from "../arch/TaskMaster";
import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { FieldHandler } from "../Field";
import { DbFilterOperator, DbFilters } from "../Filters";
import { ItemHandler } from "../Item";
import { ArchetypeData, FieldData, FieldType, IItemType } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid, Utils } from "../Utils";
import {
	collectionItemFields,
	createArchetypeExercise,
	createArchetypePerson,
	createArchetypeReminder,
	createArchetypeTask,
	Item,
	reminderItemFields,
	rewardItemFields,
	Task,
	TaskCategory,
	taskCategoryItemFields,
	taskItemFields,
	TaskMaster,
	taskMasterItemFields
} from "./archetypes";
import { flushEffort, timer } from "./effort";
import {
	createFakeItem as _createFakeItem,
} from "./items";
import { getProgress, printFinalProgress, printTestProgress, setProgress, startProgress } from "./progress";
import { zodTest } from "./zod";

async function createFakeItem(opts: Parameters<typeof _createFakeItem>[0])
{
	const t = timer(`item:create:${opts.archetypeName}`);

	const res = await _createFakeItem(opts);

	t.effort();

	zodTest({});

	return res;
}

async function systemTest(opts: {
	db: RamDatabase;
	numToAdd: { min: string | number; max: string | number; };
})
{
	const t = timer('systemTest');
	const { db } = opts;

	const tPerson = timer('arch:create:Person');
	const person = await createArchetypePerson({ db });
	tPerson.effort();

	const tExercise = timer('arch:create:Exercise');
	const exercise = await createArchetypeExercise({ db });
	tExercise.effort();

	const tTask = timer('arch:create:Task');
	const task = await createArchetypeTask({ db });
	tTask.effort();

	const tReminder = timer('arch:create:Reminder');
	const reminder = await createArchetypeReminder({ db });
	tReminder.effort();

	const archetypes = [
		[person.name, person.archetype, person.fields, person.fakeData],
		[exercise.name, exercise.archetype, exercise.fields, exercise.fakeData],
		[task.name, task.archetype, task.fields, task.fakeData],
		[reminder.name, reminder.archetype, reminder.fields, reminder.fakeData],
	];
	
	const numToAdd = Math.floor(
		Math.random() * (Number(opts.numToAdd.max) - Number(opts.numToAdd.min))
	) + Number(opts.numToAdd.min);

	for await(const _ of Array(numToAdd))
	{
		const [
			archetypeName,
			archetype,
			fields,
			itemData
		] = archetypes[Math.floor(Math.random() * archetypes.length)];

		const { id } = await createFakeItem({
			archetypeName,
			db,
			itemData: itemData as Record<string, unknown>,
			archetypeId: (archetype as ArchetypeHandler).id
		});
	}

	t.effort();
	// printLogs();
}
async function runSystemTests()
{
	const db = new RamDatabase({});
	startProgress(db);
	await new Promise((resolve) => setTimeout(resolve, 50));
	// for await(const num of Array(getProgress('numTests')).keys())
	const testNums = Array.from(new Set(Array(getProgress('numTests')).keys()));
	const testOpts = {
		db,
		numToAdd: {
			min: getProgress('numToAddMin'),
			max: getProgress('numToAddMax'),
		}
	};
	for await(const num of testNums)
	{
		setProgress('currentTest', num);
		await systemTest(testOpts);
		printTestProgress(db);
		flushEffort();
	}
	flushEffort();
	await new Promise((resolve) => setTimeout(resolve, 50));
	console.log();
	printFinalProgress(db);
}

async function testRamDb()
{
	const db = new RamDatabase({});

	const id = Uuid.generateUuid();
	const handler = new ItemHandler({ id, db });
	handler.setData({ foo: 'bar' } as Record<string, unknown>);
	await handler.save();

	const itemType = handler.typeId;

	console.log({
		select: await db.select({ itemId: id, itemType }),
		selectMultiple: await db.selectMultiple({
			itemType,
			filters: [
				{
					key: 'typeId',
					operator: DbFilterOperator.isEqual,
					value: 'Item',
				},
				{
					key: 'id',
					operator: DbFilterOperator.isEqual,
					value: id,
				}
			],
		}),
	});
	console.log(db.cacheByType);
}

async function gamifyTest()
{
	const db = new RamDatabase({});

	const archetypesRelatedToTasks: ArchetypeData[] = [
		{
			itemType: 'Task',
		},
		{
			itemType: 'Reminder',
		},
		{
			itemType: 'TaskMaster',
		},
		{
			itemType: 'Collection',
		},
		{
			itemType: 'Reward',
		},
		{
			itemType: 'Category',
		},
	].map((data: Partial<ArchetypeData>) => ({
		...data,
		id: Uuid.generateUuid(),
		typeId: 'Archetype',
		scopeId: undefined,
		createdAt: Utils.getCurrentSecond(),
		updatedAt: Utils.getCurrentSecond(),
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		name: data.name || data.itemType,
		attachedFields: [],
		itemType: data.itemType,
	}));

	const toItem = (itemType: string) => (x: IItemType) => ({
		...x,
		id: Uuid.generateUuid(),
		typeId: itemType,
		createdAt: Utils.getCurrentSecond(),
		updatedAt: Utils.getCurrentSecond(),
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
	});

	const archetypeFields: Record<string, FieldData[]> = {};
	archetypeFields.Task = taskItemFields
		.map(toItem('Field')) as FieldData[];
	archetypeFields.TaskCategory = [
		{
			key: 'name',
			label: 'Name',
			fieldType: FieldType.text,
			validation: {
				required: true,
				between: { min: 1, max: 100 }
			}
		},
	].map(toItem('Field')) as FieldData[];
	archetypeFields.Reminder = reminderItemFields
		.map(toItem('Field')) as FieldData[];
	// A TaskMaster periodically looks through existing Tasks, and picks one to
	// assign to the user.
	// In order to assign a Task, it needs to know which Tasks are available.
	// A given TaskMaster might be restricted to certain kinds of tasks, so it
	// should have search filters.
	// It should also be able to assign a Task to a user, and track when it was
	// assigned.
	// It should be able to track the user's progress on the Task, and provide
	// feedback.
	archetypeFields.TaskMaster = taskMasterItemFields
		.map(toItem('Field')) as FieldData[];
	archetypeFields.Collection = collectionItemFields
		.map(toItem('Field')) as FieldData[];
	archetypeFields.Reward = rewardItemFields
		.map(toItem('Field')) as FieldData[];
	archetypeFields.Category = taskCategoryItemFields
		.map(toItem('Field')) as FieldData[];

	const categories: Partial<Item<TaskCategory>>[] = [
		{
			name: 'morning',
		},
		{
			name: 'daily',
		},
	].map(toItem('Category'));
	const task: Task = {
		name: 'Task',
		due: Utils.getCurrentSecond(),
		priority: 'medium',
		notes: 'This is a task',
		completed: false,
		completedAt: null,
		recurring: false,
		category: categories[0].id,
	};

	for await(const arch of Object.values(archetypesRelatedToTasks))
	{
		if(!arch.itemType)
		{
			continue;
		}

		const archFields = archetypeFields[arch.itemType];

		if(!archFields)
		{
			console.log(`No fields found for archetype: ${arch.itemType}`);
			continue;
		}

		const archetype = new ArchetypeHandler({ id: arch.id, db });
		archetype.setData({
			...arch,
			attachedFields: archetypeFields[arch.itemType].map((f) => f.id),
		});
		await archetype.save();

		for await(const fieldData of archFields)
		{
			const field = new FieldHandler({ id: fieldData.id, db });
			field.setData(fieldData);
			await field.save();
		}
	}

	const taskDefinition = (await db.selectMultiple({
		itemType: 'Archetype',
		filters: [
			{
				key: 'name',
				operator: DbFilterOperator.isEqual,
				value: 'Task',
			}
		],
	}))?.results?.[0] as ArchetypeData;
	const taskItem = new CustomItemHandler({
		id: Uuid.generateUuid(),
		db,
		definition: taskDefinition,
		fieldDataArray: archetypeFields.Task,
	});
	taskItem.setData({ ...task });
	await taskItem.save();

	// console.log({
	// 	archetypesRelatedToTasks,
	// 	taskArchetypeFields,
	// 	reminderArchetypeFields,
	// 	taskMasterArchetypeFields,
	// 	collectionArchetypeFields,
	// 	rewardArchetypeFields,
	// 	task,
	// });
	Object.keys(db.cacheByType).forEach((type) =>
	{
		console.log('CACHE:', type, Object.keys(db.cacheByType[type]).length);
		// console.log(db.cacheByType[type]);
	});

	// set up a new TaskMaster whose job is to find daily morning tasks
	const taskMasterArchetype = (await db.selectMultiple({
		itemType: 'Archetype',
		filters: [
			{
				key: 'name',
				operator: DbFilterOperator.isEqual,
				value: 'TaskMaster',
			}
		],
	}))?.results?.[0] as ArchetypeData;

	const taskMasterItem = new CustomItemHandler({
		id: Uuid.generateUuid(),
		db,
		definition: taskMasterArchetype,
		fieldDataArray: archetypeFields.TaskMaster,
	});
	const taskMasterFields: TaskMaster = {
		name: 'Morning Task Master',
		description: 'Assigns daily morning tasks',
		tasks: [taskItem.id],
		isActive: true,
		searchFilters: [
			{
				key: 'tag',
				operator: DbFilterOperator.in,
				value: [categories[0].id, categories[1].id],
			}
		],
		assignedTask: undefined,
		assignedAt: null,
		progress: 0,
		feedback: '',
	};

	taskMasterItem.setData({ ...taskMasterFields });
	await taskMasterItem.save();

	console.log(JSON.stringify(await taskMasterItem.load(), undefined, 4));

	async function getTaskMasterHandler(opts: {
		db: RamDatabase;
		taskMasterId: string;
	})
	{
		const { db, taskMasterId } = opts;

		const master = new CustomItemHandler({
			id: taskMasterId,
			db,
			definition: taskMasterArchetype,
			fieldDataArray: archetypeFields.TaskMaster,
		});

		await master.load();

		return master;
	}

	async function getTaskHandler(opts: {
		db: RamDatabase;
		taskId: string;
	})
	{
		const { db, taskId } = opts;

		const handler = new CustomItemHandler({
			id: taskId,
			db,
			definition: taskDefinition,
			fieldDataArray: archetypeFields.Task,
		});

		await handler.load();

		return handler;
	}

	async function pluckTask(opts: {
		master: CustomItemHandler;
		task: IItemType | Item<Task>;
	})
	{
		const { master, task } = opts;
		const taskHandler = await getTaskHandler({ db, taskId: task.id as string });

		// assign the task
		master.setData({
			assignedTask: task.id,
			assignedAt: Utils.getCurrentSecond(),
		});
		await master.save();

		// provide feedback
		taskHandler.setData({
			completed: false,
			completedAt: null,
		});
		await taskHandler.save();

		// set a delay to check on completion later
		await new Promise((resolve) => setTimeout(async () =>
		{
			// check on the task
			await taskHandler.load();

			const taskData = taskHandler.getData() as unknown as Item<Task>;

			// if the task is completed, provide feedback
			if(taskData.completed)
			{
				master.setData({
					progress: 100,
					feedback: 'Great job!',
				});
				await master.save();
			}
			else
			{
				master.setData({
					progress: 0,
					feedback: 'You can do it!',
				});
				console.log('Are you still there?');
			}
			resolve(true);
		}, 6000));
	}

	async function runTaskMaster(opts: {
		db: RamDatabase;
		taskMasterId: string;
	})
	{
		const { db, taskMasterId } = opts;

		// get the task master by its id
		const master = await getTaskMasterHandler({ db, taskMasterId });

		const masterData = master.getData() as unknown as Item<TaskMaster>;

		// if it has search filters, run a search
		const filters = masterData.searchFilters as DbFilters;

		const tasks = (await db.selectMultiple({
			itemType: 'Task',
			filters,
		}))?.results;

		// if it has tasks, assign one to the user
		if(tasks?.length)
		{
			const [task] = tasks;

			if(!('id' in task && typeof task.id === 'string'))
			{
				return;
			}

			await pluckTask({ master, task });
		}
	}

	await runTaskMaster({ db, taskMasterId: taskMasterItem.id });
	await testCharacter();
}

async function testCharacter()
{
	const db = new RamDatabase({});

	const character = new CharacterHandler({
		id: Uuid.generateUuid(),
		db,
	});

	character.setData({
		name: 'Test Character',
		health: 100,
		mana: 50,
		strength: 10,
		agility: 10,
		intelligence: {},
	} as any);

	await character.save();
	await character.load();

	console.log(
		'Character created:',
		JSON.stringify(character.getData(), undefined, 4)
	);
}

function testtest()
{
	const fields = {
		// fieldsForCharacter,
		fieldsForCollection,
		fieldsForEquipment,
		fieldsForEquipmentType,
		fieldsForImageAsset,
		fieldsForInAppNotification,
		fieldsForProfile,
		fieldsForReminder,
		fieldsForReward,
		fieldsForTag,
		fieldsForTask,
		fieldsForTaskMaster
	};

	const itemTypes = [
		'Character',
		'Collection',
		'Equipment',
		'EquipmentType',
		'ImageAsset',
		'InAppNotification',
		'Profile',
		'Reminder',
		'Reward',
		'Tag',
		'Task',
		'TaskMaster',
	]

	function addToObj(
		obj: Record<string, any>,
		arch: string,
		field: FieldData,
		value: any
	)
	{
		if(!field.key) return;

		if(!obj[arch]) obj[arch] = {};

		obj[arch][field.key] = {
			label: field.label || field.key || field.id,
		};
	}

	const result = {};

	itemTypes.forEach((itemType) =>
	{
		const fieldsForType = (fields as any)[`fieldsFor${itemType}`];

		if(!fieldsForType) return;

		fieldsForType.forEach((field: FieldData) =>
		{
			addToObj(result, itemType, field, 'value');
		});
	});

	console.log(JSON.stringify(result, undefined, 4));
}

// testRamDb();
// testtest();
gamifyTest();
// runSystemTests();
