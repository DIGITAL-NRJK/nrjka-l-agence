import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_popups_template" AS ENUM('modal', 'banner-bottom', 'slide-in', 'top-bar');
  CREATE TYPE "public"."enum_popups_trigger" AS ENUM('load', 'scroll', 'exit');
  CREATE TYPE "public"."enum_popups_frequency" AS ENUM('session', 'once', 'always');
  CREATE TYPE "public"."enum_popups_show_on" AS ENUM('all', 'include', 'exclude');
  CREATE TYPE "public"."enum_popups_locale_filter" AS ENUM('all', 'fr', 'en');
  CREATE TYPE "public"."enum_site_settings_maintenance_mode_template" AS ENUM('minimal', 'countdown', 'image', 'notify');
  CREATE TABLE "popups_paths" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar
  );
  
  CREATE TABLE "popups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"priority" numeric DEFAULT 0,
  	"template" "enum_popups_template" DEFAULT 'modal' NOT NULL,
  	"image_id" integer,
  	"cta_url" varchar,
  	"dismissible" boolean DEFAULT true,
  	"trigger" "enum_popups_trigger" DEFAULT 'load',
  	"delay_seconds" numeric DEFAULT 3,
  	"scroll_percent" numeric DEFAULT 40,
  	"frequency" "enum_popups_frequency" DEFAULT 'session',
  	"show_on" "enum_popups_show_on" DEFAULT 'all',
  	"locale_filter" "enum_popups_locale_filter" DEFAULT 'all',
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "popups_locales" (
  	"heading" varchar,
  	"body" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "popups_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "maintenance_mode_template" "enum_site_settings_maintenance_mode_template" DEFAULT 'minimal';
  ALTER TABLE "site_settings" ADD COLUMN "maintenance_mode_background_image_id" integer;
  ALTER TABLE "site_settings_locales" ADD COLUMN "maintenance_mode_notify_confirmation" varchar DEFAULT 'Merci ! Nous vous préviendrons dès le lancement.';
  ALTER TABLE "popups_paths" ADD CONSTRAINT "popups_paths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."popups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "popups" ADD CONSTRAINT "popups_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "popups_locales" ADD CONSTRAINT "popups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."popups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "popups_paths_order_idx" ON "popups_paths" USING btree ("_order");
  CREATE INDEX "popups_paths_parent_id_idx" ON "popups_paths" USING btree ("_parent_id");
  CREATE INDEX "popups_image_idx" ON "popups" USING btree ("image_id");
  CREATE INDEX "popups_updated_at_idx" ON "popups" USING btree ("updated_at");
  CREATE INDEX "popups_created_at_idx" ON "popups" USING btree ("created_at");
  CREATE UNIQUE INDEX "popups_locales_locale_parent_id_unique" ON "popups_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_popups_fk" FOREIGN KEY ("popups_id") REFERENCES "public"."popups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_maintenance_mode_background_image_id_media_id_fk" FOREIGN KEY ("maintenance_mode_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_popups_id_idx" ON "payload_locked_documents_rels" USING btree ("popups_id");
  CREATE INDEX "site_settings_maintenance_mode_maintenance_mode_backgrou_idx" ON "site_settings" USING btree ("maintenance_mode_background_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "popups_paths" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "popups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "popups_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "popups_paths" CASCADE;
  DROP TABLE "popups" CASCADE;
  DROP TABLE "popups_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_popups_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_maintenance_mode_background_image_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_popups_id_idx";
  DROP INDEX "site_settings_maintenance_mode_maintenance_mode_backgrou_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "popups_id";
  ALTER TABLE "site_settings" DROP COLUMN "maintenance_mode_template";
  ALTER TABLE "site_settings" DROP COLUMN "maintenance_mode_background_image_id";
  ALTER TABLE "site_settings_locales" DROP COLUMN "maintenance_mode_notify_confirmation";
  DROP TYPE "public"."enum_popups_template";
  DROP TYPE "public"."enum_popups_trigger";
  DROP TYPE "public"."enum_popups_frequency";
  DROP TYPE "public"."enum_popups_show_on";
  DROP TYPE "public"."enum_popups_locale_filter";
  DROP TYPE "public"."enum_site_settings_maintenance_mode_template";`)
}
