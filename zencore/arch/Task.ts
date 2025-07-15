import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeData, ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { ArchetypeUtils } from "./ArchetypeUtils";

export const fieldsForTask: FieldData[] = [
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'title',
		label: 'Title',
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
		key: 'due',
		label: 'Due',
		fieldType: FieldType.timestamp,
	},
	{
		id: '697971f8-fd3f-45ea-a2c5-038588985ef5',
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'priority',
		label: 'Priority',
		fieldType: FieldType.dropdown,
		options: ['low', 'medium', 'high'],
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'notes',
		label: 'Notes',
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
		key: 'completed',
		label: 'Completed',
		fieldType: FieldType.toggle,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'completedAt',
		label: 'Completed At',
		fieldType: FieldType.timestamp,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'recurring',
		label: 'Recurring',
		fieldType: FieldType.toggle,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'tags',
		label: 'Tags',
		fieldType: FieldType.itemArray,
		itemType: 'Tag',
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'activity',
		label: 'Activity',
		fieldType: FieldType.itemArray,
		itemType: ItemTypes.TaskActivity,
	},
];

export interface Task
{
	title: Nullable<string>;
	due: Nullable<number>;
	priority: Nullable<string>;
	notes: Nullable<string>;
	completed: Nullable<boolean>;
	completedAt: Nullable<number>;
	recurring: Nullable<boolean>;
	tags: Nullable<string[]>;
};

export const ITEM_TYPE = ItemTypes.Task;
export const ITEM_FIELDS = fieldsForTask;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class TaskArchetype extends ArchetypeHandler
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

export class TaskHandler
	extends CustomItemHandler<Task>
	implements ItemHandler<Task>
{
	public typeId: string = ITEM_TYPE;

	constructor(opts: Omit<CustomItemOpts, 'definition'>)
	{
		super({
			id: opts.id,
			db: opts.db,
			fieldDataArray: ITEM_FIELDS,
			definition: ArchetypeUtils.getDummyArchetype(ITEM_TYPE, ITEM_FIELDS),
			itemType: ITEM_TYPE,
		});
	}

	public getData(): Item<Task>
	{
		return super.getData();
	}

	public setData(data: Partial<Task>): void
	{
		super.setData(data);
	}
}
