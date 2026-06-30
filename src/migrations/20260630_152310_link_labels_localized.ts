import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1) Crée les tables de locales pour les libellés de lien + clés étrangères.
  await db.execute(sql`
   CREATE TABLE "pages_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "pages_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "pages_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "_pages_v_version_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE "_pages_v_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE "_pages_v_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  CREATE TABLE "header_nav_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  CREATE TABLE "footer_nav_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  ALTER TABLE "pages_hero_links_locales" ADD CONSTRAINT "pages_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links_locales" ADD CONSTRAINT "pages_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns_locales" ADD CONSTRAINT "pages_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links_locales" ADD CONSTRAINT "_pages_v_version_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links_locales" ADD CONSTRAINT "_pages_v_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns_locales" ADD CONSTRAINT "_pages_v_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_locales" ADD CONSTRAINT "header_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items_locales" ADD CONSTRAINT "footer_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_items"("id") ON DELETE cascade ON UPDATE no action;`)

  // 2) BACKFILL — recopie chaque libellé existant dans fr ET en AVANT de supprimer la colonne
  //    d'origine (EN = FR au départ, aucun libellé perdu). Ces tables n'ont que link_label,
  //    donc l'INSERT direct est sûr.
  await db.execute(sql`
   INSERT INTO "pages_hero_links_locales" ("_locale", "_parent_id", "link_label")
     SELECT l.loc, m."id", m."link_label" FROM "pages_hero_links" m
     CROSS JOIN (VALUES ('fr'::"_locales"), ('en'::"_locales")) AS l(loc)
     WHERE m."link_label" IS NOT NULL;
   INSERT INTO "pages_blocks_cta_links_locales" ("_locale", "_parent_id", "link_label")
     SELECT l.loc, m."id", m."link_label" FROM "pages_blocks_cta_links" m
     CROSS JOIN (VALUES ('fr'::"_locales"), ('en'::"_locales")) AS l(loc)
     WHERE m."link_label" IS NOT NULL;
   INSERT INTO "pages_blocks_content_columns_locales" ("_locale", "_parent_id", "link_label")
     SELECT l.loc, m."id", m."link_label" FROM "pages_blocks_content_columns" m
     CROSS JOIN (VALUES ('fr'::"_locales"), ('en'::"_locales")) AS l(loc)
     WHERE m."link_label" IS NOT NULL;
   INSERT INTO "_pages_v_version_hero_links_locales" ("_locale", "_parent_id", "link_label")
     SELECT l.loc, m."id", m."link_label" FROM "_pages_v_version_hero_links" m
     CROSS JOIN (VALUES ('fr'::"_locales"), ('en'::"_locales")) AS l(loc)
     WHERE m."link_label" IS NOT NULL;
   INSERT INTO "_pages_v_blocks_cta_links_locales" ("_locale", "_parent_id", "link_label")
     SELECT l.loc, m."id", m."link_label" FROM "_pages_v_blocks_cta_links" m
     CROSS JOIN (VALUES ('fr'::"_locales"), ('en'::"_locales")) AS l(loc)
     WHERE m."link_label" IS NOT NULL;
   INSERT INTO "_pages_v_blocks_content_columns_locales" ("_locale", "_parent_id", "link_label")
     SELECT l.loc, m."id", m."link_label" FROM "_pages_v_blocks_content_columns" m
     CROSS JOIN (VALUES ('fr'::"_locales"), ('en'::"_locales")) AS l(loc)
     WHERE m."link_label" IS NOT NULL;
   INSERT INTO "header_nav_items_locales" ("_locale", "_parent_id", "link_label")
     SELECT l.loc, m."id", m."link_label" FROM "header_nav_items" m
     CROSS JOIN (VALUES ('fr'::"_locales"), ('en'::"_locales")) AS l(loc)
     WHERE m."link_label" IS NOT NULL;
   INSERT INTO "footer_nav_items_locales" ("_locale", "_parent_id", "link_label")
     SELECT l.loc, m."id", m."link_label" FROM "footer_nav_items" m
     CROSS JOIN (VALUES ('fr'::"_locales"), ('en'::"_locales")) AS l(loc)
     WHERE m."link_label" IS NOT NULL;`)

  // 3) Index d'unicité (une ligne par langue/parent) + suppression des colonnes d'origine.
  await db.execute(sql`
   CREATE UNIQUE INDEX "pages_hero_links_locales_locale_parent_id_unique" ON "pages_hero_links_locales" USING btree ("_locale","_parent_id");
   CREATE UNIQUE INDEX "pages_blocks_cta_links_locales_locale_parent_id_unique" ON "pages_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
   CREATE UNIQUE INDEX "pages_blocks_content_columns_locales_locale_parent_id_unique" ON "pages_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
   CREATE UNIQUE INDEX "_pages_v_version_hero_links_locales_locale_parent_id_unique" ON "_pages_v_version_hero_links_locales" USING btree ("_locale","_parent_id");
   CREATE UNIQUE INDEX "_pages_v_blocks_cta_links_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
   CREATE UNIQUE INDEX "_pages_v_blocks_content_columns_locales_locale_parent_id_uni" ON "_pages_v_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
   CREATE UNIQUE INDEX "header_nav_items_locales_locale_parent_id_unique" ON "header_nav_items_locales" USING btree ("_locale","_parent_id");
   CREATE UNIQUE INDEX "footer_nav_items_locales_locale_parent_id_unique" ON "footer_nav_items_locales" USING btree ("_locale","_parent_id");
   ALTER TABLE "pages_hero_links" DROP COLUMN "link_label";
   ALTER TABLE "pages_blocks_cta_links" DROP COLUMN "link_label";
   ALTER TABLE "pages_blocks_content_columns" DROP COLUMN "link_label";
   ALTER TABLE "_pages_v_version_hero_links" DROP COLUMN "link_label";
   ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN "link_label";
   ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN "link_label";
   ALTER TABLE "header_nav_items" DROP COLUMN "link_label";
   ALTER TABLE "footer_nav_items" DROP COLUMN "link_label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Inverse : ré-ajoute link_label (NULLABLE), recopie depuis la locale FR, remet NOT NULL
  // sur header/footer, puis supprime les tables de locales.
  await db.execute(sql`
   ALTER TABLE "pages_hero_links" ADD COLUMN "link_label" varchar;
   ALTER TABLE "pages_blocks_cta_links" ADD COLUMN "link_label" varchar;
   ALTER TABLE "pages_blocks_content_columns" ADD COLUMN "link_label" varchar;
   ALTER TABLE "_pages_v_version_hero_links" ADD COLUMN "link_label" varchar;
   ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN "link_label" varchar;
   ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN "link_label" varchar;
   ALTER TABLE "header_nav_items" ADD COLUMN "link_label" varchar;
   ALTER TABLE "footer_nav_items" ADD COLUMN "link_label" varchar;`)

  await db.execute(sql`
   UPDATE "pages_hero_links" m SET "link_label" = l."link_label" FROM "pages_hero_links_locales" l WHERE l."_parent_id" = m."id" AND l."_locale" = 'fr';
   UPDATE "pages_blocks_cta_links" m SET "link_label" = l."link_label" FROM "pages_blocks_cta_links_locales" l WHERE l."_parent_id" = m."id" AND l."_locale" = 'fr';
   UPDATE "pages_blocks_content_columns" m SET "link_label" = l."link_label" FROM "pages_blocks_content_columns_locales" l WHERE l."_parent_id" = m."id" AND l."_locale" = 'fr';
   UPDATE "_pages_v_version_hero_links" m SET "link_label" = l."link_label" FROM "_pages_v_version_hero_links_locales" l WHERE l."_parent_id" = m."id" AND l."_locale" = 'fr';
   UPDATE "_pages_v_blocks_cta_links" m SET "link_label" = l."link_label" FROM "_pages_v_blocks_cta_links_locales" l WHERE l."_parent_id" = m."id" AND l."_locale" = 'fr';
   UPDATE "_pages_v_blocks_content_columns" m SET "link_label" = l."link_label" FROM "_pages_v_blocks_content_columns_locales" l WHERE l."_parent_id" = m."id" AND l."_locale" = 'fr';
   UPDATE "header_nav_items" m SET "link_label" = l."link_label" FROM "header_nav_items_locales" l WHERE l."_parent_id" = m."id" AND l."_locale" = 'fr';
   UPDATE "footer_nav_items" m SET "link_label" = l."link_label" FROM "footer_nav_items_locales" l WHERE l."_parent_id" = m."id" AND l."_locale" = 'fr';`)

  await db.execute(sql`
   ALTER TABLE "header_nav_items" ALTER COLUMN "link_label" SET NOT NULL;
   ALTER TABLE "footer_nav_items" ALTER COLUMN "link_label" SET NOT NULL;
   DROP TABLE "pages_hero_links_locales" CASCADE;
   DROP TABLE "pages_blocks_cta_links_locales" CASCADE;
   DROP TABLE "pages_blocks_content_columns_locales" CASCADE;
   DROP TABLE "_pages_v_version_hero_links_locales" CASCADE;
   DROP TABLE "_pages_v_blocks_cta_links_locales" CASCADE;
   DROP TABLE "_pages_v_blocks_content_columns_locales" CASCADE;
   DROP TABLE "header_nav_items_locales" CASCADE;
   DROP TABLE "footer_nav_items_locales" CASCADE;`)
}
