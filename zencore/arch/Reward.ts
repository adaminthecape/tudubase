import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { defaultItemSchema } from "./itemSchema";

export const fieldsForReward: FieldData[] = [
	// a Reward is something given to the user as a reward for completing a Task
	// or a Goal. It might be a physical item, or a digital item, or a service.
	// It should have a name, a description, and a value.
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
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
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
		createdBy: 1,
		typeId: 'Field',
		key: 'value',
		label: 'Value',
		fieldType: FieldType.number,
		validation: {
			between: { min: 0, max: 1000 }
		}
	},
	// It should have an image as well
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'imageUrl',
		label: 'Image',
		fieldType: FieldType.text,
		validation: {
			between: { max: 1000 }
		}
	},
	// It should have a category
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'category',
		label: 'Category',
		fieldType: FieldType.item,
		itemType: 'RewardCategory',
	},
	// It should have a rarity
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
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
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'sortValue',
		label: 'Sort Value',
		fieldType: FieldType.number,
		validation: {
			between: { min: 0, max: 10000 }
		}
	},
];

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

export const rewardsTable = pgTable('rewards_table', {
	...defaultItemSchema,
	name: text('name'),
	description: text('description'),
	value: integer('value'),
	imageUrl: text('imageUrl'),
	category: text('category'),
	rarity: text('rarity'),
	sortValue: integer('sortValue'),
}).enableRLS();

export type InsertReward = typeof rewardsTable.$inferInsert;
export type SelectReward = typeof rewardsTable.$inferSelect;

export const ITEM_TYPE = ItemTypes.Reward;
export const ITEM_FIELDS = fieldsForReward;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class RewardArchetype extends ArchetypeHandler
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

export class RewardHandler
	extends CustomItemHandler<Reward>
	implements ItemHandler<Reward>
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
	
	public getData(): Item<Reward>
	{
		return super.getData();
	}

	public setData(data: Partial<Reward>): void
	{
		super.setData(data);
	}
}
