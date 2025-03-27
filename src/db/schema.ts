import { ItemTypes, TaskActivity } from "@/zencore/ItemTypes";
import { Utils, Uuid } from "@/zencore/Utils";
import { boolean, integer, PgColumn, pgRole, pgSchema, pgTable, PgTable, text, uuid } from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

export const Users = authSchema.table("users", {
	id: uuid("id").primaryKey().notNull(),
});

export const defaultItemSchema = {
	id: uuid('id')
		.primaryKey()
		.$default(() => Uuid.generateUuid()),
	// TODO: enable & migrate this later
	// typeId: uuid('type_id')
	// 	.primaryKey()
	// 	.$default(() => 'Item'),
	createdAt: integer('created_at')
		.default(Utils.getCurrentSecond()),
	updatedAt: integer('updated_at')
		.default(Utils.getCurrentSecond())
		.$onUpdate(() => Utils.getCurrentSecond()),
	createdBy: uuid('created_by')
		.default('00000000-0000-0000-0000-000000000000')
		.references(() => Users.id, { onDelete: 'cascade' }),
	// definitionId: uuid('definition_id'),
};

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

export const collectionsTable = pgTable('collections_table', {
	...defaultItemSchema,
	name: text('name').notNull(),
	items: text('items'),
	description: text('description'),
}).enableRLS();

export type InsertCollection = typeof collectionsTable.$inferInsert;
export type SelectCollection = typeof collectionsTable.$inferSelect;

export const equipmentsTable = pgTable('equipments_table', {
	...defaultItemSchema,
	name: text('name'),
	description: text('description'),
	weight: integer('weight'),
	value: integer('value'),
	type: text('type'),
}).enableRLS();

export type InsertEquipment = typeof equipmentsTable.$inferInsert;
export type SelectEquipment = typeof equipmentsTable.$inferSelect;

export const equipmentTypesTable = pgTable('equipment_types_table', {
	...defaultItemSchema,
	name: text('name').notNull(),
	description: text('description'),
	icon: uuid('icon'),
	slots: text('slots'),
}).enableRLS();

export type InsertEquipmentType = typeof equipmentTypesTable.$inferInsert;
export type SelectEquipmentType = typeof equipmentTypesTable.$inferSelect;

export const imageAssetsTable = pgTable('image_assets_table', {
	...defaultItemSchema,
	title: text('title').notNull(),
	description: text('description').notNull(),
	imagePath: text('imagePath').notNull(),
	tags: text('tags'),
}).enableRLS();

export type InsertImageAsset = typeof imageAssetsTable.$inferInsert;
export type SelectImageAsset = typeof imageAssetsTable.$inferSelect;

export const inAppNotificationsTable = pgTable('in_app_notifications_table', {
	...defaultItemSchema,
	title: text('title'),
	message: text('message'),
	date: integer('date').$default(() => Utils.getCurrentSecond()),
	readAt: integer('read_at'),
	archivedAt: integer('archived_at'),
}).enableRLS();

export type InsertInAppNotification = typeof inAppNotificationsTable.$inferInsert;
export type SelectInAppNotification = typeof inAppNotificationsTable.$inferSelect;

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

export const remindersTable = pgTable('reminders_table', {
	...defaultItemSchema,
	due: integer('due').notNull(),
	recurFrequency: integer('recur_frequency'),
	acknowledgedAt: integer('acknowledged_at'),
	description: text('description'),
	isActive: boolean('is_active').notNull().default(false),
}).enableRLS();

export type InsertReminder = typeof remindersTable.$inferInsert;
export type SelectReminder = typeof remindersTable.$inferSelect;

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

export const tagsTable = pgTable('tags_table', {
	...defaultItemSchema,
	name: text('name'),
	description: text('description'),
}).enableRLS();

export type InsertTag = typeof tagsTable.$inferInsert;
export type SelectTag = typeof tagsTable.$inferSelect;

export const tasksTable = pgTable('tasks_table', {
	...defaultItemSchema,
	title: text('title'),
	due: integer('due'),
	priority: text('priority'),
	notes: text('notes'),
	completed: boolean('completed'),
	completedAt: integer('completedAt'),
	recurring: boolean('recurring'),
	tags: uuid('tags').array(),
	activity: uuid('activity').array(),
}).enableRLS();

export type InsertTask = typeof tasksTable.$inferInsert;
export type SelectTask = typeof tasksTable.$inferSelect;

export const taskMastersTable = pgTable('task_masters_table', {
	...defaultItemSchema,
	name: text('name'),
	description: text('description'),
	tasks: text('tasks'),
	isActive: boolean('is_active'),
	searchFilters: text('search_filters'),
	assignedTask: uuid('assigned_task'),
	assignedAt: integer('assigned_at'),
	progress: integer('progress'),
	feedback: text('feedback'),
}).enableRLS();

export type InsertTaskMaster = typeof taskMastersTable.$inferInsert;
export type SelectTaskMaster = typeof taskMastersTable.$inferSelect;

export const taskActivitiesTable = pgTable('task_activities_table', {
	...defaultItemSchema,
	taskId: uuid('task_id'),
	activityType: text('activity_type'),
	description: text('description'),
	targetUserId: text('target_user_id'),
}).enableRLS();

export type InsertTaskActivity = typeof taskActivitiesTable.$inferInsert;
export type SelectTaskActivity = typeof taskActivitiesTable.$inferSelect;

// ROLES

export const admin = pgRole('admin', {
	createRole: true,
	createDb: true,
	inherit: true,
});

export const user = pgRole('user', {
	inherit: true,
});

export function getTableForItemType(itemType: string): ({
	table?: PgTable | undefined;
	idColumn?: PgColumn | undefined;
})
{
	switch(itemType)
	{
		case ItemTypes.Archetype:
			return { table: undefined, idColumn: undefined };
		case ItemTypes.Character:
			return { table: charactersTable, idColumn: charactersTable.id };
		case ItemTypes.Collection:
			return { table: collectionsTable, idColumn: collectionsTable.id };
		case ItemTypes.CustomItem:
			return { table: undefined, idColumn: undefined };
		case ItemTypes.Equipment:
			return { table: equipmentsTable, idColumn: equipmentsTable.id };
		case ItemTypes.EquipmentType:
			return { table: equipmentTypesTable, idColumn: equipmentTypesTable.id };
		case ItemTypes.Field:
			return { table: undefined, idColumn: undefined };
		case ItemTypes.InAppNotification:
			return { table: inAppNotificationsTable, idColumn: inAppNotificationsTable.id };
		case ItemTypes.ImageAsset:
			return { table: imageAssetsTable, idColumn: imageAssetsTable.id };
		case ItemTypes.Profile:
			return { table: profilesTable, idColumn: profilesTable.id };
		case ItemTypes.Reminder:
			return { table: remindersTable, idColumn: remindersTable.id };
		case ItemTypes.Reward:
			return { table: rewardsTable, idColumn: rewardsTable.id };
		case ItemTypes.Tag:
			return { table: tagsTable, idColumn: tagsTable.id };
		case ItemTypes.Task:
			return { table: tasksTable, idColumn: tasksTable.id };
		case ItemTypes.TaskActivity:
			return { table: taskActivitiesTable, idColumn: taskActivitiesTable.id };
		case ItemTypes.TaskMaster:
			return { table: taskMastersTable, idColumn: taskMastersTable.id };
		default:
			return { table: undefined, idColumn: undefined };
	}
}