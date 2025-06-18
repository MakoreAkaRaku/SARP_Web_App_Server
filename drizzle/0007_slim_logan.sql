ALTER TABLE "peripheral_state" ADD COLUMN "ticked_time" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "peripheral_state" ADD COLUMN "ticks_to_stop" integer DEFAULT 1;