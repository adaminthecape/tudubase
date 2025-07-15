import { FieldData, FieldType, ItemData, Nullable } from "../ItemTypes";
import { Uuid } from "../Utils";
import { createArchetype, fakeFieldData } from "./items";
import { RamDatabase } from "../MemoryDatabase";
import { DbFilters } from "../Filters";

export const personItemFields: FieldData[] = [
	{
		key: 'name',
		label: 'Name',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		}
	},
	{
		key: 'age',
		label: 'Age',
		fieldType: FieldType.number,
		validation: {
			required: true,
			between: { min: 0, max: 150 }
		}
	},
	{
		key: 'email',
		label: 'Email',
		fieldType: FieldType.text,
	}
].map((f) => ({ ...f, id: Uuid.generateUuid(), typeId: 'Field' }));
export const exerciseItemFields: FieldData[] = [
	{
		key: 'name',
		label: 'Name',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		}
	},
	{
		key: 'reps',
		label: 'Reps',
		fieldType: FieldType.number,
		validation: {
			required: true,
			between: { min: 0, max: 100 }
		}
	},
	{
		key: 'sets',
		label: 'Sets',
		fieldType: FieldType.number,
		validation: {
			required: true,
			between: { min: 0, max: 100 }
		}
	},
	{
		key: 'weight',
		label: 'Weight',
		fieldType: FieldType.number,
		validation: {
			required: true,
			between: { min: 0, max: 1000 }
		}
	},
	{
		key: 'date',
		label: 'Date',
		fieldType: FieldType.timestamp,
		validation: {
			required: true
		}
	},
	{
		key: 'exercise',
		label: 'Exercise',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		}
	},
	{
		key: 'notes',
		label: 'Notes',
		fieldType: FieldType.textarea,
		validation: {
			between: { min: 0, max: 1000 }
		}
	}
].map((f) => ({ ...f, id: Uuid.generateUuid(), typeId: 'Field' }));
export const taskItemFields: FieldData[] = [
	{
		key: 'name',
		label: 'Name',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		}
	},
	{
		key: 'due',
		label: 'Due',
		fieldType: FieldType.timestamp,
		validation: {
			required: true
		}
	},
	{
		key: 'priority',
		label: 'Priority',
		fieldType: FieldType.dropdown,
		options: ['low', 'medium', 'high'],
		validation: {
			required: true,
			options: ['low', 'medium', 'high']
		}
	},
	{
		key: 'notes',
		label: 'Notes',
		fieldType: FieldType.textarea,
		validation: {
			between: { min: 0, max: 1000 }
		}
	},
	{
		key: 'completed',
		label: 'Completed',
		fieldType: FieldType.toggle,
		validation: {
			required: true
		}
	},
	{
		key: 'completedAt',
		label: 'Completed At',
		fieldType: FieldType.timestamp,
		validation: {
			required: false
		}
	},
	{
		key: 'recurring',
		label: 'Recurring',
		fieldType: FieldType.toggle,
	}
].map((f) => ({ ...f, id: Uuid.generateUuid(), typeId: 'Field' }));
export const reminderItemFields: FieldData[] = [
	{
		key: 'due',
		label: 'Due',
		fieldType: FieldType.timestamp,
		validation: {
			required: true
		}
	},
	{
		key: 'recurFrequency',
		label: 'Recur Frequency (seconds)',
		fieldType: FieldType.number,
	},
	{
		key: 'acknowledgedAt',
		label: 'Acknowledged At',
		fieldType: FieldType.timestamp,
	}
].map((f) => ({ ...f, id: Uuid.generateUuid(), typeId: 'Field' }));
export const taskCategoryItemFields: FieldData[] = [
	{
		key: 'name',
		label: 'Name',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		}
	},
	{
		key: 'description',
		label: 'Description',
		fieldType: FieldType.textarea,
		validation: {
			between: { min: 0, max: 1000 }
		}
	}
].map((f) => ({ ...f, id: Uuid.generateUuid(), typeId: 'Field' }));
export const taskMasterItemFields: FieldData[] = [
	{
		key: 'name',
		label: 'Name',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		}
	},
	{
		key: 'description',
		label: 'Description',
		fieldType: FieldType.textarea,
		validation: {
			between: { min: 0, max: 1000 }
		}
	},
	{
		key: 'tasks',
		label: 'Tasks',
		fieldType: FieldType.itemArray,
		itemType: 'Task',
	},
	{
		key: 'isActive',
		label: 'Active',
		fieldType: FieldType.toggle,
		validation: {
			required: true
		}
	},
	{
		key: 'searchFilters',
		label: 'Search Filters',
		fieldType: FieldType.itemFilters,
		validation: {
			isItemFilterArray: true
		}
	},
	{
		key: 'assignedTask',
		label: 'Assigned Task',
		fieldType: FieldType.item,
		itemType: 'Task',
		validation: {
			isUuid: true
		}
	},
	{
		key: 'assignedAt',
		label: 'Assigned At',
		fieldType: FieldType.timestamp,
		validation: {
			isTimestamp: true
		}
	},
	{
		key: 'progress',
		label: 'Progress',
		fieldType: FieldType.number,
		validation: {
			between: { min: 0, max: 100 }
		}
	},
	{
		key: 'feedback',
		label: 'Feedback',
		fieldType: FieldType.textarea,
		validation: {
			between: { min: 0, max: 1000 }
		}
	}
].map((f) => ({ ...f, id: Uuid.generateUuid(), typeId: 'Field' }));
export const collectionItemFields: FieldData[] = [
	{
		key: 'name',
		label: 'Name',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		}
	},
	{
		key: 'items',
		label: 'Items',
		fieldType: FieldType.repeater,
	},
	{
		key: 'description',
		label: 'Description',
		fieldType: FieldType.textarea,
		validation: { between: { max: 1000 } }
	}
].map((f) => ({ ...f, id: Uuid.generateUuid(), typeId: 'Field' }));
export const rewardItemFields: FieldData[] = [
	// a Reward is something given to the user as a reward for completing a Task
	// or a Goal. It might be a physical item, or a digital item, or a service.
	// It should have a name, a description, and a value.
	{
		key: 'name',
		label: 'Name',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		}
	},
	{
		key: 'description',
		label: 'Description',
		fieldType: FieldType.textarea,
		validation: {
			between: { min: 0, max: 1000 }
		}
	},
	{
		key: 'value',
		label: 'Value',
		fieldType: FieldType.number,
		validation: {
			between: { min: 0, max: 1000 }
		}
	},
	// It should have an image as well
	{
		key: 'imageUrl',
		label: 'Image',
		fieldType: FieldType.text,
		validation: {
			between: { max: 1000 }
		}
	},
	// It should have a category
	{
		key: 'category',
		label: 'Category',
		fieldType: FieldType.item,
		itemType: 'RewardCategory',
	},
	// It should have a rarity
	{
		key: 'rarity',
		label: 'Rarity',
		fieldType: FieldType.dropdown,
		options: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
		validation: {
			options: ['common', 'uncommon', 'rare', 'epic', 'legendary']
		},
	},
	// It should have a numerical value so it can be sorted in a simple way
	{
		key: 'sortValue',
		label: 'Sort Value',
		fieldType: FieldType.number,
		validation: {
			between: { min: 0, max: 10000 }
		}
	},
].map((f) => ({ ...f, id: Uuid.generateUuid(), typeId: 'Field' }));
// export const __ItemFields: FieldData[] = [].map((f) => ({ ...f, id: Uuid.generateUuid(), typeId: 'Field' }));

