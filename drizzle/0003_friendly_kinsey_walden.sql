CREATE TABLE "peripheral_type" (
	"type" text PRIMARY KEY NOT NULL,
	"data_type" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "peripheral" RENAME COLUMN "peripheral_type" TO "p_type";--> statement-breakpoint
ALTER TABLE "peripheral" ADD CONSTRAINT "peripheral_p_type_peripheral_type_type_fk" FOREIGN KEY ("p_type") REFERENCES "public"."peripheral_type"("type") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data" DROP COLUMN "data_type";