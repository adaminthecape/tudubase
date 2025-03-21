// A TaskMaster periodically looks through existing Tasks, and picks one to
// assign to the user.
// In order to assign a Task, it needs to know which Tasks are available.
// A given TaskMaster might be restricted to certain kinds of tasks, so it
// should have search filters.
// It should also be able to assign a Task to a user, and track when it was
// assigned.
// It should be able to track the user's progress on the Task, and provide
// feedback.

import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { DbFilters } from "../Filters";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";

export const fieldsForTaskMaster: FieldData[] = [
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'name',
		label: 'Name',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'description',
		label: 'Description',
		fieldType: FieldType.textarea,
		validation: {
			between: { min: 0, max: 1000 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'tasks',
		label: 'Tasks',
		fieldType: FieldType.itemArray,
		itemType: 'Task',
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'isActive',
		label: 'Active',
		fieldType: FieldType.toggle,
		validation: {
			required: true
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'searchFilters',
		label: 'Search Filters',
		fieldType: FieldType.itemFilters,
		validation: {
			isItemFilterArray: true
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'assignedTask',
		label: 'Assigned Task',
		fieldType: FieldType.item,
		itemType: 'Task',
		validation: {
			isUuid: true
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'assignedAt',
		label: 'Assigned At',
		fieldType: FieldType.timestamp,
		validation: {
			isTimestamp: true
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'progress',
		label: 'Progress',
		fieldType: FieldType.number,
		validation: {
			between: { min: 0, max: 100 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'feedback',
		label: 'Feedback',
		fieldType: FieldType.textarea,
		validation: {
			between: { min: 0, max: 1000 }
		}
	}
];

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

export const ITEM_TYPE = ItemTypes.TaskMaster;
export const ITEM_FIELDS = fieldsForTaskMaster;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class TaskMasterArchetype extends ArchetypeHandler
{
	constructor(opts: ArchetypeOpts)
	{
		super({
			id: opts.id,
			db: dummyDatabase,
			fieldsArray: ITEM_FIELDS,
		});
	}

	public async load()
	{
		return this.getData();
	}
}

export class TaskMasterHandler
	extends CustomItemHandler<TaskMaster>
	implements ItemHandler<TaskMaster>
{
	public typeId: string = ITEM_TYPE;

	constructor(opts: Omit<CustomItemOpts, 'definition'>)
	{
		super({
			id: opts.id,
			db: opts.db,
			fieldDataArray: ITEM_FIELDS,
			definition: {
				id: Uuid.generateUuid(),
				typeId: ItemTypes.Archetype,
				name: ITEM_TYPE,
				itemType: ITEM_TYPE,
				attachedFields: ITEM_FIELDS.map((field) => field.id),
				scopeId: null,
			},
			itemType: ITEM_TYPE,
		});
	}

	public getData(): Item<TaskMaster>
	{
		return super.getData();
	}

	public setData(data: Partial<TaskMaster>): void
	{
		super.setData(data);
	}
}
