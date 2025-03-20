import { integer, pgSchema, uuid } from "drizzle-orm/pg-core";
import { Utils, Uuid } from "../Utils";

const authSchema = pgSchema("auth");

export const Users = authSchema.table("users", {
	id: uuid("id").primaryKey(),
});

export const defaultItemSchema = {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => Uuid.generateUuid()),
	createdAt: integer('created_at')
		.default(Utils.getCurrentSecond()),
	updatedAt: integer('updated_at')
		.default(Utils.getCurrentSecond())
		.$onUpdate(() => Utils.getCurrentSecond()),
	createdBy: integer('created_by')
		.default(1)
		.references(() => Users.id, { onDelete: 'cascade' }),
};