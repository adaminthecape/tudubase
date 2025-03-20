import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { defaultItemSchema } from "./itemSchema";

export const fieldsForCollection: FieldData[] = [
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
		key: 'items',
		label: 'Items',
		fieldType: FieldType.repeater,
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
		validation: { between: { max: 1000 } }
	}
];

export const collectionsTable = pgTable('collections_table', {
	...defaultItemSchema,
	name: text('name').notNull(),
	items: text('items'),
	description: text('description'),
}).enableRLS();

export type InsertCollection = typeof collectionsTable.$inferInsert;
export type SelectCollection = typeof collectionsTable.$inferSelect;

export interface Collection
{
	name: Nullable<string>;
	items: Nullable<string[]>;
	description: Nullable<string>;
};

export const ITEM_TYPE = ItemTypes.Collection;
export const ITEM_FIELDS = fieldsForCollection;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class CollectionArchetype extends ArchetypeHandler
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

export class CollectionHandler
	extends CustomItemHandler<Collection>
	implements ItemHandler<Collection>
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
	
	public getData(): Item<Collection>
	{
		return super.getData();
	}

	public setData(data: Partial<Collection>): void
	{
		super.setData(data);
	}
}
