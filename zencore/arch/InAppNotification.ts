import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { DrizzleHandler } from "../DrizzleInterface";
import { DbFilterOperator } from "../Filters";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, Item, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Utils, Uuid } from "../Utils";

export const fieldsForInAppNotification: FieldData[] = [
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
		key: 'message',
		label: 'Message',
		fieldType: FieldType.textarea,
		validation: {
			between: { max: 500 }
		}
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'date',
		label: 'Date',
		fieldType: FieldType.timestamp,
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
		key: 'readAt',
		label: 'Read',
		fieldType: FieldType.timestamp,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 'ca84b5a0-a0ae-425d-993a-4e63d235f222',
		typeId: 'Field',
		key: 'archivedAt',
		label: 'Archived',
		fieldType: FieldType.timestamp,
	}
];

export interface InAppNotification
{
	title: Nullable<string>;
	message: Nullable<string>;
	date: Nullable<number>;
	readAt: Nullable<number>;
	archivedAt: Nullable<number>;
}

export const ITEM_TYPE = ItemTypes.InAppNotification;
export const ITEM_FIELDS = fieldsForInAppNotification;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class InAppNotificationArchetype extends ArchetypeHandler
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

export class InAppNotificationHandler
	extends CustomItemHandler<InAppNotification>
	implements ItemHandler<InAppNotification>
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

	public getData(): Item<InAppNotification>
	{
		return super.getData();
	}

	public setData(data: Partial<InAppNotification>): void
	{
		super.setData(data);
	}

	public static async createNotification(
		data: Partial<InAppNotification>
	): Promise<InAppNotificationHandler | undefined>
	{
		const handler = new InAppNotificationHandler({
			id: Uuid.generateUuid(),
			db: new DrizzleHandler({}),
		});

		handler.setData(data);

		// validate that it is a valid notification
		const notification = handler.getData();

		if(
			!notification.title ||
			!notification.message ||
			!notification.date
		)
		{
			return undefined;
		}

		await handler.save();

		return handler;
	}

	public static async getUnreadNotifications(): Promise<InAppNotificationHandler[]>
	{
		const db = new DrizzleHandler({});
		const notifications = await db.selectMultiple({
			itemType: ITEM_TYPE,
			filters: [
				{
					key: 'readAt',
					operator: DbFilterOperator.isEqual,
					value: null,
				}
			],
		});

		return (notifications?.results || [])
			.map((notification) => (
				typeof notification.id === 'string' ?
					new InAppNotificationHandler({
						id: notification.id,
						db,
					}) :
					undefined
			))
			.filter((handler) => handler) as InAppNotificationHandler[];
	}
}
