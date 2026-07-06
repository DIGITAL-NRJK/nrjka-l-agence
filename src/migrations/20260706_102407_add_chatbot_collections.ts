import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_logo_wall_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_logo_wall_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_wall_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_wall_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_knowledge_chunks_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_chat_conversations_messages_role" AS ENUM('user', 'assistant');
  CREATE TYPE "public"."enum_chat_conversations_locale" AS ENUM('fr', 'en');
  CREATE TABLE "pages_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"grayscale" boolean DEFAULT true,
  	"appearance_title_size" "enum_pages_blocks_logo_wall_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_logo_wall_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_wall_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"grayscale" boolean DEFAULT true,
  	"appearance_title_size" "enum__pages_v_blocks_logo_wall_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_logo_wall_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_wall_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "knowledge_chunks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"embedding" jsonb,
  	"locale" "enum_knowledge_chunks_locale" DEFAULT 'fr',
  	"source_collection" varchar,
  	"source_id" varchar,
  	"url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "chat_conversations_messages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" "enum_chat_conversations_messages_role",
  	"content" varchar,
  	"at" varchar
  );
  
  CREATE TABLE "chat_conversations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"summary" varchar,
  	"locale" "enum_chat_conversations_locale" DEFAULT 'fr',
  	"turns" numeric,
  	"consent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "knowledge_chunks_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "chat_conversations_id" integer;
  ALTER TABLE "pages_blocks_logo_wall_logos" ADD CONSTRAINT "pages_blocks_logo_wall_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall_logos" ADD CONSTRAINT "pages_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall" ADD CONSTRAINT "pages_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_wall_locales" ADD CONSTRAINT "pages_blocks_logo_wall_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" ADD CONSTRAINT "_pages_v_blocks_logo_wall_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" ADD CONSTRAINT "_pages_v_blocks_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall" ADD CONSTRAINT "_pages_v_blocks_logo_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_wall_locales" ADD CONSTRAINT "_pages_v_blocks_logo_wall_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chat_conversations_messages" ADD CONSTRAINT "chat_conversations_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chat_conversations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_logo_wall_logos_order_idx" ON "pages_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_wall_logos_parent_id_idx" ON "pages_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_wall_logos_logo_idx" ON "pages_blocks_logo_wall_logos" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_logo_wall_order_idx" ON "pages_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_wall_parent_id_idx" ON "pages_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_wall_path_idx" ON "pages_blocks_logo_wall" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_logo_wall_locales_locale_parent_id_unique" ON "pages_blocks_logo_wall_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_logos_order_idx" ON "_pages_v_blocks_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_wall_logos_parent_id_idx" ON "_pages_v_blocks_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_logos_logo_idx" ON "_pages_v_blocks_logo_wall_logos" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_order_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_wall_parent_id_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_wall_path_idx" ON "_pages_v_blocks_logo_wall" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_logo_wall_locales_locale_parent_id_unique" ON "_pages_v_blocks_logo_wall_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "knowledge_chunks_updated_at_idx" ON "knowledge_chunks" USING btree ("updated_at");
  CREATE INDEX "knowledge_chunks_created_at_idx" ON "knowledge_chunks" USING btree ("created_at");
  CREATE INDEX "chat_conversations_messages_order_idx" ON "chat_conversations_messages" USING btree ("_order");
  CREATE INDEX "chat_conversations_messages_parent_id_idx" ON "chat_conversations_messages" USING btree ("_parent_id");
  CREATE INDEX "chat_conversations_updated_at_idx" ON "chat_conversations" USING btree ("updated_at");
  CREATE INDEX "chat_conversations_created_at_idx" ON "chat_conversations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_knowledge_chunks_fk" FOREIGN KEY ("knowledge_chunks_id") REFERENCES "public"."knowledge_chunks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_conversations_fk" FOREIGN KEY ("chat_conversations_id") REFERENCES "public"."chat_conversations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_knowledge_chunks_id_idx" ON "payload_locked_documents_rels" USING btree ("knowledge_chunks_id");
  CREATE INDEX "payload_locked_documents_rels_chat_conversations_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_conversations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_logo_wall_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_wall" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_logo_wall_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_wall_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_wall" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_wall_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "knowledge_chunks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chat_conversations_messages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chat_conversations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_wall" CASCADE;
  DROP TABLE "pages_blocks_logo_wall_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_wall_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_wall" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_wall_locales" CASCADE;
  DROP TABLE "knowledge_chunks" CASCADE;
  DROP TABLE "chat_conversations_messages" CASCADE;
  DROP TABLE "chat_conversations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_knowledge_chunks_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_chat_conversations_fk";
  
  DROP INDEX "payload_locked_documents_rels_knowledge_chunks_id_idx";
  DROP INDEX "payload_locked_documents_rels_chat_conversations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "knowledge_chunks_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "chat_conversations_id";
  DROP TYPE "public"."enum_pages_blocks_logo_wall_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_logo_wall_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_logo_wall_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_logo_wall_appearance_text_size";
  DROP TYPE "public"."enum_knowledge_chunks_locale";
  DROP TYPE "public"."enum_chat_conversations_messages_role";
  DROP TYPE "public"."enum_chat_conversations_locale";`)
}
