CREATE TABLE "daily_LiveSurvey" (
	"id" serial NOT NULL,
	"count" bigint DEFAULT 0,
	"create_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "daily_visitor" DROP CONSTRAINT "daily_visitor_day_start_unique";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'daily_visitor'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "daily_visitor" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "answer" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "survey" ADD COLUMN "created_at" timestamp DEFAULT now();