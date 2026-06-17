import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_hero_panel_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_panel_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_locales" ADD COLUMN "hero_panel_eyebrow" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_panel_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN "hero_panel_availability" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_panel_eyebrow" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_panel_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_hero_panel_availability" varchar;
  ALTER TABLE "pages_hero_panel_dimensions" ADD CONSTRAINT "pages_hero_panel_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_panel_dimensions" ADD CONSTRAINT "_pages_v_version_hero_panel_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_panel_dimensions_order_idx" ON "pages_hero_panel_dimensions" USING btree ("_order");
  CREATE INDEX "pages_hero_panel_dimensions_parent_id_idx" ON "pages_hero_panel_dimensions" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_panel_dimensions_locale_idx" ON "pages_hero_panel_dimensions" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_hero_panel_dimensions_order_idx" ON "_pages_v_version_hero_panel_dimensions" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_panel_dimensions_parent_id_idx" ON "_pages_v_version_hero_panel_dimensions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_panel_dimensions_locale_idx" ON "_pages_v_version_hero_panel_dimensions" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_panel_dimensions" CASCADE;
  DROP TABLE "_pages_v_version_hero_panel_dimensions" CASCADE;
  ALTER TABLE "pages_locales" DROP COLUMN "hero_panel_eyebrow";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_panel_title";
  ALTER TABLE "pages_locales" DROP COLUMN "hero_panel_availability";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_panel_eyebrow";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_panel_title";
  ALTER TABLE "_pages_v_locales" DROP COLUMN "version_hero_panel_availability";`)
}
