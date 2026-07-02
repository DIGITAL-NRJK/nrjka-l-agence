import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_appearance_color_scheme" AS ENUM('navy-terracotta', 'foret-cuivre', 'ocean-corail', 'aubergine-or', 'graphite-menthe', 'premium-tech', 'studio-creatif', 'editorial-moderne', 'human-warm', 'luxury-digital', 'bold-future');
  ALTER TABLE "site_settings" ADD COLUMN "appearance_color_scheme" "enum_site_settings_appearance_color_scheme" DEFAULT 'navy-terracotta' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "appearance_color_scheme";
  DROP TYPE "public"."enum_site_settings_appearance_color_scheme";`)
}
