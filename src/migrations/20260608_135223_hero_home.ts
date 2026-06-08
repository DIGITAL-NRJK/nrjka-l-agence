import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'homeNRJKA';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'homeNRJKA';
  CREATE TABLE "pages_hero_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages" ADD COLUMN "hero_primary_cta_href" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_secondary_cta_href" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_badge" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_headline" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_headline_accent" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_subtitle" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_primary_cta_label" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_secondary_cta_label" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_primary_cta_href" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_secondary_cta_href" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_badge" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_headline" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_headline_accent" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_subtitle" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_primary_cta_label" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_secondary_cta_label" varchar;
  ALTER TABLE "pages_hero_trust_badges" ADD CONSTRAINT "pages_hero_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_stats" ADD CONSTRAINT "pages_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_trust_badges" ADD CONSTRAINT "_pages_v_version_hero_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_stats" ADD CONSTRAINT "_pages_v_version_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_trust_badges_order_idx" ON "pages_hero_trust_badges" USING btree ("_order");
  CREATE INDEX "pages_hero_trust_badges_parent_id_idx" ON "pages_hero_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_trust_badges_locale_idx" ON "pages_hero_trust_badges" USING btree ("_locale");
  CREATE INDEX "pages_hero_stats_order_idx" ON "pages_hero_stats" USING btree ("_order");
  CREATE INDEX "pages_hero_stats_parent_id_idx" ON "pages_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_stats_locale_idx" ON "pages_hero_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_hero_trust_badges_order_idx" ON "_pages_v_version_hero_trust_badges" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_trust_badges_parent_id_idx" ON "_pages_v_version_hero_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_trust_badges_locale_idx" ON "_pages_v_version_hero_trust_badges" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_hero_stats_order_idx" ON "_pages_v_version_hero_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_stats_parent_id_idx" ON "_pages_v_version_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_stats_locale_idx" ON "_pages_v_version_hero_stats" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_trust_badges" CASCADE;
  DROP TABLE "pages_hero_stats" CASCADE;
  DROP TABLE "_pages_v_version_hero_trust_badges" CASCADE;
  DROP TABLE "_pages_v_version_hero_stats" CASCADE;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "pages" DROP COLUMN "hero_primary_cta_href";
  ALTER TABLE "pages" DROP COLUMN "hero_secondary_cta_href";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_badge";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_headline";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_headline_accent";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_subtitle";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_primary_cta_label";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_secondary_cta_label";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_primary_cta_href";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_secondary_cta_href";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_badge";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_headline";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_headline_accent";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_subtitle";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_primary_cta_label";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_secondary_cta_label";`)
}
