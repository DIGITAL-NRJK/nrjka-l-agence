import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_site_settings_appearance_color_scheme" ADD VALUE 'noel';
  ALTER TYPE "public"."enum_site_settings_appearance_color_scheme" ADD VALUE 'vacances';
  ALTER TYPE "public"."enum_site_settings_appearance_color_scheme" ADD VALUE 'saint-valentin';
  ALTER TYPE "public"."enum_site_settings_appearance_color_scheme" ADD VALUE 'nouvel-an';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "appearance_color_scheme" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "appearance_color_scheme" SET DEFAULT 'navy-terracotta'::text;
  DROP TYPE "public"."enum_site_settings_appearance_color_scheme";
  CREATE TYPE "public"."enum_site_settings_appearance_color_scheme" AS ENUM('navy-terracotta', 'foret-cuivre', 'ocean-corail', 'aubergine-or', 'graphite-menthe', 'premium-tech', 'studio-creatif', 'editorial-moderne', 'human-warm', 'luxury-digital', 'bold-future', 'indigo-saas', 'noir-studio', 'nebuleuse', 'teal-transformatif', 'sauge-lin', 'retro-sunset', 'magenta-pulse', 'halo-iridescent', 'vert-commerce', 'corail-voyage');
  ALTER TABLE "site_settings" ALTER COLUMN "appearance_color_scheme" SET DEFAULT 'navy-terracotta'::"public"."enum_site_settings_appearance_color_scheme";
  ALTER TABLE "site_settings" ALTER COLUMN "appearance_color_scheme" SET DATA TYPE "public"."enum_site_settings_appearance_color_scheme" USING "appearance_color_scheme"::"public"."enum_site_settings_appearance_color_scheme";`)
}
