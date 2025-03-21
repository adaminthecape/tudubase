CREATE ROLE "admin" WITH CREATEDB CREATEROLE;--> statement-breakpoint
CREATE ROLE "user";--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "characters_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"name" text NOT NULL,
	"health" integer NOT NULL,
	"mana" integer NOT NULL,
	"strength" integer NOT NULL,
	"agility" integer NOT NULL,
	"intelligence" integer NOT NULL,
	"armor" text,
	"main_hand" text,
	"off_hand" text,
	"main_armor" text,
	"helmet" text,
	"gloves" text,
	"boots" text,
	"necklace" text,
	"ring" text,
	"belt" text,
	"cloak" text
);
--> statement-breakpoint
ALTER TABLE "characters_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "collections_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"name" text NOT NULL,
	"items" text,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "collections_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "equipment_types_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"name" text NOT NULL,
	"description" text,
	"icon" uuid,
	"slots" text
);
--> statement-breakpoint
ALTER TABLE "equipment_types_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "equipments_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"name" text,
	"description" text,
	"weight" integer,
	"value" integer,
	"type" text
);
--> statement-breakpoint
ALTER TABLE "equipments_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "image_assets_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"title" text NOT NULL,
	"description" text NOT NULL,
	"imagePath" text NOT NULL,
	"tags" text
);
--> statement-breakpoint
ALTER TABLE "image_assets_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "in_app_notifications_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"title" text,
	"message" text,
	"date" integer,
	"read_at" integer,
	"archived_at" integer
);
--> statement-breakpoint
ALTER TABLE "in_app_notifications_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"username" text NOT NULL,
	"description" text NOT NULL,
	"joined_at" integer NOT NULL,
	"log_in_count" integer NOT NULL,
	"last_log_in" integer NOT NULL,
	"profile_pic" text NOT NULL,
	"profile_background" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reminders_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"due" integer NOT NULL,
	"recur_frequency" integer,
	"acknowledged_at" integer,
	"description" text,
	"is_active" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reminders_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rewards_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"name" text,
	"description" text,
	"value" integer,
	"imageUrl" text,
	"category" text,
	"rarity" text,
	"sortValue" integer
);
--> statement-breakpoint
ALTER TABLE "rewards_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tags_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"name" text,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "tags_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "task_masters_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"name" text,
	"description" text,
	"tasks" text,
	"is_active" boolean,
	"search_filters" text,
	"assigned_task" uuid,
	"assigned_at" integer,
	"progress" integer,
	"feedback" text
);
--> statement-breakpoint
ALTER TABLE "task_masters_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tasks_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742515238,
	"updated_at" integer DEFAULT 1742515238,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"title" text,
	"due" integer,
	"priority" text,
	"notes" text,
	"completed" boolean,
	"completedAt" integer,
	"recurring" boolean,
	"tags" uuid[]
);
--> statement-breakpoint
ALTER TABLE "tasks_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "characters_table" ADD CONSTRAINT "characters_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections_table" ADD CONSTRAINT "collections_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_types_table" ADD CONSTRAINT "equipment_types_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipments_table" ADD CONSTRAINT "equipments_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_assets_table" ADD CONSTRAINT "image_assets_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "in_app_notifications_table" ADD CONSTRAINT "in_app_notifications_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles_table" ADD CONSTRAINT "profiles_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders_table" ADD CONSTRAINT "reminders_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards_table" ADD CONSTRAINT "rewards_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags_table" ADD CONSTRAINT "tags_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_masters_table" ADD CONSTRAINT "task_masters_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks_table" ADD CONSTRAINT "tasks_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;