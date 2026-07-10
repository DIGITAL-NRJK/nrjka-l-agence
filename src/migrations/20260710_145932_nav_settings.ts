import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_nav_settings_order_entity" AS ENUM('pages', 'posts', 'categories', 'expertises', 'services', 'case-studies', 'case-study-sectors', 'case-study-types', 'testimonials', 'reviews', 'blog-comments', 'resources', 'media', 'products', 'contact-messages', 'appointments', 'job-offers', 'job-applications', 'popups', 'newsletter-subscribers', 'newsletter-signatures', 'newsletter-campaigns', 'knowledge-chunks', 'chat-conversations', 'users', 'redirects', 'forms', 'form-submissions', 'header', 'footer', 'site-settings', 'careers-settings', 'nav-settings');
  CREATE TABLE "nav_settings_order" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity" "enum_nav_settings_order_entity" NOT NULL
  );
  
  CREATE TABLE "nav_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "nav_settings_order" ADD CONSTRAINT "nav_settings_order_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nav_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "nav_settings_order_order_idx" ON "nav_settings_order" USING btree ("_order");
  CREATE INDEX "nav_settings_order_parent_id_idx" ON "nav_settings_order" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "nav_settings_order" CASCADE;
  DROP TABLE "nav_settings" CASCADE;
  DROP TYPE "public"."enum_nav_settings_order_entity";`)
}
