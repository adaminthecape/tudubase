import { pgTable, integer, serial, text } from "drizzle-orm/pg-core";
import { ArchetypeHandler } from "../Archetype";
import { CustomItemHandler } from "../CustomItem";
import { ArchetypeOpts, CustomItemOpts, FieldData, FieldType, ItemHandler, ItemTypes, Nullable } from "../ItemTypes";
import { RamDatabase } from "../MemoryDatabase";
import { Uuid } from "../Utils";
import { defaultItemSchema } from "./itemSchema";

export const fieldsForProfile: FieldData[] = [
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'username',
		label: 'Name',
		fieldType: FieldType.text,
		validation: {
			required: true,
			between: { min: 1, max: 100 }
		},
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
		},
	},
	{
		key: 'joinedAt',
		label: 'Started',
		fieldType: FieldType.timestamp,
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'logInCount',
		label: 'Log Ins',
		fieldType: FieldType.number,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'lastLogIn',
		label: 'Last Log In',
		fieldType: FieldType.timestamp,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'profilePic',
		label: 'Profile Picture',
		fieldType: FieldType.text,
	},
	{
		id: Uuid.generateUuid(),
		createdAt: 1742414442,
		updatedAt: 1742414442,
		createdBy: 1,
		typeId: 'Field',
		key: 'profileBackground',
		label: 'Profile Background',
		fieldType: FieldType.item,
	},
];

export interface Profile
{
	username: Nullable<string>;
	description: Nullable<string>;
	joinedAt: Nullable<number>;
	logInCount: Nullable<number>;
	lastLogIn: Nullable<number>;
	profilePic: Nullable<string>;
	profileBackground: Nullable<string>;
}

export const profilesTable = pgTable('profiles_table', {
	...defaultItemSchema,
	username: text('username').notNull(),
	description: text('description').notNull(),
	joinedAt: integer('joined_at').notNull(),
	logInCount: integer('log_in_count').notNull(),
	lastLogIn: integer('last_log_in').notNull(),
	profilePic: text('profile_pic').notNull(),
	profileBackground: text('profile_background').notNull(),
}).enableRLS();

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;

export const ITEM_TYPE = ItemTypes.Profile;
export const ITEM_FIELDS = fieldsForProfile;

// Archetypes are fixed definitions for item types, used for validation, so we
// are not allowing any changes to them, nor to their fields.
const dummyDatabase = new RamDatabase({});

export class ProfileArchetype extends ArchetypeHandler
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

export class ProfileHandler
	extends CustomItemHandler<Profile>
	implements ItemHandler<Profile>
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
}
