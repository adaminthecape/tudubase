import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { defaultItemSchema } from "./itemSchema";

export const fieldsForCharacter: FieldData[] = [
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
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
		createdBy: 1,
		typeId: 'Field',
		key: 'cloak',
		label: 'Cloak',
		fieldType: FieldType.item,
		itemType: ItemTypes.Equipment,
	},
];

export interface Character
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

export const charactersTable = pgTable('characters_table', {
	...defaultItemSchema,
	name: text('name').notNull(),
	health: integer('health').notNull(),
	mana: integer('mana').notNull(),
	strength: integer('strength').notNull(),
	agility: integer('agility').notNull(),
	intelligence: integer('intelligence').notNull(),
	armor: text('armor'),
	mainHand: text('main_hand'),
	offHand: text('off_hand'),
	mainArmor: text('main_armor'),
	helmet: text('helmet'),
	gloves: text('gloves'),
	boots: text('boots'),
	necklace: text('necklace'),
	ring: text('ring'),
	belt: text('belt'),
	cloak: text('cloak'),
}).enableRLS();

export type InsertCharacter = typeof charactersTable.$inferInsert;
export type SelectCharacter = typeof charactersTable.$inferSelect;

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

	public getData(): Item<Character>
	{
		return super.getData();
	}

	public setData(data: Partial<Character>): void
	{
		super.setData(data);
	}
}
