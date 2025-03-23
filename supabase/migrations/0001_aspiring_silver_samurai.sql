CREATE TABLE "task_activities_table" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" integer DEFAULT 1742683518,
	"updated_at" integer DEFAULT 1742683518,
	"created_by" uuid DEFAULT '00000000-0000-0000-0000-000000000000',
	"task_id" text,
	"activity_type" text,
	"description" text,
	"target_user_id" boolean
);
--> statement-breakpoint
ALTER TABLE "task_activities_table" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "characters_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "characters_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "collections_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "collections_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "equipment_types_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "equipment_types_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "equipments_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "equipments_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "image_assets_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "image_assets_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "in_app_notifications_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "in_app_notifications_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "profiles_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "profiles_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "reminders_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "reminders_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "rewards_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "rewards_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "tags_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "tags_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "task_masters_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "task_masters_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "tasks_table" ALTER COLUMN "created_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "tasks_table" ALTER COLUMN "updated_at" SET DEFAULT 1742683518;--> statement-breakpoint
ALTER TABLE "task_activities_table" ADD CONSTRAINT "task_activities_table_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;