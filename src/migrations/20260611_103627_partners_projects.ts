import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_partners" ADD COLUMN "projects_limit" numeric DEFAULT 3;
  ALTER TABLE "pages_blocks_partners" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "pages_blocks_partners_locales" ADD COLUMN "tech_label" varchar;
  ALTER TABLE "pages_blocks_partners_locales" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_partners" ADD COLUMN "projects_limit" numeric DEFAULT 3;
  ALTER TABLE "_pages_v_blocks_partners" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "_pages_v_blocks_partners_locales" ADD COLUMN "tech_label" varchar;
  ALTER TABLE "_pages_v_blocks_partners_locales" ADD COLUMN "cta_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_partners" DROP COLUMN "projects_limit";
  ALTER TABLE "pages_blocks_partners" DROP COLUMN "cta_href";
  ALTER TABLE "pages_blocks_partners_locales" DROP COLUMN "tech_label";
  ALTER TABLE "pages_blocks_partners_locales" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_blocks_partners" DROP COLUMN "projects_limit";
  ALTER TABLE "_pages_v_blocks_partners" DROP COLUMN "cta_href";
  ALTER TABLE "_pages_v_blocks_partners_locales" DROP COLUMN "tech_label";
  ALTER TABLE "_pages_v_blocks_partners_locales" DROP COLUMN "cta_label";`)
}
