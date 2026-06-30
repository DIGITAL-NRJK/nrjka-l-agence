import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1) Schéma : table de locales pour case_studies + colonnes slug dans les tables *_locales.
  //    expertises_locales.slug est ajouté NULLABLE ici (la table a déjà des lignes) ; il passe
  //    en NOT NULL après le backfill (phase 3).
  await db.execute(sql`
   CREATE TABLE "case_studies_locales" (
  	"slug" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  DROP INDEX "pages_slug_idx";
  DROP INDEX "_pages_v_version_version_slug_idx";
  DROP INDEX "posts_slug_idx";
  DROP INDEX "_posts_v_version_version_slug_idx";
  DROP INDEX "expertises_slug_idx";
  DROP INDEX "case_studies_slug_idx";
  ALTER TABLE "pages_locales" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "pages_locales" ADD COLUMN "slug" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
  ALTER TABLE "_pages_v_locales" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "posts_locales" ADD COLUMN "generate_slug" boolean DEFAULT true;
  ALTER TABLE "posts_locales" ADD COLUMN "slug" varchar;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
  ALTER TABLE "_posts_v_locales" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "expertises_locales" ADD COLUMN "slug" varchar;
  ALTER TABLE "case_studies_locales" ADD CONSTRAINT "case_studies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;`)

  // 2) BACKFILL — recopie les slugs existants AVANT de supprimer les colonnes d'origine.
  //    Chaque langue (fr ET en) reçoit le slug d'origine : sécurité, aucune URL cassée.
  //    Les slugs EN traduits seront posés ensuite par un script dédié (non destructif).
  await db.execute(sql`
   UPDATE "pages_locales" pl SET "slug" = p."slug", "generate_slug" = p."generate_slug"
     FROM "pages" p WHERE pl."_parent_id" = p."id";
   UPDATE "posts_locales" pl SET "slug" = p."slug", "generate_slug" = p."generate_slug"
     FROM "posts" p WHERE pl."_parent_id" = p."id";
   UPDATE "expertises_locales" el SET "slug" = e."slug"
     FROM "expertises" e WHERE el."_parent_id" = e."id";
   UPDATE "_pages_v_locales" vl SET "version_slug" = v."version_slug", "version_generate_slug" = v."version_generate_slug"
     FROM "_pages_v" v WHERE vl."_parent_id" = v."id";
   UPDATE "_posts_v_locales" vl SET "version_slug" = v."version_slug", "version_generate_slug" = v."version_generate_slug"
     FROM "_posts_v" v WHERE vl."_parent_id" = v."id";
   INSERT INTO "case_studies_locales" ("_locale", "_parent_id", "slug")
     SELECT l.loc, cs."id", cs."slug"
     FROM "case_studies" cs
     CROSS JOIN (VALUES ('fr'::"_locales"), ('en'::"_locales")) AS l(loc)
     WHERE cs."slug" IS NOT NULL;`)

  // 3) Contraintes + index sur données peuplées, puis suppression des colonnes d'origine.
  await db.execute(sql`
   ALTER TABLE "expertises_locales" ALTER COLUMN "slug" SET NOT NULL;
   CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies_locales" USING btree ("slug","_locale");
   CREATE UNIQUE INDEX "case_studies_locales_locale_parent_id_unique" ON "case_studies_locales" USING btree ("_locale","_parent_id");
   CREATE UNIQUE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
   CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
   CREATE UNIQUE INDEX "posts_slug_idx" ON "posts_locales" USING btree ("slug","_locale");
   CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v_locales" USING btree ("version_slug","_locale");
   CREATE UNIQUE INDEX "expertises_slug_idx" ON "expertises_locales" USING btree ("slug","_locale");
   ALTER TABLE "pages" DROP COLUMN "generate_slug";
   ALTER TABLE "pages" DROP COLUMN "slug";
   ALTER TABLE "_pages_v" DROP COLUMN "version_generate_slug";
   ALTER TABLE "_pages_v" DROP COLUMN "version_slug";
   ALTER TABLE "posts" DROP COLUMN "generate_slug";
   ALTER TABLE "posts" DROP COLUMN "slug";
   ALTER TABLE "_posts_v" DROP COLUMN "version_generate_slug";
   ALTER TABLE "_posts_v" DROP COLUMN "version_slug";
   ALTER TABLE "expertises" DROP COLUMN "slug";
   ALTER TABLE "case_studies" DROP COLUMN "slug";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Inverse : ré-ajoute les colonnes d'origine (NULLABLE), recopie depuis la locale FR,
  // puis remet NOT NULL là où c'était le cas, et supprime les colonnes localisées.
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "generate_slug" boolean DEFAULT true;
   ALTER TABLE "pages" ADD COLUMN "slug" varchar;
   ALTER TABLE "_pages_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
   ALTER TABLE "_pages_v" ADD COLUMN "version_slug" varchar;
   ALTER TABLE "posts" ADD COLUMN "generate_slug" boolean DEFAULT true;
   ALTER TABLE "posts" ADD COLUMN "slug" varchar;
   ALTER TABLE "_posts_v" ADD COLUMN "version_generate_slug" boolean DEFAULT true;
   ALTER TABLE "_posts_v" ADD COLUMN "version_slug" varchar;
   ALTER TABLE "expertises" ADD COLUMN "slug" varchar;
   ALTER TABLE "case_studies" ADD COLUMN "slug" varchar;`)

  await db.execute(sql`
   UPDATE "pages" p SET "slug" = pl."slug", "generate_slug" = pl."generate_slug"
     FROM "pages_locales" pl WHERE pl."_parent_id" = p."id" AND pl."_locale" = 'fr';
   UPDATE "posts" p SET "slug" = pl."slug", "generate_slug" = pl."generate_slug"
     FROM "posts_locales" pl WHERE pl."_parent_id" = p."id" AND pl."_locale" = 'fr';
   UPDATE "expertises" e SET "slug" = el."slug"
     FROM "expertises_locales" el WHERE el."_parent_id" = e."id" AND el."_locale" = 'fr';
   UPDATE "case_studies" cs SET "slug" = csl."slug"
     FROM "case_studies_locales" csl WHERE csl."_parent_id" = cs."id" AND csl."_locale" = 'fr';
   UPDATE "_pages_v" v SET "version_slug" = vl."version_slug", "version_generate_slug" = vl."version_generate_slug"
     FROM "_pages_v_locales" vl WHERE vl."_parent_id" = v."id" AND vl."_locale" = 'fr';
   UPDATE "_posts_v" v SET "version_slug" = vl."version_slug", "version_generate_slug" = vl."version_generate_slug"
     FROM "_posts_v_locales" vl WHERE vl."_parent_id" = v."id" AND vl."_locale" = 'fr';`)

  await db.execute(sql`
   ALTER TABLE "expertises" ALTER COLUMN "slug" SET NOT NULL;
   ALTER TABLE "case_studies" ALTER COLUMN "slug" SET NOT NULL;
   ALTER TABLE "case_studies_locales" DISABLE ROW LEVEL SECURITY;
   DROP TABLE "case_studies_locales" CASCADE;
   DROP INDEX "pages_slug_idx";
   DROP INDEX "_pages_v_version_version_slug_idx";
   DROP INDEX "posts_slug_idx";
   DROP INDEX "_posts_v_version_version_slug_idx";
   DROP INDEX "expertises_slug_idx";
   CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
   CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
   CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
   CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
   CREATE UNIQUE INDEX "expertises_slug_idx" ON "expertises" USING btree ("slug");
   CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
   ALTER TABLE "pages_locales" DROP COLUMN "generate_slug";
   ALTER TABLE "pages_locales" DROP COLUMN "slug";
   ALTER TABLE "_pages_v_locales" DROP COLUMN "version_generate_slug";
   ALTER TABLE "_pages_v_locales" DROP COLUMN "version_slug";
   ALTER TABLE "posts_locales" DROP COLUMN "generate_slug";
   ALTER TABLE "posts_locales" DROP COLUMN "slug";
   ALTER TABLE "_posts_v_locales" DROP COLUMN "version_generate_slug";
   ALTER TABLE "_posts_v_locales" DROP COLUMN "version_slug";
   ALTER TABLE "expertises_locales" DROP COLUMN "slug";`)
}