export async function createArchetypePerson(opts: {
	db: RamDatabase;
}) {
	const archetype = await createArchetype({
		db: opts.db,
		itemType: 'Person',
		fields: personItemFields
	});

	return {
		name: 'Person',
		archetype,
		fields: personItemFields,
		fakeData: fakeFieldData(personItemFields)
	};
}

export async function createArchetypeExercise(opts: {
	db: RamDatabase;
}) {
	const archetype = await createArchetype({
		db: opts.db,
		itemType: 'Exercise',
		fields: exerciseItemFields
	});

	return {
		name: 'Exercise',
		archetype,
		fields: exerciseItemFields,
		fakeData: fakeFieldData(exerciseItemFields)
	};
}

export async function createArchetypeTask(opts: {
	db: RamDatabase;
}) {
	const archetype = await createArchetype({
		db: opts.db,
		itemType: 'Task',
		fields: taskItemFields
	});

	return {
		name: 'Task',
		archetype,
		fields: taskItemFields,
		fakeData: fakeFieldData(taskItemFields)
	};
}

export async function createArchetypeReminder(opts: {
	db: RamDatabase;
}) {
	const archetype = await createArchetype({
		db: opts.db,
		itemType: 'Reminder',
		fields: reminderItemFields
	});

	return {
		name: 'Reminder',
		archetype,
		fields: reminderItemFields,
		fakeData: fakeFieldData(reminderItemFields)
	};
}

export function generateNewId<T extends { id: string; }>(item: T): T
{
	item.id = Uuid.generateUuid();

	return item;
}

export interface Reward
{
	name: Nullable<string>;
	description: Nullable<string>;
	value: Nullable<number>;
	imageUrl: Nullable<string>;
	category: Nullable<string>;
	rarity: Nullable<string>;
	sortValue: Nullable<number>;
};
export interface RewardCategory
{
	name: Nullable<string>;
	description: Nullable<string>;
};
export interface TaskMaster
{
	name: Nullable<string>;
	description: Nullable<string>;
	tasks: Nullable<string[]>;
	isActive: Nullable<boolean>;
	searchFilters: Nullable<DbFilters>;
	assignedTask: Nullable<string>;
	assignedAt: Nullable<number>;
	progress: Nullable<number>;
	feedback: Nullable<string>;
};
export interface Collection
{
	name: Nullable<string>;
	items: Nullable<string[]>;
	description: Nullable<string>;
};
export interface Task
{
	name: Nullable<string>;
	due: Nullable<number>;
	priority: Nullable<string>;
	notes: Nullable<string>;
	completed: Nullable<boolean>;
	completedAt: Nullable<number>;
	recurring: Nullable<boolean>;
	category: Nullable<string>;
};
export interface Reminder
{
	due: Nullable<number>;
	recurFrequency: Nullable<number>;
	acknowledgedAt: Nullable<number>;
	description: Nullable<string>;
	isActive: Nullable<boolean>;
}
export interface TaskCategory
{
	name: Nullable<string>;
}
export type Item<T> = T & ItemData;
