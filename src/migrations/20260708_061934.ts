import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "careers_settings_spontaneous_look_for" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "careers_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "careers_settings_locales" (
  	"list_eyebrow" varchar,
  	"list_title" varchar,
  	"list_intro" varchar,
  	"list_empty_text" varchar,
  	"list_spontaneous_cta" varchar,
  	"spontaneous_eyebrow" varchar,
  	"spontaneous_title" varchar,
  	"spontaneous_intro" varchar,
  	"spontaneous_look_for_heading" varchar,
  	"spontaneous_next_heading" varchar,
  	"spontaneous_next_text" varchar,
  	"detail_responsibilities" varchar,
  	"detail_requirements" varchar,
  	"detail_perks" varchar,
  	"form_title" varchar,
  	"form_first_name" varchar,
  	"form_last_name" varchar,
  	"form_email" varchar,
  	"form_phone" varchar,
  	"form_linkedin" varchar,
  	"form_portfolio" varchar,
  	"form_cover_letter" varchar,
  	"form_cv" varchar,
  	"form_consent" varchar,
  	"form_submit" varchar,
  	"form_success_title" varchar,
  	"form_success_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "careers_settings_spontaneous_look_for" ADD CONSTRAINT "careers_settings_spontaneous_look_for_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "careers_settings_locales" ADD CONSTRAINT "careers_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "careers_settings_spontaneous_look_for_order_idx" ON "careers_settings_spontaneous_look_for" USING btree ("_order");
  CREATE INDEX "careers_settings_spontaneous_look_for_parent_id_idx" ON "careers_settings_spontaneous_look_for" USING btree ("_parent_id");
  CREATE INDEX "careers_settings_spontaneous_look_for_locale_idx" ON "careers_settings_spontaneous_look_for" USING btree ("_locale");
  CREATE UNIQUE INDEX "careers_settings_locales_locale_parent_id_unique" ON "careers_settings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "careers_settings_spontaneous_look_for" CASCADE;
  DROP TABLE "careers_settings" CASCADE;
  DROP TABLE "careers_settings_locales" CASCADE;`)
}
