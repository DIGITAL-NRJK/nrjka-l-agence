import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_content" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_archive" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_promise" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_pillars" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_method" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_lab" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_commitments" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_partners" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_testimonials_block" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_resources_block" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_cta_final" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_presence" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_case_studies_index" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_about_hero" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_d4_cards" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_distinctions" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_stats_band" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_team" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_resources_catalog" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_archive" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_promise" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_pillars" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_method" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_lab" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_commitments" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_partners" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_testimonials_block" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_resources_block" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_cta_final" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_contact" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_presence" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_case_studies_index" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_about_hero" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_d4_cards" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_distinctions" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_stats_band" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_team" ADD COLUMN "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_resources_catalog" ADD COLUMN "hidden" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_content" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_archive" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_promise" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_pillars" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_method" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_lab" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_commitments" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_partners" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_testimonials_block" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_resources_block" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_cta_final" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_presence" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_case_studies_index" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_about_hero" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_d4_cards" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_distinctions" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_stats_band" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_team" DROP COLUMN "hidden";
  ALTER TABLE "pages_blocks_resources_catalog" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_archive" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_promise" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_pillars" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_method" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_lab" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_commitments" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_partners" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_testimonials_block" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_resources_block" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_cta_final" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_contact" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_presence" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_case_studies_index" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_about_hero" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_d4_cards" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_distinctions" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_stats_band" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_team" DROP COLUMN "hidden";
  ALTER TABLE "_pages_v_blocks_resources_catalog" DROP COLUMN "hidden";`)
}
