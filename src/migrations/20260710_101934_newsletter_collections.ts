import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_newsletter_subscribers_status" AS ENUM('pending', 'confirmed', 'unsubscribed');
  CREATE TYPE "public"."enum_newsletter_subscribers_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_newsletter_campaigns_audience" AS ENUM('all_confirmed', 'fr_confirmed', 'en_confirmed', 'tag');
  CREATE TYPE "public"."enum_newsletter_campaigns_status" AS ENUM('draft', 'sent');
  CREATE TABLE "newsletter_subscribers_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "newsletter_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"first_name" varchar,
  	"status" "enum_newsletter_subscribers_status" DEFAULT 'pending',
  	"locale" "enum_newsletter_subscribers_locale" DEFAULT 'fr',
  	"source" varchar,
  	"consent_at" timestamp(3) with time zone,
  	"confirmed_at" timestamp(3) with time zone,
  	"unsubscribed_at" timestamp(3) with time zone,
  	"confirm_token" varchar,
  	"unsubscribe_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"audience" "enum_newsletter_campaigns_audience" DEFAULT 'all_confirmed',
  	"tag" varchar,
  	"status" "enum_newsletter_campaigns_status" DEFAULT 'draft',
  	"test_email" varchar,
  	"send_test" boolean DEFAULT false,
  	"send_now" boolean DEFAULT false,
  	"sent_at" timestamp(3) with time zone,
  	"recipient_count" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_campaigns_locales" (
  	"subject" varchar,
  	"preheader" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "newsletter_subscribers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "newsletter_campaigns_id" integer;
  ALTER TABLE "newsletter_subscribers_tags" ADD CONSTRAINT "newsletter_subscribers_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "newsletter_campaigns_locales" ADD CONSTRAINT "newsletter_campaigns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "newsletter_subscribers_tags_order_idx" ON "newsletter_subscribers_tags" USING btree ("_order");
  CREATE INDEX "newsletter_subscribers_tags_parent_id_idx" ON "newsletter_subscribers_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");
  CREATE INDEX "newsletter_subscribers_updated_at_idx" ON "newsletter_subscribers" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscribers_created_at_idx" ON "newsletter_subscribers" USING btree ("created_at");
  CREATE INDEX "newsletter_campaigns_updated_at_idx" ON "newsletter_campaigns" USING btree ("updated_at");
  CREATE INDEX "newsletter_campaigns_created_at_idx" ON "newsletter_campaigns" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_campaigns_locales_locale_parent_id_unique" ON "newsletter_campaigns_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk" FOREIGN KEY ("newsletter_subscribers_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_campaigns_fk" FOREIGN KEY ("newsletter_campaigns_id") REFERENCES "public"."newsletter_campaigns"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_campaigns_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_subscribers_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter_subscribers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter_campaigns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter_campaigns_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "newsletter_subscribers_tags" CASCADE;
  DROP TABLE "newsletter_subscribers" CASCADE;
  DROP TABLE "newsletter_campaigns" CASCADE;
  DROP TABLE "newsletter_campaigns_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_newsletter_campaigns_fk";
  
  DROP INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx";
  DROP INDEX "payload_locked_documents_rels_newsletter_campaigns_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "newsletter_subscribers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "newsletter_campaigns_id";
  DROP TYPE "public"."enum_newsletter_subscribers_status";
  DROP TYPE "public"."enum_newsletter_subscribers_locale";
  DROP TYPE "public"."enum_newsletter_campaigns_audience";
  DROP TYPE "public"."enum_newsletter_campaigns_status";`)
}
