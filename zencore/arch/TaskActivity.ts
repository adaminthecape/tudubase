import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable, TaskActivity } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { ArchetypeUtils } from "./ArchetypeUtils";

export const fieldsForTaskActivity: FieldData[] = [
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'taskId',
		label: 'Task ID',
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
		key: 'activityType',
		label: 'Activity Type',
		fieldType: FieldType.dropdown,
		options: [
			'Created',
			'Updated',
			'Deleted',
			'Started',
			'Completed',
			'Activated',
			'Deactivated',
			'MasterAssigned',
			'MasterDropped',
			'MasterCheckedIn',
			'AcknowledgedMaster',
			'MasterCompleted',
			'MasterFailed',
			'OfferedReward',
			'RerolledReward',
			'AcceptedReward',
		],
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
		key: 'targetUserId',
		label: 'Target User ID',
		fieldType: FieldType.text,
	}
];

export const ITEM_TYPE = ItemTypes.TaskActivity;
export const ITEM_FIELDS = fieldsForTaskActivity;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class TaskActivityArchetype extends ArchetypeHandler
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

export class TaskActivityHandler
	extends CustomItemHandler<TaskActivity>
	implements ItemHandler<TaskActivity>
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

	public getData(): Item<TaskActivity>
	{
		return super.getData();
	}

	public setData(data: Partial<TaskActivity>): void
	{
		super.setData(data);
	}
}
