import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_pillars_pillars_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_pillars_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pillars_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_pillars_pillars_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pillars_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pillars_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_pillars_pillars_services" ADD CONSTRAINT "pages_blocks_pillars_pillars_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pillars_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillars_pillars" ADD CONSTRAINT "pages_blocks_pillars_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillars" ADD CONSTRAINT "pages_blocks_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillars_locales" ADD CONSTRAINT "pages_blocks_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillars_pillars_services" ADD CONSTRAINT "_pages_v_blocks_pillars_pillars_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pillars_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillars_pillars" ADD CONSTRAINT "_pages_v_blocks_pillars_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillars" ADD CONSTRAINT "_pages_v_blocks_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillars_locales" ADD CONSTRAINT "_pages_v_blocks_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pillars"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_pillars_pillars_services_order_idx" ON "pages_blocks_pillars_pillars_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_pillars_pillars_services_parent_id_idx" ON "pages_blocks_pillars_pillars_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pillars_pillars_services_locale_idx" ON "pages_blocks_pillars_pillars_services" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pillars_pillars_order_idx" ON "pages_blocks_pillars_pillars" USING btree ("_order");
  CREATE INDEX "pages_blocks_pillars_pillars_parent_id_idx" ON "pages_blocks_pillars_pillars" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pillars_pillars_locale_idx" ON "pages_blocks_pillars_pillars" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pillars_order_idx" ON "pages_blocks_pillars" USING btree ("_order");
  CREATE INDEX "pages_blocks_pillars_parent_id_idx" ON "pages_blocks_pillars" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pillars_path_idx" ON "pages_blocks_pillars" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_pillars_locales_locale_parent_id_unique" ON "pages_blocks_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_pillars_pillars_services_order_idx" ON "_pages_v_blocks_pillars_pillars_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pillars_pillars_services_parent_id_idx" ON "_pages_v_blocks_pillars_pillars_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pillars_pillars_services_locale_idx" ON "_pages_v_blocks_pillars_pillars_services" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pillars_pillars_order_idx" ON "_pages_v_blocks_pillars_pillars" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pillars_pillars_parent_id_idx" ON "_pages_v_blocks_pillars_pillars" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pillars_pillars_locale_idx" ON "_pages_v_blocks_pillars_pillars" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pillars_order_idx" ON "_pages_v_blocks_pillars" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pillars_parent_id_idx" ON "_pages_v_blocks_pillars" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pillars_path_idx" ON "_pages_v_blocks_pillars" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_pillars_locales_locale_parent_id_unique" ON "_pages_v_blocks_pillars_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_pillars_pillars_services" CASCADE;
  DROP TABLE "pages_blocks_pillars_pillars" CASCADE;
  DROP TABLE "pages_blocks_pillars" CASCADE;
  DROP TABLE "pages_blocks_pillars_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_pillars_pillars_services" CASCADE;
  DROP TABLE "_pages_v_blocks_pillars_pillars" CASCADE;
  DROP TABLE "_pages_v_blocks_pillars" CASCADE;
  DROP TABLE "_pages_v_blocks_pillars_locales" CASCADE;`)
}
