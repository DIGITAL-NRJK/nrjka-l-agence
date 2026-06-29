import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Garde-fou baseline : si le schéma existe DÉJÀ (base synchronisée historiquement en
  // push:true, ou clones Neon créés par PR), cette migration ne doit RIEN faire — sinon
  // elle tenterait de recréer des tables existantes et échouerait. Elle ne sert qu'à
  // (re)construire une base VIERGE (premier déploiement Netlify). Sentinelle = table `users`.
  const probe: unknown = await db.execute(sql`SELECT to_regclass('public.users') AS reg`)
  const reg =
    ((probe as { rows?: Array<{ reg: string | null }> })?.rows?.[0] ??
      (probe as Array<{ reg: string | null }>)?.[0])?.reg
  if (reg) {
    payload.logger.info('Baseline ignorée : le schéma est déjà présent (no-op).')
    return
  }

  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_blocks_promise_features_icon" AS ENUM('userCheck', 'layers', 'shield', 'zap', 'heart', 'target', 'rocket', 'lightbulb', 'handshake', 'lock', 'globe', 'barChart', 'messageCircle', 'clock', 'leaf', 'award', 'wrench', 'search', 'trendingUp', 'sparkles');
  CREATE TYPE "public"."enum_pages_blocks_promise_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_promise_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_pillars_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_pillars_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_method_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_method_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_lab_demos_status" AS ENUM('live', 'soon');
  CREATE TYPE "public"."enum_pages_blocks_lab_demos_preview_type" AS ENUM('sync', 'dashboard', 'calendar', 'chat', 'form', 'content', 'security');
  CREATE TYPE "public"."enum_pages_blocks_lab_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_lab_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_commitments_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_commitments_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_partners_technologies_category" AS ENUM('web', 'data', 'automation', 'ai', 'security', 'other');
  CREATE TYPE "public"."enum_pages_blocks_partners_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_partners_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_block_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_block_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_resources_block_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_resources_block_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_cta_final_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_cta_final_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_contact_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_contact_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_presence_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_presence_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_case_studies_index_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_case_studies_index_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_faq_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_faq_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_about_hero_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_about_hero_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_d4_cards_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_d4_cards_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_distinctions_items_icon" AS ENUM('userCheck', 'layers', 'shield', 'zap', 'heart', 'target', 'rocket', 'lightbulb', 'handshake', 'lock', 'globe', 'barChart', 'messageCircle', 'clock', 'leaf', 'award', 'wrench', 'search', 'trendingUp', 'sparkles');
  CREATE TYPE "public"."enum_pages_blocks_distinctions_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_distinctions_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_stats_band_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_stats_band_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_team_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_team_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_resources_catalog_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_resources_catalog_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'homeNRJKA');
  CREATE TYPE "public"."enum_pages_hero_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_hero_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum__pages_v_blocks_promise_features_icon" AS ENUM('userCheck', 'layers', 'shield', 'zap', 'heart', 'target', 'rocket', 'lightbulb', 'handshake', 'lock', 'globe', 'barChart', 'messageCircle', 'clock', 'leaf', 'award', 'wrench', 'search', 'trendingUp', 'sparkles');
  CREATE TYPE "public"."enum__pages_v_blocks_promise_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_promise_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_pillars_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_pillars_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_method_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_method_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_lab_demos_status" AS ENUM('live', 'soon');
  CREATE TYPE "public"."enum__pages_v_blocks_lab_demos_preview_type" AS ENUM('sync', 'dashboard', 'calendar', 'chat', 'form', 'content', 'security');
  CREATE TYPE "public"."enum__pages_v_blocks_lab_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_lab_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_commitments_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_commitments_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_partners_technologies_category" AS ENUM('web', 'data', 'automation', 'ai', 'security', 'other');
  CREATE TYPE "public"."enum__pages_v_blocks_partners_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_partners_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_block_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_block_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_resources_block_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_resources_block_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_final_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_final_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_presence_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_presence_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_case_studies_index_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_case_studies_index_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_about_hero_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_about_hero_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_d4_cards_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_d4_cards_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_distinctions_items_icon" AS ENUM('userCheck', 'layers', 'shield', 'zap', 'heart', 'target', 'rocket', 'lightbulb', 'handshake', 'lock', 'globe', 'barChart', 'messageCircle', 'clock', 'leaf', 'award', 'wrench', 'search', 'trendingUp', 'sparkles');
  CREATE TYPE "public"."enum__pages_v_blocks_distinctions_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_distinctions_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_band_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_band_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_team_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_team_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_resources_catalog_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_resources_catalog_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'homeNRJKA');
  CREATE TYPE "public"."enum__pages_v_version_hero_appearance_title_size" AS ENUM('default', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_version_hero_appearance_text_size" AS ENUM('default', 'sm', 'base', 'lg');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'contributor', 'visitor');
  CREATE TYPE "public"."enum_products_category" AS ENUM('templates', 'formations', 'tools', 'packs');
  CREATE TYPE "public"."enum_contact_messages_type" AS ENUM('general', 'quote', 'support', 'partnership');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'reading', 'in-progress', 'answered', 'archived');
  CREATE TYPE "public"."enum_reviews_service_category" AS ENUM('web', 'seo', 'automation', 'ecommerce', 'maintenance', 'training', 'general');
  CREATE TYPE "public"."enum_job_offers_contract_type" AS ENUM('cdi', 'cdd', 'freelance', 'internship', 'apprenticeship');
  CREATE TYPE "public"."enum_job_applications_status" AS ENUM('new', 'reviewing', 'interview', 'accepted', 'rejected');
  CREATE TYPE "public"."enum_appointments_status" AS ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled');
  CREATE TYPE "public"."enum_blog_comments_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_resources_category" AS ENUM('guide', 'template', 'checklist', 'ebook', 'tool');
  CREATE TYPE "public"."enum_resources_format" AS ENUM('pdf', 'docx', 'xlsx', 'notion', 'figma', 'other');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_site_settings_maintenance_mode_mode" AS ENUM('maintenance', 'coming_soon');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_hero_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_hero_panel_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_promise_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_promise_features_icon" DEFAULT 'userCheck',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_promise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_promise_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_promise_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_promise_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"commitment" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_pillars_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_pillars_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pillars_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_method_steps_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_method_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar
  );
  
  CREATE TABLE "pages_blocks_method" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_method_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_method_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_method_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_lab_demos_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_lab_demos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"sector" varchar,
  	"title" varchar,
  	"description" varchar,
  	"status" "enum_pages_blocks_lab_demos_status" DEFAULT 'soon',
  	"preview_type" "enum_pages_blocks_lab_demos_preview_type" DEFAULT 'sync',
  	"media_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_lab" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"appearance_title_size" "enum_pages_blocks_lab_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_lab_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lab_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_commitments_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_commitments_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_commitments_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_commitments_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_partners_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category" "enum_pages_blocks_partners_technologies_category" DEFAULT 'web',
  	"logo_id" integer,
  	"open_source" boolean DEFAULT true
  );
  
  CREATE TABLE "pages_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"projects_limit" numeric DEFAULT 3,
  	"cta_href" varchar,
  	"appearance_title_size" "enum_pages_blocks_partners_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_partners_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_partners_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"tech_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"appearance_title_size" "enum_pages_blocks_testimonials_block_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_testimonials_block_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_block_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_resources_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"appearance_title_size" "enum_pages_blocks_resources_block_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_resources_block_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_resources_block_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_final" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"primary_cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"appearance_title_size" "enum_pages_blocks_cta_final_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_cta_final_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_final_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"note" varchar,
  	"primary_cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT 'messageSquare',
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"appearance_title_size" "enum_pages_blocks_contact_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_contact_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"title_accent" varchar,
  	"subtitle" varchar,
  	"steps_heading" varchar,
  	"email_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_presence_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar,
  	"country" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"lat" numeric,
  	"lng" numeric,
  	"is_headquarters" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_presence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_presence_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_presence_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_presence_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_case_studies_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_case_studies_index_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_case_studies_index_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_case_studies_index_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_faq_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_faq_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_about_hero_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_about_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_about_hero_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_about_hero_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_hero_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"title_accent" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_d4_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar
  );
  
  CREATE TABLE "pages_blocks_d4_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_d4_cards_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_d4_cards_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_d4_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_distinctions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_distinctions_items_icon" DEFAULT 'shield',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_distinctions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_distinctions_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_distinctions_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_distinctions_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_band_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_stats_band_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_stats_band_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar
  );
  
  CREATE TABLE "pages_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_team_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_team_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_resources_catalog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum_pages_blocks_resources_catalog_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum_pages_blocks_resources_catalog_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_resources_catalog_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"hero_primary_cta_href" varchar,
  	"hero_secondary_cta_href" varchar,
  	"hero_appearance_title_size" "enum_pages_hero_appearance_title_size" DEFAULT 'default',
  	"hero_appearance_text_size" "enum_pages_hero_appearance_text_size" DEFAULT 'default',
  	"hero_appearance_title_color" varchar,
  	"hero_appearance_text_color" varchar,
  	"hero_appearance_background" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"hero_badge" varchar,
  	"hero_headline" varchar,
  	"hero_headline_accent" varchar,
  	"hero_subtitle" varchar,
  	"hero_primary_cta_label" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_panel_eyebrow" varchar,
  	"hero_panel_title" varchar,
  	"hero_panel_availability" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_panel_dimensions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promise_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_promise_features_icon" DEFAULT 'userCheck',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_promise_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_promise_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_promise_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"commitment" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_pillars_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_pillars_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pillars_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_method_steps_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_method_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_method" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_method_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_method_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_method_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_lab_demos_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lab_demos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"sector" varchar,
  	"title" varchar,
  	"description" varchar,
  	"status" "enum__pages_v_blocks_lab_demos_status" DEFAULT 'soon',
  	"preview_type" "enum__pages_v_blocks_lab_demos_preview_type" DEFAULT 'sync',
  	"media_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lab" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_href" varchar,
  	"appearance_title_size" "enum__pages_v_blocks_lab_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_lab_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lab_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_commitments_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"keyword" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_commitments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_commitments_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_commitments_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_commitments_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_partners_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"category" "enum__pages_v_blocks_partners_technologies_category" DEFAULT 'web',
  	"logo_id" integer,
  	"open_source" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"projects_limit" numeric DEFAULT 3,
  	"cta_href" varchar,
  	"appearance_title_size" "enum__pages_v_blocks_partners_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_partners_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_partners_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"tech_label" varchar,
  	"cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 6,
  	"appearance_title_size" "enum__pages_v_blocks_testimonials_block_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_testimonials_block_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_block_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_resources_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"limit" numeric DEFAULT 3,
  	"appearance_title_size" "enum__pages_v_blocks_resources_block_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_resources_block_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_resources_block_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_final" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"primary_cta_href" varchar,
  	"secondary_cta_href" varchar,
  	"appearance_title_size" "enum__pages_v_blocks_cta_final_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_cta_final_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_final_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" varchar,
  	"note" varchar,
  	"primary_cta_label" varchar,
  	"secondary_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar DEFAULT 'messageSquare',
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"appearance_title_size" "enum__pages_v_blocks_contact_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_contact_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"title_accent" varchar,
  	"subtitle" varchar,
  	"steps_heading" varchar,
  	"email_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_presence_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"city" varchar,
  	"country" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"lat" numeric,
  	"lng" numeric,
  	"is_headquarters" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_presence" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_presence_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_presence_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_presence_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_case_studies_index" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_case_studies_index_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_case_studies_index_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_studies_index_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_faq_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_faq_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_about_hero_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_about_hero_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_about_hero_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_hero_locales" (
  	"badge" varchar,
  	"title" varchar,
  	"title_accent" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_d4_cards_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_d4_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_d4_cards_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_d4_cards_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_d4_cards_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_distinctions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_distinctions_items_icon" DEFAULT 'shield',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_distinctions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_distinctions_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_distinctions_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_distinctions_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats_band_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_stats_band_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_stats_band_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_team_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_team_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_resources_catalog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"appearance_title_size" "enum__pages_v_blocks_resources_catalog_appearance_title_size" DEFAULT 'default',
  	"appearance_text_size" "enum__pages_v_blocks_resources_catalog_appearance_text_size" DEFAULT 'default',
  	"appearance_title_color" varchar,
  	"appearance_text_color" varchar,
  	"appearance_background" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_resources_catalog_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_rich_text" jsonb,
  	"version_hero_media_id" integer,
  	"version_hero_primary_cta_href" varchar,
  	"version_hero_secondary_cta_href" varchar,
  	"version_hero_appearance_title_size" "enum__pages_v_version_hero_appearance_title_size" DEFAULT 'default',
  	"version_hero_appearance_text_size" "enum__pages_v_version_hero_appearance_text_size" DEFAULT 'default',
  	"version_hero_appearance_title_color" varchar,
  	"version_hero_appearance_text_color" varchar,
  	"version_hero_appearance_background" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_hero_badge" varchar,
  	"version_hero_headline" varchar,
  	"version_hero_headline_accent" varchar,
  	"version_hero_subtitle" varchar,
  	"version_hero_primary_cta_label" varchar,
  	"version_hero_secondary_cta_label" varchar,
  	"version_hero_panel_eyebrow" varchar,
  	"version_hero_panel_title" varchar,
  	"version_hero_panel_availability" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "posts_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "_posts_v_version_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" jsonb,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_xlarge_url" varchar,
  	"sizes_xlarge_width" numeric,
  	"sizes_xlarge_height" numeric,
  	"sizes_xlarge_mime_type" varchar,
  	"sizes_xlarge_filesize" numeric,
  	"sizes_xlarge_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"parent_id" integer,
  	"path_title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'visitor',
  	"first_name" varchar,
  	"last_name" varchar,
  	"phone" varchar,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "expertises_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "expertises_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "expertises_benefits_locales" (
  	"benefit" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "expertises_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "expertises_process_steps_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "expertises_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "expertises_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "expertises_faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "expertises" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"icon" varchar,
  	"featured" boolean DEFAULT false,
  	"published" boolean DEFAULT true,
  	"order" numeric,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "expertises_locales" (
  	"subtitle" varchar,
  	"description" varchar NOT NULL,
  	"long_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL,
  	"feature_en" varchar
  );
  
  CREATE TABLE "services_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar NOT NULL,
  	"benefit_en" varchar
  );
  
  CREATE TABLE "services_besoins" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_besoins_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer
  );
  
  CREATE TABLE "services_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "services_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"question_en" varchar,
  	"answer_en" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"title_en" varchar,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"description_en" varchar,
  	"long_description" jsonb,
  	"long_description_en" jsonb,
  	"pole_id" integer NOT NULL,
  	"image_id" integer,
  	"icon" varchar,
  	"pricing_start" numeric,
  	"published" boolean DEFAULT false,
  	"order" numeric,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"case_studies_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "case_studies_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "case_studies_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"quote_en" varchar,
  	"author" varchar,
  	"author_role" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"excerpt_en" varchar,
  	"industry_id" integer,
  	"category_id" integer,
  	"image_id" integer,
  	"logo_id" integer,
  	"challenge" jsonb,
  	"challenge_en" jsonb,
  	"solution" jsonb,
  	"solution_en" jsonb,
  	"results" jsonb,
  	"results_en" jsonb,
  	"duration" varchar,
  	"team_size" numeric,
  	"is_featured" boolean DEFAULT false,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"expertises_id" integer
  );
  
  CREATE TABLE "case_study_sectors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "case_study_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "products_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "products_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "products_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"benefit" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"long_description" jsonb,
  	"price" numeric NOT NULL,
  	"image_id" integer,
  	"category" "enum_products_category",
  	"rating" numeric,
  	"reviews" numeric,
  	"bestseller" boolean DEFAULT false,
  	"stripe_product_id" varchar,
  	"stripe_price_id" varchar,
  	"published" boolean DEFAULT false,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_messages_services_needed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "contact_messages_priorities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"priority" varchar
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"company" varchar,
  	"message" varchar NOT NULL,
  	"type" "enum_contact_messages_type" DEFAULT 'general',
  	"context" varchar,
  	"source_tool" varchar,
  	"service_type" varchar,
  	"budget" varchar,
  	"status" "enum_contact_messages_status" DEFAULT 'new',
  	"has_appointment" boolean DEFAULT false,
  	"appointment_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_role" varchar,
  	"company" varchar,
  	"avatar_id" integer,
  	"avatar_url" varchar,
  	"rating" numeric NOT NULL,
  	"content" varchar NOT NULL,
  	"service_category" "enum_reviews_service_category",
  	"is_featured" boolean DEFAULT false,
  	"approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_role" varchar,
  	"company" varchar,
  	"avatar_id" integer,
  	"avatar_url" varchar,
  	"content" varchar NOT NULL,
  	"content_en" varchar,
  	"rating" numeric,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_offers_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"item_en" varchar
  );
  
  CREATE TABLE "job_offers_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"item_en" varchar
  );
  
  CREATE TABLE "job_offers_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"item_en" varchar
  );
  
  CREATE TABLE "job_offers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"title_en" varchar,
  	"slug" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"description_en" jsonb,
  	"contract_type" "enum_job_offers_contract_type" NOT NULL,
  	"location" varchar,
  	"salary_range" varchar,
  	"published" boolean DEFAULT false,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"linkedin_url" varchar,
  	"portfolio_url" varchar,
  	"cover_letter" varchar,
  	"resume_id" integer,
  	"job_offer_id" integer,
  	"status" "enum_job_applications_status" DEFAULT 'new',
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "appointments_priorities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"priority" varchar
  );
  
  CREATE TABLE "appointments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"client_email" varchar NOT NULL,
  	"client_phone" varchar,
  	"company" varchar,
  	"appointment_date" timestamp(3) with time zone NOT NULL,
  	"source_tool" varchar,
  	"project_summary" varchar,
  	"notes" varchar,
  	"status" "enum_appointments_status" DEFAULT 'scheduled',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_comments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author_name" varchar NOT NULL,
  	"author_email" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"blog_post_id" integer NOT NULL,
  	"status" "enum_blog_comments_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resources_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL,
  	"feature_en" varchar
  );
  
  CREATE TABLE "resources_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"title_en" varchar,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"description_en" varchar,
  	"category" "enum_resources_category",
  	"format" "enum_resources_format",
  	"file_id" integer,
  	"file_url" varchar,
  	"thumbnail_id" integer,
  	"preview_url" varchar,
  	"is_free" boolean DEFAULT true,
  	"requires_contact" boolean DEFAULT false,
  	"downloads" numeric DEFAULT 0,
  	"published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"relation_to" varchar,
  	"category_i_d" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"priority" numeric,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"users_id" integer,
  	"expertises_id" integer,
  	"services_id" integer,
  	"case_studies_id" integer,
  	"case_study_sectors_id" integer,
  	"case_study_types_id" integer,
  	"products_id" integer,
  	"contact_messages_id" integer,
  	"reviews_id" integer,
  	"testimonials_id" integer,
  	"job_offers_id" integer,
  	"job_applications_id" integer,
  	"appointments_id" integer,
  	"blog_comments_id" integer,
  	"resources_id" integer,
  	"redirects_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"search_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "header_megamenu_poles_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_id" integer NOT NULL,
  	"label_override" varchar
  );
  
  CREATE TABLE "header_megamenu_poles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pole_id" integer NOT NULL,
  	"label_override" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"megamenu_trigger_label" varchar DEFAULT 'Services',
  	"megamenu_nav_position" numeric DEFAULT 1,
  	"megamenu_rail_label" varchar DEFAULT 'Pôles principaux',
  	"megamenu_cta_primary_label" varchar DEFAULT 'Démarrer un projet',
  	"megamenu_cta_primary_href" varchar DEFAULT '/contact',
  	"megamenu_cta_secondary_label" varchar DEFAULT 'Parler à un expert',
  	"megamenu_cta_secondary_href" varchar DEFAULT '/contact',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "site_settings_maintenance_mode_allowed_ips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ip" varchar
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_site_name" varchar DEFAULT 'NRJKA',
  	"seo_title_suffix" varchar DEFAULT '— NRJKA',
  	"seo_default_og_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"social_linkedin" varchar,
  	"social_instagram" varchar,
  	"social_facebook" varchar,
  	"social_twitter" varchar,
  	"social_youtube" varchar,
  	"social_tiktok" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_address_line" varchar,
  	"contact_postal_code" varchar,
  	"contact_city" varchar,
  	"contact_country" varchar DEFAULT 'France',
  	"contact_google_maps_url" varchar,
  	"analytics_ga4_measurement_id" varchar,
  	"analytics_gtm_container_id" varchar,
  	"analytics_meta_pixel_id" varchar,
  	"analytics_linkedin_partner_id" varchar,
  	"maintenance_mode_enabled" boolean DEFAULT false,
  	"maintenance_mode_mode" "enum_site_settings_maintenance_mode_mode" DEFAULT 'maintenance',
  	"maintenance_mode_countdown_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"seo_default_meta_title" varchar,
  	"seo_default_meta_description" varchar,
  	"maintenance_mode_title" varchar DEFAULT 'Site en maintenance',
  	"maintenance_mode_message" varchar DEFAULT 'Nous effectuons une maintenance. Revenez bientôt.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_trust_badges" ADD CONSTRAINT "pages_hero_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_stats" ADD CONSTRAINT "pages_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_panel_dimensions" ADD CONSTRAINT "pages_hero_panel_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promise_features" ADD CONSTRAINT "pages_blocks_promise_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_promise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promise" ADD CONSTRAINT "pages_blocks_promise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_promise_locales" ADD CONSTRAINT "pages_blocks_promise_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_promise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillars" ADD CONSTRAINT "pages_blocks_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pillars_locales" ADD CONSTRAINT "pages_blocks_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_steps_activities" ADD CONSTRAINT "pages_blocks_method_steps_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_steps" ADD CONSTRAINT "pages_blocks_method_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method" ADD CONSTRAINT "pages_blocks_method_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_method_locales" ADD CONSTRAINT "pages_blocks_method_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_method"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lab_demos_stack" ADD CONSTRAINT "pages_blocks_lab_demos_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lab_demos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lab_demos" ADD CONSTRAINT "pages_blocks_lab_demos_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_lab_demos" ADD CONSTRAINT "pages_blocks_lab_demos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lab" ADD CONSTRAINT "pages_blocks_lab_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lab_locales" ADD CONSTRAINT "pages_blocks_lab_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_commitments_commitments" ADD CONSTRAINT "pages_blocks_commitments_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_commitments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_commitments" ADD CONSTRAINT "pages_blocks_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_commitments_locales" ADD CONSTRAINT "pages_blocks_commitments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_commitments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_technologies" ADD CONSTRAINT "pages_blocks_partners_technologies_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_technologies" ADD CONSTRAINT "pages_blocks_partners_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners" ADD CONSTRAINT "pages_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_partners_locales" ADD CONSTRAINT "pages_blocks_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_block" ADD CONSTRAINT "pages_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_block_locales" ADD CONSTRAINT "pages_blocks_testimonials_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_resources_block" ADD CONSTRAINT "pages_blocks_resources_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_resources_block_locales" ADD CONSTRAINT "pages_blocks_resources_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_resources_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_final" ADD CONSTRAINT "pages_blocks_cta_final_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_final_locales" ADD CONSTRAINT "pages_blocks_cta_final_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_final"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_steps" ADD CONSTRAINT "pages_blocks_contact_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_locales" ADD CONSTRAINT "pages_blocks_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_presence_locations" ADD CONSTRAINT "pages_blocks_presence_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_presence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_presence" ADD CONSTRAINT "pages_blocks_presence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_presence_locales" ADD CONSTRAINT "pages_blocks_presence_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_presence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_studies_index" ADD CONSTRAINT "pages_blocks_case_studies_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_studies_index_locales" ADD CONSTRAINT "pages_blocks_case_studies_index_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_studies_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_hero_chips" ADD CONSTRAINT "pages_blocks_about_hero_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_hero" ADD CONSTRAINT "pages_blocks_about_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_hero_locales" ADD CONSTRAINT "pages_blocks_about_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_d4_cards_cards" ADD CONSTRAINT "pages_blocks_d4_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_d4_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_d4_cards" ADD CONSTRAINT "pages_blocks_d4_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_d4_cards_locales" ADD CONSTRAINT "pages_blocks_d4_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_d4_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_distinctions_items" ADD CONSTRAINT "pages_blocks_distinctions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_distinctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_distinctions" ADD CONSTRAINT "pages_blocks_distinctions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_distinctions_locales" ADD CONSTRAINT "pages_blocks_distinctions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_distinctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_band_items" ADD CONSTRAINT "pages_blocks_stats_band_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_band" ADD CONSTRAINT "pages_blocks_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_members" ADD CONSTRAINT "pages_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team" ADD CONSTRAINT "pages_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_locales" ADD CONSTRAINT "pages_blocks_team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_resources_catalog" ADD CONSTRAINT "pages_blocks_resources_catalog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_resources_catalog_locales" ADD CONSTRAINT "pages_blocks_resources_catalog_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_resources_catalog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_trust_badges" ADD CONSTRAINT "_pages_v_version_hero_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_stats" ADD CONSTRAINT "_pages_v_version_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_panel_dimensions" ADD CONSTRAINT "_pages_v_version_hero_panel_dimensions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promise_features" ADD CONSTRAINT "_pages_v_blocks_promise_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_promise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promise" ADD CONSTRAINT "_pages_v_blocks_promise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_promise_locales" ADD CONSTRAINT "_pages_v_blocks_promise_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_promise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillars" ADD CONSTRAINT "_pages_v_blocks_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pillars_locales" ADD CONSTRAINT "_pages_v_blocks_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_steps_activities" ADD CONSTRAINT "_pages_v_blocks_method_steps_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_steps" ADD CONSTRAINT "_pages_v_blocks_method_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method" ADD CONSTRAINT "_pages_v_blocks_method_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_method_locales" ADD CONSTRAINT "_pages_v_blocks_method_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_method"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_demos_stack" ADD CONSTRAINT "_pages_v_blocks_lab_demos_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lab_demos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_demos" ADD CONSTRAINT "_pages_v_blocks_lab_demos_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_demos" ADD CONSTRAINT "_pages_v_blocks_lab_demos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab" ADD CONSTRAINT "_pages_v_blocks_lab_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lab_locales" ADD CONSTRAINT "_pages_v_blocks_lab_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lab"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_commitments_commitments" ADD CONSTRAINT "_pages_v_blocks_commitments_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_commitments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_commitments" ADD CONSTRAINT "_pages_v_blocks_commitments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_commitments_locales" ADD CONSTRAINT "_pages_v_blocks_commitments_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_commitments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_technologies" ADD CONSTRAINT "_pages_v_blocks_partners_technologies_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_technologies" ADD CONSTRAINT "_pages_v_blocks_partners_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners" ADD CONSTRAINT "_pages_v_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_partners_locales" ADD CONSTRAINT "_pages_v_blocks_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_block" ADD CONSTRAINT "_pages_v_blocks_testimonials_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_block_locales" ADD CONSTRAINT "_pages_v_blocks_testimonials_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_resources_block" ADD CONSTRAINT "_pages_v_blocks_resources_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_resources_block_locales" ADD CONSTRAINT "_pages_v_blocks_resources_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_resources_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_final" ADD CONSTRAINT "_pages_v_blocks_cta_final_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_final_locales" ADD CONSTRAINT "_pages_v_blocks_cta_final_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_final"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_steps" ADD CONSTRAINT "_pages_v_blocks_contact_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_locales" ADD CONSTRAINT "_pages_v_blocks_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_presence_locations" ADD CONSTRAINT "_pages_v_blocks_presence_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_presence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_presence" ADD CONSTRAINT "_pages_v_blocks_presence_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_presence_locales" ADD CONSTRAINT "_pages_v_blocks_presence_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_presence"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_studies_index" ADD CONSTRAINT "_pages_v_blocks_case_studies_index_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_studies_index_locales" ADD CONSTRAINT "_pages_v_blocks_case_studies_index_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_studies_index"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_hero_chips" ADD CONSTRAINT "_pages_v_blocks_about_hero_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_hero" ADD CONSTRAINT "_pages_v_blocks_about_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_hero_locales" ADD CONSTRAINT "_pages_v_blocks_about_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_d4_cards_cards" ADD CONSTRAINT "_pages_v_blocks_d4_cards_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_d4_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_d4_cards" ADD CONSTRAINT "_pages_v_blocks_d4_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_d4_cards_locales" ADD CONSTRAINT "_pages_v_blocks_d4_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_d4_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_distinctions_items" ADD CONSTRAINT "_pages_v_blocks_distinctions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_distinctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_distinctions" ADD CONSTRAINT "_pages_v_blocks_distinctions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_distinctions_locales" ADD CONSTRAINT "_pages_v_blocks_distinctions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_distinctions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_band_items" ADD CONSTRAINT "_pages_v_blocks_stats_band_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_band" ADD CONSTRAINT "_pages_v_blocks_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_members" ADD CONSTRAINT "_pages_v_blocks_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team" ADD CONSTRAINT "_pages_v_blocks_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_locales" ADD CONSTRAINT "_pages_v_blocks_team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_resources_catalog" ADD CONSTRAINT "_pages_v_blocks_resources_catalog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_resources_catalog_locales" ADD CONSTRAINT "_pages_v_blocks_resources_catalog_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_resources_catalog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_populated_authors" ADD CONSTRAINT "posts_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_populated_authors" ADD CONSTRAINT "_posts_v_version_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_doc_id_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_breadcrumbs" ADD CONSTRAINT "categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertises_highlights" ADD CONSTRAINT "expertises_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertises_benefits" ADD CONSTRAINT "expertises_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertises_benefits_locales" ADD CONSTRAINT "expertises_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertises_process_steps" ADD CONSTRAINT "expertises_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertises_process_steps_locales" ADD CONSTRAINT "expertises_process_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertises_technologies" ADD CONSTRAINT "expertises_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertises_faqs" ADD CONSTRAINT "expertises_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertises_faqs_locales" ADD CONSTRAINT "expertises_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises_faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expertises_locales" ADD CONSTRAINT "expertises_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_benefits" ADD CONSTRAINT "services_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_besoins" ADD CONSTRAINT "services_besoins_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_besoins_locales" ADD CONSTRAINT "services_besoins_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_besoins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_technologies" ADD CONSTRAINT "services_technologies_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_technologies" ADD CONSTRAINT "services_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process_steps" ADD CONSTRAINT "services_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faqs" ADD CONSTRAINT "services_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_pole_id_expertises_id_fk" FOREIGN KEY ("pole_id") REFERENCES "public"."expertises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_metrics" ADD CONSTRAINT "case_studies_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_technologies" ADD CONSTRAINT "case_studies_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_testimonials" ADD CONSTRAINT "case_studies_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_industry_id_case_study_sectors_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."case_study_sectors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_category_id_case_study_types_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."case_study_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_expertises_fk" FOREIGN KEY ("expertises_id") REFERENCES "public"."expertises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_features" ADD CONSTRAINT "products_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_includes" ADD CONSTRAINT "products_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_benefits" ADD CONSTRAINT "products_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_messages_services_needed" ADD CONSTRAINT "contact_messages_services_needed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_messages_priorities" ADD CONSTRAINT "contact_messages_priorities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_offers_responsibilities" ADD CONSTRAINT "job_offers_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_offers_requirements" ADD CONSTRAINT "job_offers_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_offers_benefits" ADD CONSTRAINT "job_offers_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resume_id_media_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_offer_id_job_offers_id_fk" FOREIGN KEY ("job_offer_id") REFERENCES "public"."job_offers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "appointments_priorities" ADD CONSTRAINT "appointments_priorities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_comments" ADD CONSTRAINT "blog_comments_blog_post_id_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_features" ADD CONSTRAINT "resources_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_tags" ADD CONSTRAINT "resources_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_categories" ADD CONSTRAINT "search_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_expertises_fk" FOREIGN KEY ("expertises_id") REFERENCES "public"."expertises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_study_sectors_fk" FOREIGN KEY ("case_study_sectors_id") REFERENCES "public"."case_study_sectors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_study_types_fk" FOREIGN KEY ("case_study_types_id") REFERENCES "public"."case_study_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_offers_fk" FOREIGN KEY ("job_offers_id") REFERENCES "public"."job_offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointments_fk" FOREIGN KEY ("appointments_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_comments_fk" FOREIGN KEY ("blog_comments_id") REFERENCES "public"."blog_comments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_megamenu_poles_services" ADD CONSTRAINT "header_megamenu_poles_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_megamenu_poles_services" ADD CONSTRAINT "header_megamenu_poles_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_megamenu_poles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_megamenu_poles" ADD CONSTRAINT "header_megamenu_poles_pole_id_expertises_id_fk" FOREIGN KEY ("pole_id") REFERENCES "public"."expertises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_megamenu_poles" ADD CONSTRAINT "header_megamenu_poles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_maintenance_mode_allowed_ips" ADD CONSTRAINT "site_settings_maintenance_mode_allowed_ips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_default_og_image_id_media_id_fk" FOREIGN KEY ("seo_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_trust_badges_order_idx" ON "pages_hero_trust_badges" USING btree ("_order");
  CREATE INDEX "pages_hero_trust_badges_parent_id_idx" ON "pages_hero_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_trust_badges_locale_idx" ON "pages_hero_trust_badges" USING btree ("_locale");
  CREATE INDEX "pages_hero_stats_order_idx" ON "pages_hero_stats" USING btree ("_order");
  CREATE INDEX "pages_hero_stats_parent_id_idx" ON "pages_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_stats_locale_idx" ON "pages_hero_stats" USING btree ("_locale");
  CREATE INDEX "pages_hero_panel_dimensions_order_idx" ON "pages_hero_panel_dimensions" USING btree ("_order");
  CREATE INDEX "pages_hero_panel_dimensions_parent_id_idx" ON "pages_hero_panel_dimensions" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_panel_dimensions_locale_idx" ON "pages_hero_panel_dimensions" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_blocks_promise_features_order_idx" ON "pages_blocks_promise_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_promise_features_parent_id_idx" ON "pages_blocks_promise_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promise_features_locale_idx" ON "pages_blocks_promise_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_promise_order_idx" ON "pages_blocks_promise" USING btree ("_order");
  CREATE INDEX "pages_blocks_promise_parent_id_idx" ON "pages_blocks_promise" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_promise_path_idx" ON "pages_blocks_promise" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_promise_locales_locale_parent_id_unique" ON "pages_blocks_promise_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_pillars_order_idx" ON "pages_blocks_pillars" USING btree ("_order");
  CREATE INDEX "pages_blocks_pillars_parent_id_idx" ON "pages_blocks_pillars" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pillars_path_idx" ON "pages_blocks_pillars" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_pillars_locales_locale_parent_id_unique" ON "pages_blocks_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_method_steps_activities_order_idx" ON "pages_blocks_method_steps_activities" USING btree ("_order");
  CREATE INDEX "pages_blocks_method_steps_activities_parent_id_idx" ON "pages_blocks_method_steps_activities" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_method_steps_activities_locale_idx" ON "pages_blocks_method_steps_activities" USING btree ("_locale");
  CREATE INDEX "pages_blocks_method_steps_order_idx" ON "pages_blocks_method_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_method_steps_parent_id_idx" ON "pages_blocks_method_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_method_steps_locale_idx" ON "pages_blocks_method_steps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_method_order_idx" ON "pages_blocks_method" USING btree ("_order");
  CREATE INDEX "pages_blocks_method_parent_id_idx" ON "pages_blocks_method" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_method_path_idx" ON "pages_blocks_method" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_method_locales_locale_parent_id_unique" ON "pages_blocks_method_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_lab_demos_stack_order_idx" ON "pages_blocks_lab_demos_stack" USING btree ("_order");
  CREATE INDEX "pages_blocks_lab_demos_stack_parent_id_idx" ON "pages_blocks_lab_demos_stack" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lab_demos_stack_locale_idx" ON "pages_blocks_lab_demos_stack" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lab_demos_order_idx" ON "pages_blocks_lab_demos" USING btree ("_order");
  CREATE INDEX "pages_blocks_lab_demos_parent_id_idx" ON "pages_blocks_lab_demos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lab_demos_locale_idx" ON "pages_blocks_lab_demos" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lab_demos_media_idx" ON "pages_blocks_lab_demos" USING btree ("media_id");
  CREATE INDEX "pages_blocks_lab_order_idx" ON "pages_blocks_lab" USING btree ("_order");
  CREATE INDEX "pages_blocks_lab_parent_id_idx" ON "pages_blocks_lab" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lab_path_idx" ON "pages_blocks_lab" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_lab_locales_locale_parent_id_unique" ON "pages_blocks_lab_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_commitments_commitments_order_idx" ON "pages_blocks_commitments_commitments" USING btree ("_order");
  CREATE INDEX "pages_blocks_commitments_commitments_parent_id_idx" ON "pages_blocks_commitments_commitments" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_commitments_commitments_locale_idx" ON "pages_blocks_commitments_commitments" USING btree ("_locale");
  CREATE INDEX "pages_blocks_commitments_order_idx" ON "pages_blocks_commitments" USING btree ("_order");
  CREATE INDEX "pages_blocks_commitments_parent_id_idx" ON "pages_blocks_commitments" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_commitments_path_idx" ON "pages_blocks_commitments" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_commitments_locales_locale_parent_id_unique" ON "pages_blocks_commitments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_partners_technologies_order_idx" ON "pages_blocks_partners_technologies" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_technologies_parent_id_idx" ON "pages_blocks_partners_technologies" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_technologies_logo_idx" ON "pages_blocks_partners_technologies" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_partners_order_idx" ON "pages_blocks_partners" USING btree ("_order");
  CREATE INDEX "pages_blocks_partners_parent_id_idx" ON "pages_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_partners_path_idx" ON "pages_blocks_partners" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_partners_locales_locale_parent_id_unique" ON "pages_blocks_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_testimonials_block_order_idx" ON "pages_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_block_parent_id_idx" ON "pages_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_block_path_idx" ON "pages_blocks_testimonials_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_testimonials_block_locales_locale_parent_id_uni" ON "pages_blocks_testimonials_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_resources_block_order_idx" ON "pages_blocks_resources_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_resources_block_parent_id_idx" ON "pages_blocks_resources_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_resources_block_path_idx" ON "pages_blocks_resources_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_resources_block_locales_locale_parent_id_unique" ON "pages_blocks_resources_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_final_order_idx" ON "pages_blocks_cta_final" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_final_parent_id_idx" ON "pages_blocks_cta_final" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_final_path_idx" ON "pages_blocks_cta_final" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_final_locales_locale_parent_id_unique" ON "pages_blocks_cta_final_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_contact_steps_order_idx" ON "pages_blocks_contact_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_steps_parent_id_idx" ON "pages_blocks_contact_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_steps_locale_idx" ON "pages_blocks_contact_steps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_contact_locales_locale_parent_id_unique" ON "pages_blocks_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_presence_locations_order_idx" ON "pages_blocks_presence_locations" USING btree ("_order");
  CREATE INDEX "pages_blocks_presence_locations_parent_id_idx" ON "pages_blocks_presence_locations" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_presence_order_idx" ON "pages_blocks_presence" USING btree ("_order");
  CREATE INDEX "pages_blocks_presence_parent_id_idx" ON "pages_blocks_presence" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_presence_path_idx" ON "pages_blocks_presence" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_presence_locales_locale_parent_id_unique" ON "pages_blocks_presence_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_case_studies_index_order_idx" ON "pages_blocks_case_studies_index" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_studies_index_parent_id_idx" ON "pages_blocks_case_studies_index" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_studies_index_path_idx" ON "pages_blocks_case_studies_index" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_case_studies_index_locales_locale_parent_id_uni" ON "pages_blocks_case_studies_index_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_items_locale_idx" ON "pages_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_about_hero_chips_order_idx" ON "pages_blocks_about_hero_chips" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_hero_chips_parent_id_idx" ON "pages_blocks_about_hero_chips" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_hero_chips_locale_idx" ON "pages_blocks_about_hero_chips" USING btree ("_locale");
  CREATE INDEX "pages_blocks_about_hero_order_idx" ON "pages_blocks_about_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_hero_parent_id_idx" ON "pages_blocks_about_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_hero_path_idx" ON "pages_blocks_about_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_about_hero_locales_locale_parent_id_unique" ON "pages_blocks_about_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_d4_cards_cards_order_idx" ON "pages_blocks_d4_cards_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_d4_cards_cards_parent_id_idx" ON "pages_blocks_d4_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_d4_cards_cards_locale_idx" ON "pages_blocks_d4_cards_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_d4_cards_order_idx" ON "pages_blocks_d4_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_d4_cards_parent_id_idx" ON "pages_blocks_d4_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_d4_cards_path_idx" ON "pages_blocks_d4_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_d4_cards_locales_locale_parent_id_unique" ON "pages_blocks_d4_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_distinctions_items_order_idx" ON "pages_blocks_distinctions_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_distinctions_items_parent_id_idx" ON "pages_blocks_distinctions_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_distinctions_items_locale_idx" ON "pages_blocks_distinctions_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_distinctions_order_idx" ON "pages_blocks_distinctions" USING btree ("_order");
  CREATE INDEX "pages_blocks_distinctions_parent_id_idx" ON "pages_blocks_distinctions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_distinctions_path_idx" ON "pages_blocks_distinctions" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_distinctions_locales_locale_parent_id_unique" ON "pages_blocks_distinctions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_band_items_order_idx" ON "pages_blocks_stats_band_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_band_items_parent_id_idx" ON "pages_blocks_stats_band_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_band_items_locale_idx" ON "pages_blocks_stats_band_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_stats_band_order_idx" ON "pages_blocks_stats_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_band_parent_id_idx" ON "pages_blocks_stats_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_band_path_idx" ON "pages_blocks_stats_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_members_order_idx" ON "pages_blocks_team_members" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_members_parent_id_idx" ON "pages_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_members_photo_idx" ON "pages_blocks_team_members" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_order_idx" ON "pages_blocks_team" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_parent_id_idx" ON "pages_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_path_idx" ON "pages_blocks_team" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_team_locales_locale_parent_id_unique" ON "pages_blocks_team_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_resources_catalog_order_idx" ON "pages_blocks_resources_catalog" USING btree ("_order");
  CREATE INDEX "pages_blocks_resources_catalog_parent_id_idx" ON "pages_blocks_resources_catalog" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_resources_catalog_path_idx" ON "pages_blocks_resources_catalog" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_resources_catalog_locales_locale_parent_id_uniq" ON "pages_blocks_resources_catalog_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_trust_badges_order_idx" ON "_pages_v_version_hero_trust_badges" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_trust_badges_parent_id_idx" ON "_pages_v_version_hero_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_trust_badges_locale_idx" ON "_pages_v_version_hero_trust_badges" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_hero_stats_order_idx" ON "_pages_v_version_hero_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_stats_parent_id_idx" ON "_pages_v_version_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_stats_locale_idx" ON "_pages_v_version_hero_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_version_hero_panel_dimensions_order_idx" ON "_pages_v_version_hero_panel_dimensions" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_panel_dimensions_parent_id_idx" ON "_pages_v_version_hero_panel_dimensions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_panel_dimensions_locale_idx" ON "_pages_v_version_hero_panel_dimensions" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_promise_features_order_idx" ON "_pages_v_blocks_promise_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promise_features_parent_id_idx" ON "_pages_v_blocks_promise_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promise_features_locale_idx" ON "_pages_v_blocks_promise_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_promise_order_idx" ON "_pages_v_blocks_promise" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_promise_parent_id_idx" ON "_pages_v_blocks_promise" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_promise_path_idx" ON "_pages_v_blocks_promise" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_promise_locales_locale_parent_id_unique" ON "_pages_v_blocks_promise_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_pillars_order_idx" ON "_pages_v_blocks_pillars" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pillars_parent_id_idx" ON "_pages_v_blocks_pillars" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pillars_path_idx" ON "_pages_v_blocks_pillars" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_pillars_locales_locale_parent_id_unique" ON "_pages_v_blocks_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_method_steps_activities_order_idx" ON "_pages_v_blocks_method_steps_activities" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_method_steps_activities_parent_id_idx" ON "_pages_v_blocks_method_steps_activities" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_method_steps_activities_locale_idx" ON "_pages_v_blocks_method_steps_activities" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_method_steps_order_idx" ON "_pages_v_blocks_method_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_method_steps_parent_id_idx" ON "_pages_v_blocks_method_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_method_steps_locale_idx" ON "_pages_v_blocks_method_steps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_method_order_idx" ON "_pages_v_blocks_method" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_method_parent_id_idx" ON "_pages_v_blocks_method" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_method_path_idx" ON "_pages_v_blocks_method" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_method_locales_locale_parent_id_unique" ON "_pages_v_blocks_method_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_demos_stack_order_idx" ON "_pages_v_blocks_lab_demos_stack" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lab_demos_stack_parent_id_idx" ON "_pages_v_blocks_lab_demos_stack" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_demos_stack_locale_idx" ON "_pages_v_blocks_lab_demos_stack" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lab_demos_order_idx" ON "_pages_v_blocks_lab_demos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lab_demos_parent_id_idx" ON "_pages_v_blocks_lab_demos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_demos_locale_idx" ON "_pages_v_blocks_lab_demos" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lab_demos_media_idx" ON "_pages_v_blocks_lab_demos" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_lab_order_idx" ON "_pages_v_blocks_lab" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lab_parent_id_idx" ON "_pages_v_blocks_lab" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lab_path_idx" ON "_pages_v_blocks_lab" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_lab_locales_locale_parent_id_unique" ON "_pages_v_blocks_lab_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_commitments_commitments_order_idx" ON "_pages_v_blocks_commitments_commitments" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_commitments_commitments_parent_id_idx" ON "_pages_v_blocks_commitments_commitments" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_commitments_commitments_locale_idx" ON "_pages_v_blocks_commitments_commitments" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_commitments_order_idx" ON "_pages_v_blocks_commitments" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_commitments_parent_id_idx" ON "_pages_v_blocks_commitments" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_commitments_path_idx" ON "_pages_v_blocks_commitments" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_commitments_locales_locale_parent_id_unique" ON "_pages_v_blocks_commitments_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_technologies_order_idx" ON "_pages_v_blocks_partners_technologies" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partners_technologies_parent_id_idx" ON "_pages_v_blocks_partners_technologies" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_technologies_logo_idx" ON "_pages_v_blocks_partners_technologies" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_partners_order_idx" ON "_pages_v_blocks_partners" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_partners_parent_id_idx" ON "_pages_v_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_partners_path_idx" ON "_pages_v_blocks_partners" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_partners_locales_locale_parent_id_unique" ON "_pages_v_blocks_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_block_order_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_block_parent_id_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_block_path_idx" ON "_pages_v_blocks_testimonials_block" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_testimonials_block_locales_locale_parent_id_" ON "_pages_v_blocks_testimonials_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_resources_block_order_idx" ON "_pages_v_blocks_resources_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_resources_block_parent_id_idx" ON "_pages_v_blocks_resources_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_resources_block_path_idx" ON "_pages_v_blocks_resources_block" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_resources_block_locales_locale_parent_id_uni" ON "_pages_v_blocks_resources_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_final_order_idx" ON "_pages_v_blocks_cta_final" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_final_parent_id_idx" ON "_pages_v_blocks_cta_final" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_final_path_idx" ON "_pages_v_blocks_cta_final" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_final_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_final_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_steps_order_idx" ON "_pages_v_blocks_contact_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_steps_parent_id_idx" ON "_pages_v_blocks_contact_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_steps_locale_idx" ON "_pages_v_blocks_contact_steps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_contact_order_idx" ON "_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_parent_id_idx" ON "_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_path_idx" ON "_pages_v_blocks_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_locales_locale_parent_id_unique" ON "_pages_v_blocks_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_presence_locations_order_idx" ON "_pages_v_blocks_presence_locations" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_presence_locations_parent_id_idx" ON "_pages_v_blocks_presence_locations" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_presence_order_idx" ON "_pages_v_blocks_presence" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_presence_parent_id_idx" ON "_pages_v_blocks_presence" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_presence_path_idx" ON "_pages_v_blocks_presence" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_presence_locales_locale_parent_id_unique" ON "_pages_v_blocks_presence_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_case_studies_index_order_idx" ON "_pages_v_blocks_case_studies_index" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_studies_index_parent_id_idx" ON "_pages_v_blocks_case_studies_index" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_studies_index_path_idx" ON "_pages_v_blocks_case_studies_index" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_case_studies_index_locales_locale_parent_id_" ON "_pages_v_blocks_case_studies_index_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_locale_idx" ON "_pages_v_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_about_hero_chips_order_idx" ON "_pages_v_blocks_about_hero_chips" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_hero_chips_parent_id_idx" ON "_pages_v_blocks_about_hero_chips" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_hero_chips_locale_idx" ON "_pages_v_blocks_about_hero_chips" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_about_hero_order_idx" ON "_pages_v_blocks_about_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_hero_parent_id_idx" ON "_pages_v_blocks_about_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_hero_path_idx" ON "_pages_v_blocks_about_hero" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_about_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_about_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_d4_cards_cards_order_idx" ON "_pages_v_blocks_d4_cards_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_d4_cards_cards_parent_id_idx" ON "_pages_v_blocks_d4_cards_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_d4_cards_cards_locale_idx" ON "_pages_v_blocks_d4_cards_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_d4_cards_order_idx" ON "_pages_v_blocks_d4_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_d4_cards_parent_id_idx" ON "_pages_v_blocks_d4_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_d4_cards_path_idx" ON "_pages_v_blocks_d4_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_d4_cards_locales_locale_parent_id_unique" ON "_pages_v_blocks_d4_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_distinctions_items_order_idx" ON "_pages_v_blocks_distinctions_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_distinctions_items_parent_id_idx" ON "_pages_v_blocks_distinctions_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_distinctions_items_locale_idx" ON "_pages_v_blocks_distinctions_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_distinctions_order_idx" ON "_pages_v_blocks_distinctions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_distinctions_parent_id_idx" ON "_pages_v_blocks_distinctions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_distinctions_path_idx" ON "_pages_v_blocks_distinctions" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_distinctions_locales_locale_parent_id_unique" ON "_pages_v_blocks_distinctions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_band_items_order_idx" ON "_pages_v_blocks_stats_band_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_band_items_parent_id_idx" ON "_pages_v_blocks_stats_band_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_band_items_locale_idx" ON "_pages_v_blocks_stats_band_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_stats_band_order_idx" ON "_pages_v_blocks_stats_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_band_parent_id_idx" ON "_pages_v_blocks_stats_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_band_path_idx" ON "_pages_v_blocks_stats_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_members_order_idx" ON "_pages_v_blocks_team_members" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_members_parent_id_idx" ON "_pages_v_blocks_team_members" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_members_photo_idx" ON "_pages_v_blocks_team_members" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_team_order_idx" ON "_pages_v_blocks_team" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_parent_id_idx" ON "_pages_v_blocks_team" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_path_idx" ON "_pages_v_blocks_team" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_team_locales_locale_parent_id_unique" ON "_pages_v_blocks_team_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_resources_catalog_order_idx" ON "_pages_v_blocks_resources_catalog" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_resources_catalog_parent_id_idx" ON "_pages_v_blocks_resources_catalog" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_resources_catalog_path_idx" ON "_pages_v_blocks_resources_catalog" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_resources_catalog_locales_locale_parent_id_u" ON "_pages_v_blocks_resources_catalog_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "posts_populated_authors_order_idx" ON "posts_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_populated_authors_parent_id_idx" ON "posts_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_users_id_idx" ON "posts_rels" USING btree ("users_id");
  CREATE INDEX "_posts_v_version_populated_authors_order_idx" ON "_posts_v_version_populated_authors" USING btree ("_order");
  CREATE INDEX "_posts_v_version_populated_authors_parent_id_idx" ON "_posts_v_version_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_users_id_idx" ON "_posts_v_rels" USING btree ("users_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "categories_breadcrumbs_order_idx" ON "categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "categories_breadcrumbs_parent_id_idx" ON "categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "categories_breadcrumbs_doc_idx" ON "categories_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "expertises_highlights_order_idx" ON "expertises_highlights" USING btree ("_order");
  CREATE INDEX "expertises_highlights_parent_id_idx" ON "expertises_highlights" USING btree ("_parent_id");
  CREATE INDEX "expertises_benefits_order_idx" ON "expertises_benefits" USING btree ("_order");
  CREATE INDEX "expertises_benefits_parent_id_idx" ON "expertises_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "expertises_benefits_locales_locale_parent_id_unique" ON "expertises_benefits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "expertises_process_steps_order_idx" ON "expertises_process_steps" USING btree ("_order");
  CREATE INDEX "expertises_process_steps_parent_id_idx" ON "expertises_process_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "expertises_process_steps_locales_locale_parent_id_unique" ON "expertises_process_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "expertises_technologies_order_idx" ON "expertises_technologies" USING btree ("_order");
  CREATE INDEX "expertises_technologies_parent_id_idx" ON "expertises_technologies" USING btree ("_parent_id");
  CREATE INDEX "expertises_faqs_order_idx" ON "expertises_faqs" USING btree ("_order");
  CREATE INDEX "expertises_faqs_parent_id_idx" ON "expertises_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "expertises_faqs_locales_locale_parent_id_unique" ON "expertises_faqs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "expertises_slug_idx" ON "expertises" USING btree ("slug");
  CREATE INDEX "expertises_updated_at_idx" ON "expertises" USING btree ("updated_at");
  CREATE INDEX "expertises_created_at_idx" ON "expertises" USING btree ("created_at");
  CREATE UNIQUE INDEX "expertises_locales_locale_parent_id_unique" ON "expertises_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_features_order_idx" ON "services_features" USING btree ("_order");
  CREATE INDEX "services_features_parent_id_idx" ON "services_features" USING btree ("_parent_id");
  CREATE INDEX "services_benefits_order_idx" ON "services_benefits" USING btree ("_order");
  CREATE INDEX "services_benefits_parent_id_idx" ON "services_benefits" USING btree ("_parent_id");
  CREATE INDEX "services_besoins_order_idx" ON "services_besoins" USING btree ("_order");
  CREATE INDEX "services_besoins_parent_id_idx" ON "services_besoins" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_besoins_locales_locale_parent_id_unique" ON "services_besoins_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_technologies_order_idx" ON "services_technologies" USING btree ("_order");
  CREATE INDEX "services_technologies_parent_id_idx" ON "services_technologies" USING btree ("_parent_id");
  CREATE INDEX "services_technologies_logo_idx" ON "services_technologies" USING btree ("logo_id");
  CREATE INDEX "services_process_steps_order_idx" ON "services_process_steps" USING btree ("_order");
  CREATE INDEX "services_process_steps_parent_id_idx" ON "services_process_steps" USING btree ("_parent_id");
  CREATE INDEX "services_faqs_order_idx" ON "services_faqs" USING btree ("_order");
  CREATE INDEX "services_faqs_parent_id_idx" ON "services_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_pole_idx" ON "services" USING btree ("pole_id");
  CREATE INDEX "services_image_idx" ON "services" USING btree ("image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_services_id_idx" ON "services_rels" USING btree ("services_id");
  CREATE INDEX "services_rels_case_studies_id_idx" ON "services_rels" USING btree ("case_studies_id");
  CREATE INDEX "services_rels_posts_id_idx" ON "services_rels" USING btree ("posts_id");
  CREATE INDEX "case_studies_metrics_order_idx" ON "case_studies_metrics" USING btree ("_order");
  CREATE INDEX "case_studies_metrics_parent_id_idx" ON "case_studies_metrics" USING btree ("_parent_id");
  CREATE INDEX "case_studies_technologies_order_idx" ON "case_studies_technologies" USING btree ("_order");
  CREATE INDEX "case_studies_technologies_parent_id_idx" ON "case_studies_technologies" USING btree ("_parent_id");
  CREATE INDEX "case_studies_testimonials_order_idx" ON "case_studies_testimonials" USING btree ("_order");
  CREATE INDEX "case_studies_testimonials_parent_id_idx" ON "case_studies_testimonials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_industry_idx" ON "case_studies" USING btree ("industry_id");
  CREATE INDEX "case_studies_category_idx" ON "case_studies" USING btree ("category_id");
  CREATE INDEX "case_studies_image_idx" ON "case_studies" USING btree ("image_id");
  CREATE INDEX "case_studies_logo_idx" ON "case_studies" USING btree ("logo_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_services_id_idx" ON "case_studies_rels" USING btree ("services_id");
  CREATE INDEX "case_studies_rels_expertises_id_idx" ON "case_studies_rels" USING btree ("expertises_id");
  CREATE INDEX "case_study_sectors_updated_at_idx" ON "case_study_sectors" USING btree ("updated_at");
  CREATE INDEX "case_study_sectors_created_at_idx" ON "case_study_sectors" USING btree ("created_at");
  CREATE INDEX "case_study_types_updated_at_idx" ON "case_study_types" USING btree ("updated_at");
  CREATE INDEX "case_study_types_created_at_idx" ON "case_study_types" USING btree ("created_at");
  CREATE INDEX "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "products_gallery" USING btree ("image_id");
  CREATE INDEX "products_features_order_idx" ON "products_features" USING btree ("_order");
  CREATE INDEX "products_features_parent_id_idx" ON "products_features" USING btree ("_parent_id");
  CREATE INDEX "products_includes_order_idx" ON "products_includes" USING btree ("_order");
  CREATE INDEX "products_includes_parent_id_idx" ON "products_includes" USING btree ("_parent_id");
  CREATE INDEX "products_benefits_order_idx" ON "products_benefits" USING btree ("_order");
  CREATE INDEX "products_benefits_parent_id_idx" ON "products_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "contact_messages_services_needed_order_idx" ON "contact_messages_services_needed" USING btree ("_order");
  CREATE INDEX "contact_messages_services_needed_parent_id_idx" ON "contact_messages_services_needed" USING btree ("_parent_id");
  CREATE INDEX "contact_messages_priorities_order_idx" ON "contact_messages_priorities" USING btree ("_order");
  CREATE INDEX "contact_messages_priorities_parent_id_idx" ON "contact_messages_priorities" USING btree ("_parent_id");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "reviews_avatar_idx" ON "reviews" USING btree ("avatar_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE INDEX "testimonials_avatar_idx" ON "testimonials" USING btree ("avatar_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "job_offers_responsibilities_order_idx" ON "job_offers_responsibilities" USING btree ("_order");
  CREATE INDEX "job_offers_responsibilities_parent_id_idx" ON "job_offers_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "job_offers_requirements_order_idx" ON "job_offers_requirements" USING btree ("_order");
  CREATE INDEX "job_offers_requirements_parent_id_idx" ON "job_offers_requirements" USING btree ("_parent_id");
  CREATE INDEX "job_offers_benefits_order_idx" ON "job_offers_benefits" USING btree ("_order");
  CREATE INDEX "job_offers_benefits_parent_id_idx" ON "job_offers_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "job_offers_slug_idx" ON "job_offers" USING btree ("slug");
  CREATE INDEX "job_offers_updated_at_idx" ON "job_offers" USING btree ("updated_at");
  CREATE INDEX "job_offers_created_at_idx" ON "job_offers" USING btree ("created_at");
  CREATE INDEX "job_applications_resume_idx" ON "job_applications" USING btree ("resume_id");
  CREATE INDEX "job_applications_job_offer_idx" ON "job_applications" USING btree ("job_offer_id");
  CREATE INDEX "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  CREATE INDEX "appointments_priorities_order_idx" ON "appointments_priorities" USING btree ("_order");
  CREATE INDEX "appointments_priorities_parent_id_idx" ON "appointments_priorities" USING btree ("_parent_id");
  CREATE INDEX "appointments_updated_at_idx" ON "appointments" USING btree ("updated_at");
  CREATE INDEX "appointments_created_at_idx" ON "appointments" USING btree ("created_at");
  CREATE INDEX "blog_comments_blog_post_idx" ON "blog_comments" USING btree ("blog_post_id");
  CREATE INDEX "blog_comments_updated_at_idx" ON "blog_comments" USING btree ("updated_at");
  CREATE INDEX "blog_comments_created_at_idx" ON "blog_comments" USING btree ("created_at");
  CREATE INDEX "resources_features_order_idx" ON "resources_features" USING btree ("_order");
  CREATE INDEX "resources_features_parent_id_idx" ON "resources_features" USING btree ("_parent_id");
  CREATE INDEX "resources_tags_order_idx" ON "resources_tags" USING btree ("_order");
  CREATE INDEX "resources_tags_parent_id_idx" ON "resources_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_file_idx" ON "resources" USING btree ("file_id");
  CREATE INDEX "resources_thumbnail_idx" ON "resources" USING btree ("thumbnail_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "search_categories_order_idx" ON "search_categories" USING btree ("_order");
  CREATE INDEX "search_categories_parent_id_idx" ON "search_categories" USING btree ("_parent_id");
  CREATE INDEX "search_slug_idx" ON "search" USING btree ("slug");
  CREATE INDEX "search_meta_meta_image_idx" ON "search" USING btree ("meta_image_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_expertises_id_idx" ON "payload_locked_documents_rels" USING btree ("expertises_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_case_study_sectors_id_idx" ON "payload_locked_documents_rels" USING btree ("case_study_sectors_id");
  CREATE INDEX "payload_locked_documents_rels_case_study_types_id_idx" ON "payload_locked_documents_rels" USING btree ("case_study_types_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_job_offers_id_idx" ON "payload_locked_documents_rels" USING btree ("job_offers_id");
  CREATE INDEX "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");
  CREATE INDEX "payload_locked_documents_rels_appointments_id_idx" ON "payload_locked_documents_rels" USING btree ("appointments_id");
  CREATE INDEX "payload_locked_documents_rels_blog_comments_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_comments_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_megamenu_poles_services_order_idx" ON "header_megamenu_poles_services" USING btree ("_order");
  CREATE INDEX "header_megamenu_poles_services_parent_id_idx" ON "header_megamenu_poles_services" USING btree ("_parent_id");
  CREATE INDEX "header_megamenu_poles_services_service_idx" ON "header_megamenu_poles_services" USING btree ("service_id");
  CREATE INDEX "header_megamenu_poles_order_idx" ON "header_megamenu_poles" USING btree ("_order");
  CREATE INDEX "header_megamenu_poles_parent_id_idx" ON "header_megamenu_poles" USING btree ("_parent_id");
  CREATE INDEX "header_megamenu_poles_pole_idx" ON "header_megamenu_poles" USING btree ("pole_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  CREATE INDEX "site_settings_maintenance_mode_allowed_ips_order_idx" ON "site_settings_maintenance_mode_allowed_ips" USING btree ("_order");
  CREATE INDEX "site_settings_maintenance_mode_allowed_ips_parent_id_idx" ON "site_settings_maintenance_mode_allowed_ips" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seo_seo_default_og_image_idx" ON "site_settings" USING btree ("seo_default_og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_hero_trust_badges" CASCADE;
  DROP TABLE "pages_hero_stats" CASCADE;
  DROP TABLE "pages_hero_panel_dimensions" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_promise_features" CASCADE;
  DROP TABLE "pages_blocks_promise" CASCADE;
  DROP TABLE "pages_blocks_promise_locales" CASCADE;
  DROP TABLE "pages_blocks_pillars" CASCADE;
  DROP TABLE "pages_blocks_pillars_locales" CASCADE;
  DROP TABLE "pages_blocks_method_steps_activities" CASCADE;
  DROP TABLE "pages_blocks_method_steps" CASCADE;
  DROP TABLE "pages_blocks_method" CASCADE;
  DROP TABLE "pages_blocks_method_locales" CASCADE;
  DROP TABLE "pages_blocks_lab_demos_stack" CASCADE;
  DROP TABLE "pages_blocks_lab_demos" CASCADE;
  DROP TABLE "pages_blocks_lab" CASCADE;
  DROP TABLE "pages_blocks_lab_locales" CASCADE;
  DROP TABLE "pages_blocks_commitments_commitments" CASCADE;
  DROP TABLE "pages_blocks_commitments" CASCADE;
  DROP TABLE "pages_blocks_commitments_locales" CASCADE;
  DROP TABLE "pages_blocks_partners_technologies" CASCADE;
  DROP TABLE "pages_blocks_partners" CASCADE;
  DROP TABLE "pages_blocks_partners_locales" CASCADE;
  DROP TABLE "pages_blocks_testimonials_block" CASCADE;
  DROP TABLE "pages_blocks_testimonials_block_locales" CASCADE;
  DROP TABLE "pages_blocks_resources_block" CASCADE;
  DROP TABLE "pages_blocks_resources_block_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_final" CASCADE;
  DROP TABLE "pages_blocks_cta_final_locales" CASCADE;
  DROP TABLE "pages_blocks_contact_steps" CASCADE;
  DROP TABLE "pages_blocks_contact" CASCADE;
  DROP TABLE "pages_blocks_contact_locales" CASCADE;
  DROP TABLE "pages_blocks_presence_locations" CASCADE;
  DROP TABLE "pages_blocks_presence" CASCADE;
  DROP TABLE "pages_blocks_presence_locales" CASCADE;
  DROP TABLE "pages_blocks_case_studies_index" CASCADE;
  DROP TABLE "pages_blocks_case_studies_index_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_about_hero_chips" CASCADE;
  DROP TABLE "pages_blocks_about_hero" CASCADE;
  DROP TABLE "pages_blocks_about_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_d4_cards_cards" CASCADE;
  DROP TABLE "pages_blocks_d4_cards" CASCADE;
  DROP TABLE "pages_blocks_d4_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_distinctions_items" CASCADE;
  DROP TABLE "pages_blocks_distinctions" CASCADE;
  DROP TABLE "pages_blocks_distinctions_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_band_items" CASCADE;
  DROP TABLE "pages_blocks_stats_band" CASCADE;
  DROP TABLE "pages_blocks_team_members" CASCADE;
  DROP TABLE "pages_blocks_team" CASCADE;
  DROP TABLE "pages_blocks_team_locales" CASCADE;
  DROP TABLE "pages_blocks_resources_catalog" CASCADE;
  DROP TABLE "pages_blocks_resources_catalog_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_version_hero_trust_badges" CASCADE;
  DROP TABLE "_pages_v_version_hero_stats" CASCADE;
  DROP TABLE "_pages_v_version_hero_panel_dimensions" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_promise_features" CASCADE;
  DROP TABLE "_pages_v_blocks_promise" CASCADE;
  DROP TABLE "_pages_v_blocks_promise_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_pillars" CASCADE;
  DROP TABLE "_pages_v_blocks_pillars_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_method_steps_activities" CASCADE;
  DROP TABLE "_pages_v_blocks_method_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_method" CASCADE;
  DROP TABLE "_pages_v_blocks_method_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_lab_demos_stack" CASCADE;
  DROP TABLE "_pages_v_blocks_lab_demos" CASCADE;
  DROP TABLE "_pages_v_blocks_lab" CASCADE;
  DROP TABLE "_pages_v_blocks_lab_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_commitments_commitments" CASCADE;
  DROP TABLE "_pages_v_blocks_commitments" CASCADE;
  DROP TABLE "_pages_v_blocks_commitments_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_partners_technologies" CASCADE;
  DROP TABLE "_pages_v_blocks_partners" CASCADE;
  DROP TABLE "_pages_v_blocks_partners_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_block" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_resources_block" CASCADE;
  DROP TABLE "_pages_v_blocks_resources_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_final" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_final_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_presence_locations" CASCADE;
  DROP TABLE "_pages_v_blocks_presence" CASCADE;
  DROP TABLE "_pages_v_blocks_presence_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_case_studies_index" CASCADE;
  DROP TABLE "_pages_v_blocks_case_studies_index_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_about_hero_chips" CASCADE;
  DROP TABLE "_pages_v_blocks_about_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_about_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_d4_cards_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_d4_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_d4_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_distinctions_items" CASCADE;
  DROP TABLE "_pages_v_blocks_distinctions" CASCADE;
  DROP TABLE "_pages_v_blocks_distinctions_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_band_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_band" CASCADE;
  DROP TABLE "_pages_v_blocks_team_members" CASCADE;
  DROP TABLE "_pages_v_blocks_team" CASCADE;
  DROP TABLE "_pages_v_blocks_team_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_resources_catalog" CASCADE;
  DROP TABLE "_pages_v_blocks_resources_catalog_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts_populated_authors" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_populated_authors" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories_breadcrumbs" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "expertises_highlights" CASCADE;
  DROP TABLE "expertises_benefits" CASCADE;
  DROP TABLE "expertises_benefits_locales" CASCADE;
  DROP TABLE "expertises_process_steps" CASCADE;
  DROP TABLE "expertises_process_steps_locales" CASCADE;
  DROP TABLE "expertises_technologies" CASCADE;
  DROP TABLE "expertises_faqs" CASCADE;
  DROP TABLE "expertises_faqs_locales" CASCADE;
  DROP TABLE "expertises" CASCADE;
  DROP TABLE "expertises_locales" CASCADE;
  DROP TABLE "services_features" CASCADE;
  DROP TABLE "services_benefits" CASCADE;
  DROP TABLE "services_besoins" CASCADE;
  DROP TABLE "services_besoins_locales" CASCADE;
  DROP TABLE "services_technologies" CASCADE;
  DROP TABLE "services_process_steps" CASCADE;
  DROP TABLE "services_faqs" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "case_studies_metrics" CASCADE;
  DROP TABLE "case_studies_technologies" CASCADE;
  DROP TABLE "case_studies_testimonials" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "case_study_sectors" CASCADE;
  DROP TABLE "case_study_types" CASCADE;
  DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products_features" CASCADE;
  DROP TABLE "products_includes" CASCADE;
  DROP TABLE "products_benefits" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "contact_messages_services_needed" CASCADE;
  DROP TABLE "contact_messages_priorities" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "job_offers_responsibilities" CASCADE;
  DROP TABLE "job_offers_requirements" CASCADE;
  DROP TABLE "job_offers_benefits" CASCADE;
  DROP TABLE "job_offers" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  DROP TABLE "appointments_priorities" CASCADE;
  DROP TABLE "appointments" CASCADE;
  DROP TABLE "blog_comments" CASCADE;
  DROP TABLE "resources_features" CASCADE;
  DROP TABLE "resources_tags" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "search_categories" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header_megamenu_poles_services" CASCADE;
  DROP TABLE "header_megamenu_poles" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "site_settings_maintenance_mode_allowed_ips" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_blocks_promise_features_icon";
  DROP TYPE "public"."enum_pages_blocks_promise_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_promise_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_pillars_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_pillars_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_method_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_method_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_lab_demos_status";
  DROP TYPE "public"."enum_pages_blocks_lab_demos_preview_type";
  DROP TYPE "public"."enum_pages_blocks_lab_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_lab_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_commitments_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_commitments_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_partners_technologies_category";
  DROP TYPE "public"."enum_pages_blocks_partners_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_partners_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_testimonials_block_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_testimonials_block_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_resources_block_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_resources_block_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_cta_final_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_cta_final_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_contact_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_contact_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_presence_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_presence_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_case_studies_index_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_case_studies_index_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_faq_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_faq_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_about_hero_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_about_hero_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_d4_cards_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_d4_cards_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_distinctions_items_icon";
  DROP TYPE "public"."enum_pages_blocks_distinctions_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_distinctions_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_stats_band_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_stats_band_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_team_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_team_appearance_text_size";
  DROP TYPE "public"."enum_pages_blocks_resources_catalog_appearance_title_size";
  DROP TYPE "public"."enum_pages_blocks_resources_catalog_appearance_text_size";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_hero_appearance_title_size";
  DROP TYPE "public"."enum_pages_hero_appearance_text_size";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_promise_features_icon";
  DROP TYPE "public"."enum__pages_v_blocks_promise_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_promise_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_pillars_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_pillars_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_method_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_method_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_lab_demos_status";
  DROP TYPE "public"."enum__pages_v_blocks_lab_demos_preview_type";
  DROP TYPE "public"."enum__pages_v_blocks_lab_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_lab_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_commitments_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_commitments_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_partners_technologies_category";
  DROP TYPE "public"."enum__pages_v_blocks_partners_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_partners_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_block_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_block_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_resources_block_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_resources_block_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_cta_final_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_cta_final_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_contact_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_contact_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_presence_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_presence_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_case_studies_index_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_case_studies_index_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_faq_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_faq_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_about_hero_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_about_hero_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_d4_cards_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_d4_cards_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_distinctions_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_distinctions_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_distinctions_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_stats_band_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_stats_band_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_team_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_team_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_blocks_resources_catalog_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_blocks_resources_catalog_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_hero_appearance_title_size";
  DROP TYPE "public"."enum__pages_v_version_hero_appearance_text_size";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_products_category";
  DROP TYPE "public"."enum_contact_messages_type";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_reviews_service_category";
  DROP TYPE "public"."enum_job_offers_contract_type";
  DROP TYPE "public"."enum_job_applications_status";
  DROP TYPE "public"."enum_appointments_status";
  DROP TYPE "public"."enum_blog_comments_status";
  DROP TYPE "public"."enum_resources_category";
  DROP TYPE "public"."enum_resources_format";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_footer_nav_items_link_type";
  DROP TYPE "public"."enum_site_settings_maintenance_mode_mode";`)
}
