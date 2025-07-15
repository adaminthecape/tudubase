import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { ArchetypeUtils } from "./ArchetypeUtils";

export const fieldsForImageAsset: FieldData[] = [
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
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
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
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
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
			definition: ArchetypeUtils.getDummyArchetype(ITEM_TYPE, ITEM_FIELDS),
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
