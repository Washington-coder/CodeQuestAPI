CREATE TABLE "user_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"languages" text[] DEFAULT '{}' NOT NULL,
	"frameworks" text[] DEFAULT '{}' NOT NULL,
	"focus" text[] DEFAULT '{}' NOT NULL,
	"interface_language" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;