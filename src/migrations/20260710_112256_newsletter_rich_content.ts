import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "newsletter_signatures" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "newsletter_signatures_locales" (
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "newsletter_campaigns_locales" ALTER COLUMN "body" SET DATA TYPE jsonb USING "body"::jsonb;
  ALTER TABLE "newsletter_campaigns" ADD COLUMN "signature_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "newsletter_signatures_id" integer;
  ALTER TABLE "newsletter_signatures_locales" ADD CONSTRAINT "newsletter_signatures_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter_signatures"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "newsletter_signatures_updated_at_idx" ON "newsletter_signatures" USING btree ("updated_at");
  CREATE INDEX "newsletter_signatures_created_at_idx" ON "newsletter_signatures" USING btree ("created_at");
  CREATE UNIQUE INDEX "newsletter_signatures_locales_locale_parent_id_unique" ON "newsletter_signatures_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "newsletter_campaigns" ADD CONSTRAINT "newsletter_campaigns_signature_id_newsletter_signatures_id_fk" FOREIGN KEY ("signature_id") REFERENCES "public"."newsletter_signatures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_signatures_fk" FOREIGN KEY ("newsletter_signatures_id") REFERENCES "public"."newsletter_signatures"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "newsletter_campaigns_signature_idx" ON "newsletter_campaigns" USING btree ("signature_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_signatures_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_signatures_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_signatures" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter_signatures_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "newsletter_signatures" CASCADE;
  DROP TABLE "newsletter_signatures_locales" CASCADE;
  ALTER TABLE "newsletter_campaigns" DROP CONSTRAINT "newsletter_campaigns_signature_id_newsletter_signatures_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_newsletter_signatures_fk";
  
  DROP INDEX "newsletter_campaigns_signature_idx";
  DROP INDEX "payload_locked_documents_rels_newsletter_signatures_id_idx";
  ALTER TABLE "newsletter_campaigns_locales" ALTER COLUMN "body" SET DATA TYPE varchar USING "body"::text;
  ALTER TABLE "newsletter_campaigns" DROP COLUMN "signature_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "newsletter_signatures_id";`)
}
