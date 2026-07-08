import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_nav_items_sub_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "header_nav_items_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_sub_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "header_nav_items_sub_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "header_nav_items_sub_items" ADD CONSTRAINT "header_nav_items_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_sub_items_locales" ADD CONSTRAINT "header_nav_items_sub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_sub_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_nav_items_sub_items_order_idx" ON "header_nav_items_sub_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_sub_items_parent_id_idx" ON "header_nav_items_sub_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_sub_items_locales_locale_parent_id_unique" ON "header_nav_items_sub_items_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "header_nav_items_sub_items" CASCADE;
  DROP TABLE "header_nav_items_sub_items_locales" CASCADE;
  DROP TYPE "public"."enum_header_nav_items_sub_items_link_type";`)
}
