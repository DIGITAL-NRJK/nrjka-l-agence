import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_megamenu_poles_services" ADD COLUMN "label_override_en" varchar;
  ALTER TABLE "header_megamenu_poles" ADD COLUMN "label_override_en" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_megamenu_poles_services" DROP COLUMN "label_override_en";
  ALTER TABLE "header_megamenu_poles" DROP COLUMN "label_override_en";`)
}
