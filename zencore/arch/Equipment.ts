import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import {
	ArchetypeOpts,
	CustomItemOpts,
	FieldData,
	FieldType,
	Item,
	ItemHandler,
	ItemTypes,
	Nullable,
} from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { ArchetypeUtils } from "./ArchetypeUtils";

export const fieldsForEquipment: FieldData[] = [
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
		key: 'weight',
		label: 'Weight',
		fieldType: FieldType.number,
		validation: {
			required: true,
			between: { min: 0, max: 100 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'value',
		label: 'Value',
		fieldType: FieldType.number,
		validation: {
			required: true,
			between: { min: 0, max: 10000 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'type',
		label: 'Type',
		fieldType: FieldType.item,
		itemType: ItemTypes.EquipmentType,
		validation: {
			required: true
		}
	},
];

export interface Equipment
{
	name: Nullable<string>;
	description: Nullable<string>;
	weight: Nullable<number>;
	value: Nullable<number>;
	type: Nullable<string>;
}

export const ITEM_TYPE = ItemTypes.Equipment;
export const ITEM_FIELDS = fieldsForEquipment;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class EquipmentArchetype extends ArchetypeHandler
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

export class EquipmentHandler
	extends CustomItemHandler<Equipment>
	implements ItemHandler<Equipment>
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

	public getData(): Item<Equipment>
	{
		return super.getData();
	}

	public setData(data: Partial<Equipment>): void
	{
		super.setData(data);
	}
}
