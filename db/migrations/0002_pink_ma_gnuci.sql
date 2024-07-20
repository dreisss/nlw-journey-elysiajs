CREATE TABLE IF NOT EXISTS "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128),
	"email" varchar(128) NOT NULL,
	"is_confirmed" boolean DEFAULT false,
	"is_owner" boolean DEFAULT false,
	"trip_id" uuid NOT NULL
);
