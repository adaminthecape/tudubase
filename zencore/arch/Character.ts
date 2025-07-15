import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { ArchetypeUtils } from "./ArchetypeUtils";
import { z } from 'zod';

export const fieldsForCharacter: FieldData[] = [
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
	// Fields representing character stats
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'health',
		label: 'Health',
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
		key: 'mana',
		label: 'Mana',
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
		key: 'strength',
		label: 'Strength',
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
		key: 'agility',
		label: 'Agility',
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
		key: 'intelligence',
		label: 'Intelligence',
		fieldType: FieldType.number,
		validation: {
			required: true,
			between: { min: 0, max: 100 }
		}
	},
	// Fields representing loadout items, e.g. weapons & armor
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'armor',
		label: 'Armor',
		fieldType: FieldType.item,
		itemType: 'Armor',
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
		key: 'mainHand',
		label: 'Main Hand',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'offHand',
		label: 'Off Hand',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'mainArmor',
		label: 'Armor',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'helmet',
		label: 'Helmet',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'gloves',
		label: 'Gloves',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'boots',
		label: 'Off Hand',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'necklace',
		label: 'Necklace',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'ring',
		label: 'Ring',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'belt',
		label: 'Belt',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'cloak',
		label: 'Cloak',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
];

interface _Character
{
	name: Nullable<string>;
	health: Nullable<number>;
	mana: Nullable<number>;
	strength: Nullable<number>;
	agility: Nullable<number>;
	intelligence: Nullable<number>;
	armor: Nullable<string>;
	mainHand: Nullable<string>;
	offHand: Nullable<string>;
	mainArmor: Nullable<string>;
	helmet: Nullable<string>;
	gloves: Nullable<string>;
	boots: Nullable<string>;
	necklace: Nullable<string>;
	ring: Nullable<string>;
	belt: Nullable<string>;
	cloak: Nullable<string>;
}

export const ITEM_TYPE = ItemTypes.Character;
export const ITEM_FIELDS = fieldsForCharacter;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class CharacterArchetype extends ArchetypeHandler
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

const zodSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	health: z.number().min(0).max(100).optional(),
	mana: z.number().min(0).max(100).optional(),
	strength: z.number().min(0).max(100).optional(),
	agility: z.number().min(0).max(100).optional(),
	intelligence: z.number().min(0).max(100).optional(),
	armor: z.string().optional(),
	mainHand: z.string().optional(),
	offHand: z.string().optional(),
	mainArmor: z.string().optional(),
	helmet: z.string().optional(),
	gloves: z.string().optional(),
	boots: z.string().optional(),
	necklace: z.string().optional(),
	ring: z.string().optional(),
	belt: z.string().optional(),
	cloak: z.string().optional(),
});
export type Character = z.infer<typeof zodSchema>;

export class CharacterHandler
	extends CustomItemHandler<Character>
	implements ItemHandler<Character>
{
	public typeId: string = ITEM_TYPE;

	constructor(opts: Omit<CustomItemOpts, 'definition'>)
	{
		super({
			id: opts.id,
			db: opts.db,
			// fieldDataArray: ITEM_FIELDS,
			definition: ArchetypeUtils.getDummyArchetype(ITEM_TYPE, ITEM_FIELDS),
			itemType: ITEM_TYPE,
			zodSchema,
		});
	}

	public getData(): Item<Character>
	{
		return super.getData();
	}

	public setData(data: Partial<Character>): void
	{
		super.setData(data);
	}
}
