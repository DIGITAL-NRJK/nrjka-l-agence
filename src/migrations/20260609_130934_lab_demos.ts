import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_lab_demos_status" AS ENUM('live', 'soon');
  CREATE TYPE "public"."enum__pages_v_blocks_lab_demos_status" AS ENUM('live', 'soon');
  CREATE TABLE "pages_blocks_lab_demos_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_lab_demos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"status" "enum_pages_blocks_lab_demos_status" DEFAULT 'soon',
  	"url" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lab_demos_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lab_demos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"status" "enum__pages_v_blocks_lab_demos_status" DEFAULT 'soon',
  	"url" varchar,
  	"_uuid" varchar
  );
  
  DROP TABLE "pages_blocks_lab_tools" CASCADE;
  DROP TABLE "_pages_v_blocks_lab_tools" CASCADE;
  ALTER TABLE "pages_blocks_lab_demos_stack" ADD CONSTRAINT "pages_blocks_lab_demos_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lab_demos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lab_demos" ADD CONSTRAINT "pages_blocks_lab_demos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_demos_stack" ADD CONSTRAINT "_pages_v_blocks_lab_demos_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lab_demos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_demos" ADD CONSTRAINT "_pages_v_blocks_lab_demos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_lab_demos_stack_order_idx" ON "pages_blocks_lab_demos_stack" USING btree ("_order");
  CREATE INDEX "pages_blocks_lab_demos_stack_parent_id_idx" ON "pages_blocks_lab_demos_stack" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lab_demos_stack_locale_idx" ON "pages_blocks_lab_demos_stack" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lab_demos_order_idx" ON "pages_blocks_lab_demos" USING btree ("_order");
  CREATE INDEX "pages_blocks_lab_demos_parent_id_idx" ON "pages_blocks_lab_demos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lab_demos_locale_idx" ON "pages_blocks_lab_demos" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lab_demos_stack_order_idx" ON "_pages_v_blocks_lab_demos_stack" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lab_demos_stack_parent_id_idx" ON "_pages_v_blocks_lab_demos_stack" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_demos_stack_locale_idx" ON "_pages_v_blocks_lab_demos_stack" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lab_demos_order_idx" ON "_pages_v_blocks_lab_demos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lab_demos_parent_id_idx" ON "_pages_v_blocks_lab_demos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_demos_locale_idx" ON "_pages_v_blocks_lab_demos" USING btree ("_locale");
  DROP TYPE "public"."enum_pages_blocks_lab_tools_icon";
  DROP TYPE "public"."enum__pages_v_blocks_lab_tools_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
  
  DROP TABLE "pages_blocks_lab_demos_stack" CASCADE;
  DROP TABLE "pages_blocks_lab_demos" CASCADE;
  DROP TABLE "_pages_v_blocks_lab_demos_stack" CASCADE;
  DROP TABLE "_pages_v_blocks_lab_demos" CASCADE;
  ALTER TABLE "pages_blocks_lab_tools" ADD CONSTRAINT "pages_blocks_lab_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_tools" ADD CONSTRAINT "_pages_v_blocks_lab_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_lab_tools_order_idx" ON "pages_blocks_lab_tools" USING btree ("_order");
  CREATE INDEX "pages_blocks_lab_tools_parent_id_idx" ON "pages_blocks_lab_tools" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lab_tools_locale_idx" ON "pages_blocks_lab_tools" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lab_tools_order_idx" ON "_pages_v_blocks_lab_tools" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lab_tools_parent_id_idx" ON "_pages_v_blocks_lab_tools" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_tools_locale_idx" ON "_pages_v_blocks_lab_tools" USING btree ("_locale");
  DROP TYPE "public"."enum_pages_blocks_lab_demos_status";
  DROP TYPE "public"."enum__pages_v_blocks_lab_demos_status";`)
}
