import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { defaultItemSchema } from "./itemSchema";

export const fieldsForImageAsset: FieldData[] = [
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
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
		createdBy: 1,
		typeId: 'Field',
		key: 'description',
		label: 'Description',
		fieldType: FieldType.textarea,
		validation: {
			required: true,
			between: { max: 500 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'imagePath',
		label: 'Image Path',
		fieldType: FieldType.text,
		validation: {
			required: true,
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'tags',
		label: 'Tags',
		fieldType: FieldType.itemArray,
	}
];

export interface ImageAsset
{
	title: Nullable<string>;
	description: Nullable<string>;
	imagePath: Nullable<string>;
	tags: Nullable<string[]>;
};

export const imageAssetsTable = pgTable('image_assets_table', {
	...defaultItemSchema,
	title: text('title').notNull(),
	description: text('description').notNull(),
	imagePath: text('imagePath').notNull(),
	tags: text('tags'),
}).enableRLS();

export type InsertImageAsset = typeof imageAssetsTable.$inferInsert;
export type SelectImageAsset = typeof imageAssetsTable.$inferSelect;

export const ITEM_TYPE = ItemTypes.ImageAsset;
export const ITEM_FIELDS = fieldsForImageAsset;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class ImageAssetArchetype extends ArchetypeHandler
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

export class ImageAssetHandler
	extends CustomItemHandler<ImageAsset>
	implements ItemHandler<ImageAsset>
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

	public getData(): Item<ImageAsset>
	{
		return super.getData();
	}

	public setData(data: Partial<ImageAsset>): void
	{
		super.setData(data);
	}
}
