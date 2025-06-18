ALTER TABLE "schedule" ADD COLUMN "cron_expression" text NOT NULL;--> statement-breakpoint
ALTER TABLE "schedule" ADD COLUMN "last_run" timestamp;--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "freq_type";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "freq_interval";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "freq_subday_type";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "freq_subday_interval";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "freq_relative_interval";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "factor";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "active_start_date";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "active_end_date";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "active_start_time";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "active_end_time";--> statement-breakpoint
ALTER TABLE "schedule" DROP COLUMN "enabled";