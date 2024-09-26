ALTER TABLE "asks" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "asks" ALTER COLUMN "created_at" SET NOT NULL;