import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ADD COLUMN "newsletter_enabled" boolean DEFAULT true;
  ALTER TABLE "footer_locales" ADD COLUMN "newsletter_title" varchar;
  ALTER TABLE "footer_locales" ADD COLUMN "newsletter_text" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" DROP COLUMN "newsletter_enabled";
  ALTER TABLE "footer_locales" DROP COLUMN "newsletter_title";
  ALTER TABLE "footer_locales" DROP COLUMN "newsletter_text";`)
}
