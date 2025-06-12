CREATE TABLE "api_token" (
	"token_api" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_uuid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data" (
	"id" serial PRIMARY KEY NOT NULL,
	"peripheral_id" integer NOT NULL,
	"data_type" text NOT NULL,
	"value" jsonb NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_name" text NOT NULL,
	"owner_group" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "module" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alias" text NOT NULL,
	"token_api" uuid NOT NULL,
	"belong_group" integer,
	"last_seen" timestamp
);
--> statement-breakpoint
CREATE TABLE "notification_body" (
	"id" serial PRIMARY KEY NOT NULL,
	"body" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" serial PRIMARY KEY NOT NULL,
	"notification_type" text NOT NULL,
	"notification_date" timestamp DEFAULT now() NOT NULL,
	"description_id" integer NOT NULL,
	"peripheral_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "peripheral_state" (
	"peripheral_id" integer PRIMARY KEY NOT NULL,
	"state" text DEFAULT 'off' NOT NULL,
	"last_modified" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "peripheral" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_descr" text,
	"peripheral_type" text NOT NULL,
	"parent_module" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_type" text,
	CONSTRAINT "permission_role_type_unique" UNIQUE("role_type")
);
--> statement-breakpoint
CREATE TABLE "profile_pic" (
	"id" serial PRIMARY KEY NOT NULL,
	"pic_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"peripheral_state_id" integer NOT NULL,
	"freq_type" integer NOT NULL,
	"freq_interval" integer DEFAULT 0 NOT NULL,
	"freq_subday_type" integer NOT NULL,
	"freq_subday_interval" integer DEFAULT 0 NOT NULL,
	"freq_relative_interval" integer DEFAULT 0 NOT NULL,
	"factor" integer DEFAULT 0 NOT NULL,
	"active_start_date" integer DEFAULT 0 NOT NULL,
	"active_end_date" integer DEFAULT 0 NOT NULL,
	"active_start_time" integer DEFAULT 0 NOT NULL,
	"active_end_time" integer DEFAULT 0 NOT NULL,
	"enabled" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"pwd" text NOT NULL,
	"email" text NOT NULL,
	"permit_id" integer NOT NULL,
	"registered_on" timestamp DEFAULT now() NOT NULL,
	"profile_pic_id" integer,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "api_token" ADD CONSTRAINT "api_token_user_uuid_user_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."user"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data" ADD CONSTRAINT "data_peripheral_id_peripheral_id_fk" FOREIGN KEY ("peripheral_id") REFERENCES "public"."peripheral"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_owner_group_user_uuid_fk" FOREIGN KEY ("owner_group") REFERENCES "public"."user"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module" ADD CONSTRAINT "module_token_api_api_token_token_api_fk" FOREIGN KEY ("token_api") REFERENCES "public"."api_token"("token_api") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module" ADD CONSTRAINT "module_belong_group_group_id_fk" FOREIGN KEY ("belong_group") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_description_id_notification_body_id_fk" FOREIGN KEY ("description_id") REFERENCES "public"."notification_body"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_peripheral_id_peripheral_id_fk" FOREIGN KEY ("peripheral_id") REFERENCES "public"."peripheral"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peripheral_state" ADD CONSTRAINT "peripheral_state_peripheral_id_peripheral_id_fk" FOREIGN KEY ("peripheral_id") REFERENCES "public"."peripheral"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "peripheral" ADD CONSTRAINT "peripheral_parent_module_module_uuid_fk" FOREIGN KEY ("parent_module") REFERENCES "public"."module"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_peripheral_state_id_peripheral_id_fk" FOREIGN KEY ("peripheral_state_id") REFERENCES "public"."peripheral"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_permit_id_permission_id_fk" FOREIGN KEY ("permit_id") REFERENCES "public"."permission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_profile_pic_id_profile_pic_id_fk" FOREIGN KEY ("profile_pic_id") REFERENCES "public"."profile_pic"("id") ON DELETE no action ON UPDATE no action;