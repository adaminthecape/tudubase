import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { ArchetypeUtils } from "./ArchetypeUtils";

export enum EquipmentSlotType
{
	Helmet = 'Helmet',
	Armor = 'Armor',
	MainHand = 'MainHand',
	OffHand = 'OffHand',
	Gloves = 'Gloves',
	Belt = 'Belt',
	Boots = 'Boots',
	Necklace = 'Necklace',
	Cloak = 'Cloak',
	Ring = 'Ring',
}

export const fieldsForEquipmentType: FieldData[] = [
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
		key: 'icon',
		label: 'Icon',
		fieldType: FieldType.item,
		itemType: ItemTypes.ImageAsset,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'slots',
		label: 'Slots',
		fieldType: FieldType.multiSelect,
		options: Object.values(EquipmentSlotType)
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'healthModifier',
		label: 'Health',
		fieldType: FieldType.number,
		validation: {
			between: { min: -10, max: 20 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'manaModifier',
		label: 'Mana',
		fieldType: FieldType.number,
		validation: {
			between: { min: -10, max: 20 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'strengthModifier',
		label: 'Strength',
		fieldType: FieldType.number,
		validation: {
			between: { min: -10, max: 20 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'agilityModifier',
		label: 'Agility',
		fieldType: FieldType.number,
		validation: {
			between: { min: -10, max: 20 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'intelligenceModifier',
		label: 'Intelligence',
		fieldType: FieldType.number,
		validation: {
			between: { min: -10, max: 20 }
		}
	},
];

export interface EquipmentType
{
	name: string;
	description: Nullable<string>;
	icon: Nullable<string>;
	slots: Nullable<string[]>;
	healthModifier: Nullable<number>;
	manaModifier: Nullable<number>;
	strengthModifier: Nullable<number>;
	agilityModifier: Nullable<number>;
	intelligenceModifier: Nullable<number>;
}

export const ITEM_TYPE = ItemTypes.EquipmentType;
export const ITEM_FIELDS = fieldsForEquipmentType;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class EquipmentTypeArchetype extends ArchetypeHandler
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

export class EquipmentTypeHandler
	extends CustomItemHandler<EquipmentType>
	implements ItemHandler<EquipmentType>
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

	public getData(): Item<EquipmentType>
	{
		return super.getData();
	}

	public setData(data: Partial<EquipmentType>): void
	{
		super.setData(data);
	}
}
