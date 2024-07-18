CREATE TABLE IF NOT EXISTS "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"destination" varchar(128),
	"is_confirmed" boolean DEFAULT false NOT NULL,
	"starts_at" date NOT NULL,
	"ends_at" date NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
