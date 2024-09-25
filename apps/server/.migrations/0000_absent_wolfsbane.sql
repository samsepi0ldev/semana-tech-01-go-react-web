CREATE TABLE IF NOT EXISTS "asks" (
	"id" text PRIMARY KEY NOT NULL,
	"room_id" text NOT NULL,
	"description" text NOT NULL,
	"answered" boolean DEFAULT false,
	"reactions" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "asks" ADD CONSTRAINT "asks_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
