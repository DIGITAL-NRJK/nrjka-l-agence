import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_lab_demos_preview_type" AS ENUM('sync', 'dashboard', 'calendar', 'chat', 'form', 'content');
  CREATE TYPE "public"."enum__pages_v_blocks_lab_demos_preview_type" AS ENUM('sync', 'dashboard', 'calendar', 'chat', 'form', 'content');
  ALTER TABLE "pages_blocks_lab_demos" ADD COLUMN "sector" varchar;
  ALTER TABLE "pages_blocks_lab_demos" ADD COLUMN "preview_type" "enum_pages_blocks_lab_demos_preview_type" DEFAULT 'sync';
  ALTER TABLE "pages_blocks_lab_demos" ADD COLUMN "media_id" integer;
  ALTER TABLE "_pages_v_blocks_lab_demos" ADD COLUMN "sector" varchar;
  ALTER TABLE "_pages_v_blocks_lab_demos" ADD COLUMN "preview_type" "enum__pages_v_blocks_lab_demos_preview_type" DEFAULT 'sync';
  ALTER TABLE "_pages_v_blocks_lab_demos" ADD COLUMN "media_id" integer;
  ALTER TABLE "pages_blocks_lab_demos" ADD CONSTRAINT "pages_blocks_lab_demos_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_demos" ADD CONSTRAINT "_pages_v_blocks_lab_demos_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_lab_demos_media_idx" ON "pages_blocks_lab_demos" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_lab_demos_media_idx" ON "_pages_v_blocks_lab_demos" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_lab_demos" DROP CONSTRAINT "pages_blocks_lab_demos_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_lab_demos" DROP CONSTRAINT "_pages_v_blocks_lab_demos_media_id_media_id_fk";
  
  DROP INDEX "pages_blocks_lab_demos_media_idx";
  DROP INDEX "_pages_v_blocks_lab_demos_media_idx";
  ALTER TABLE "pages_blocks_lab_demos" DROP COLUMN "sector";
  ALTER TABLE "pages_blocks_lab_demos" DROP COLUMN "preview_type";
  ALTER TABLE "pages_blocks_lab_demos" DROP COLUMN "media_id";
  ALTER TABLE "_pages_v_blocks_lab_demos" DROP COLUMN "sector";
  ALTER TABLE "_pages_v_blocks_lab_demos" DROP COLUMN "preview_type";
  ALTER TABLE "_pages_v_blocks_lab_demos" DROP COLUMN "media_id";
  DROP TYPE "public"."enum_pages_blocks_lab_demos_preview_type";
  DROP TYPE "public"."enum__pages_v_blocks_lab_demos_preview_type";`)
}
