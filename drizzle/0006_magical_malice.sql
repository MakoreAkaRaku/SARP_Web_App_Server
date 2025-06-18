ALTER TABLE "schedule" RENAME COLUMN "peripheral_state_id" TO "peripheral_id";--> statement-breakpoint
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_peripheral_state_id_peripheral_id_fk";
--> statement-breakpoint
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_peripheral_id_peripheral_id_fk" FOREIGN KEY ("peripheral_id") REFERENCES "public"."peripheral"("id") ON DELETE no action ON UPDATE no action;