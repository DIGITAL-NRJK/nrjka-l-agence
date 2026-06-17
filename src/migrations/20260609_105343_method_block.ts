import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_method_steps_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_method_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar
  );
  
  CREATE TABLE "pages_blocks_method" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_method_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_method_steps_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_method_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_method" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_method_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_method_steps_activities" ADD CONSTRAINT "pages_blocks_method_steps_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_steps" ADD CONSTRAINT "pages_blocks_method_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method" ADD CONSTRAINT "pages_blocks_method_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_locales" ADD CONSTRAINT "pages_blocks_method_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_steps_activities" ADD CONSTRAINT "_pages_v_blocks_method_steps_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_steps" ADD CONSTRAINT "_pages_v_blocks_method_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method" ADD CONSTRAINT "_pages_v_blocks_method_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_locales" ADD CONSTRAINT "_pages_v_blocks_method_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_method_steps_activities_order_idx" ON "pages_blocks_method_steps_activities" USING btree ("_order");
  CREATE INDEX "pages_blocks_method_steps_activities_parent_id_idx" ON "pages_blocks_method_steps_activities" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_method_steps_activities_locale_idx" ON "pages_blocks_method_steps_activities" USING btree ("_locale");
  CREATE INDEX "pages_blocks_method_steps_order_idx" ON "pages_blocks_method_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_method_steps_parent_id_idx" ON "pages_blocks_method_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_method_steps_locale_idx" ON "pages_blocks_method_steps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_method_order_idx" ON "pages_blocks_method" USING btree ("_order");
  CREATE INDEX "pages_blocks_method_parent_id_idx" ON "pages_blocks_method" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_method_path_idx" ON "pages_blocks_method" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_method_locales_locale_parent_id_unique" ON "pages_blocks_method_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_method_steps_activities_order_idx" ON "_pages_v_blocks_method_steps_activities" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_method_steps_activities_parent_id_idx" ON "_pages_v_blocks_method_steps_activities" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_method_steps_activities_locale_idx" ON "_pages_v_blocks_method_steps_activities" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_method_steps_order_idx" ON "_pages_v_blocks_method_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_method_steps_parent_id_idx" ON "_pages_v_blocks_method_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_method_steps_locale_idx" ON "_pages_v_blocks_method_steps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_method_order_idx" ON "_pages_v_blocks_method" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_method_parent_id_idx" ON "_pages_v_blocks_method" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_method_path_idx" ON "_pages_v_blocks_method" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_method_locales_locale_parent_id_unique" ON "_pages_v_blocks_method_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_method_steps_activities" CASCADE;
  DROP TABLE "pages_blocks_method_steps" CASCADE;
  DROP TABLE "pages_blocks_method" CASCADE;
  DROP TABLE "pages_blocks_method_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_method_steps_activities" CASCADE;
  DROP TABLE "_pages_v_blocks_method_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_method" CASCADE;
  DROP TABLE "_pages_v_blocks_method_locales" CASCADE;`)
}
