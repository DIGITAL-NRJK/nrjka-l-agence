import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_lab_tools_icon" AS ENUM('search', 'gauge', 'calculator', 'sparkles', 'listChecks', 'fileText');
  CREATE TYPE "public"."enum__pages_v_blocks_lab_tools_icon" AS ENUM('search', 'gauge', 'calculator', 'sparkles', 'listChecks', 'fileText');
  CREATE TABLE "pages_blocks_lab_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_lab_tools_icon" DEFAULT 'search',
  	"name" varchar,
  	"description" varchar,
  	"tag" varchar
  );
  
  CREATE TABLE "pages_blocks_lab" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lab_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_lab_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_lab_tools_icon" DEFAULT 'search',
  	"name" varchar,
  	"description" varchar,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lab" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lab_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_lab_tools" ADD CONSTRAINT "pages_blocks_lab_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lab" ADD CONSTRAINT "pages_blocks_lab_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lab_locales" ADD CONSTRAINT "pages_blocks_lab_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_tools" ADD CONSTRAINT "_pages_v_blocks_lab_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab" ADD CONSTRAINT "_pages_v_blocks_lab_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_locales" ADD CONSTRAINT "_pages_v_blocks_lab_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_lab_tools_order_idx" ON "pages_blocks_lab_tools" USING btree ("_order");
  CREATE INDEX "pages_blocks_lab_tools_parent_id_idx" ON "pages_blocks_lab_tools" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lab_tools_locale_idx" ON "pages_blocks_lab_tools" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lab_order_idx" ON "pages_blocks_lab" USING btree ("_order");
  CREATE INDEX "pages_blocks_lab_parent_id_idx" ON "pages_blocks_lab" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lab_path_idx" ON "pages_blocks_lab" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_lab_locales_locale_parent_id_unique" ON "pages_blocks_lab_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_tools_order_idx" ON "_pages_v_blocks_lab_tools" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lab_tools_parent_id_idx" ON "_pages_v_blocks_lab_tools" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_tools_locale_idx" ON "_pages_v_blocks_lab_tools" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lab_order_idx" ON "_pages_v_blocks_lab" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lab_parent_id_idx" ON "_pages_v_blocks_lab" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_path_idx" ON "_pages_v_blocks_lab" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_lab_locales_locale_parent_id_unique" ON "_pages_v_blocks_lab_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_lab_tools" CASCADE;
  DROP TABLE "pages_blocks_lab" CASCADE;
  DROP TABLE "pages_blocks_lab_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_lab_tools" CASCADE;
  DROP TABLE "_pages_v_blocks_lab" CASCADE;
  DROP TABLE "_pages_v_blocks_lab_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_lab_tools_icon";
  DROP TYPE "public"."enum__pages_v_blocks_lab_tools_icon";`)
}
