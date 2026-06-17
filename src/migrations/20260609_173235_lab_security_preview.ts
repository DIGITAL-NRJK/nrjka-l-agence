import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_lab_demos_preview_type" ADD VALUE 'security';
  ALTER TYPE "public"."enum__pages_v_blocks_lab_demos_preview_type" ADD VALUE 'security';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_lab_demos" ALTER COLUMN "preview_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_lab_demos" ALTER COLUMN "preview_type" SET DEFAULT 'sync'::text;
  DROP TYPE "public"."enum_pages_blocks_lab_demos_preview_type";
  CREATE TYPE "public"."enum_pages_blocks_lab_demos_preview_type" AS ENUM('sync', 'dashboard', 'calendar', 'chat', 'form', 'content');
  ALTER TABLE "pages_blocks_lab_demos" ALTER COLUMN "preview_type" SET DEFAULT 'sync'::"public"."enum_pages_blocks_lab_demos_preview_type";
  ALTER TABLE "pages_blocks_lab_demos" ALTER COLUMN "preview_type" SET DATA TYPE "public"."enum_pages_blocks_lab_demos_preview_type" USING "preview_type"::"public"."enum_pages_blocks_lab_demos_preview_type";
  ALTER TABLE "_pages_v_blocks_lab_demos" ALTER COLUMN "preview_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_lab_demos" ALTER COLUMN "preview_type" SET DEFAULT 'sync'::text;
  DROP TYPE "public"."enum__pages_v_blocks_lab_demos_preview_type";
  CREATE TYPE "public"."enum__pages_v_blocks_lab_demos_preview_type" AS ENUM('sync', 'dashboard', 'calendar', 'chat', 'form', 'content');
  ALTER TABLE "_pages_v_blocks_lab_demos" ALTER COLUMN "preview_type" SET DEFAULT 'sync'::"public"."enum__pages_v_blocks_lab_demos_preview_type";
  ALTER TABLE "_pages_v_blocks_lab_demos" ALTER COLUMN "preview_type" SET DATA TYPE "public"."enum__pages_v_blocks_lab_demos_preview_type" USING "preview_type"::"public"."enum__pages_v_blocks_lab_demos_preview_type";`)
}
