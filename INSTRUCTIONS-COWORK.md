# Instructions pour Claude — Projet NRJKA Digital

## Contexte du projet

Site de l'agence NRJKA Digital. Stack : **Next.js 16 + Payload CMS 3.79 + PostgreSQL (Neon) + S3/R2 (Cloudflare R2) + Tailwind v4**. Déployé sur **Netlify**.

Dossier : `~/Desktop/nrjka-l-agence`

---

## Architecture infra

| Composant | Service |
|---|---|
| Hébergement Next.js + Payload | Netlify |
| Base de données | Neon PostgreSQL |
| Stockage médias | Cloudflare R2 (S3-compatible) |
| CDN + DNS | Cloudflare (domaine nrjka.com) |
| Analytics | Umami auto-hébergé sur `analytics.nrjka.com` (Coolify/IONOS) |
| Traduction auto FR→EN | LibreTranslate auto-hébergé sur `translate.nrjka.com` (Coolify/IONOS) |
| Automatisation | n8n sur `n8n.nrjka.com` (Coolify/IONOS) |

---

## État actuel du projet (2026-06-19)

### Ce qui est fait et commité (branche main)

- Site complet Phase 1–3 : collections Payload, pages frontend, blog, expertises, services, réalisations
- Dark mode (palette navy)
- Méga-menu éditable depuis l'admin
- Catégories blog hiérarchiques (pôle → sous-catégorie)
- RBAC (admin/éditeur/contributeur/visiteur)
- Audit SEO/OG/sitemaps/JSON-LD
- Intégration Umami Analytics

### Ce qui est fait mais PAS commité (modifications locales non stagées)

Toutes les modifications ci-dessous sont dans le working tree, en attente de commit :

**1. Routing bilingue FR/EN complet**
- `src/middleware.ts` — redirect 307 vers `/fr/...` si pas de préfixe locale
- `src/utilities/i18n.ts` — `LOCALES = ['fr', 'en']`, `DEFAULT_LOCALE = 'fr'`, `isValidLocale()`
- `src/app/(frontend)/[locale]/` — toutes les pages migrées sous `[locale]` :
  - `layout.tsx` — layout racine avec `lang={locale}`, check mode maintenance
  - `page.tsx` — home
  - `[slug]/page.tsx` — pages dynamiques
  - `posts/` — liste + pagination + article
  - `expertises/[slug]/page.tsx`
  - `services/[slug]/page.tsx` ← **fichier central du problème en cours**
  - `realisations/[slug]/page.tsx`
  - `search/page.tsx`
- Les anciennes pages sans `[locale]` ont été supprimées (D dans git status)
- `src/components/LanguageSwitcher/` — switcher FR/EN dans le header
- Header, Footer, Nav, CMSLink — props `locale` ajoutées partout

**2. Mode maintenance / coming soon**
- `src/globals/SiteSettings.ts` — Global Payload avec toggle `enabled`, mode (maintenance/coming_soon), titre+message localisés, countdownDate, allowedIps
- `src/components/MaintenancePage/index.tsx` — page client avec countdown live
- Vérifié dans `src/app/(frontend)/[locale]/layout.tsx` — bypass si `draftMode` actif

**3. Route de traduction automatique FR→EN**
- `src/app/api/translate/route.ts` — POST `/api/translate`
- `src/components/admin/TranslateButton/index.tsx` — bouton sidebar Payload
- Champ UI `autoTranslate` ajouté aux collections : Pages, Posts, Expertises, Services

---

## Fonctionnalité traduction FR→EN — Architecture détaillée

### Problème de fond : 3 patterns i18n hétérogènes

Les collections n'utilisent pas toutes le même système i18n. **Décision prise : ne pas modifier les schémas des collections, adapter uniquement le code.**

#### Pattern 1 — Payload locales (`localized: true`)
Collections : `Expertises`, `Pages`, `Posts`

Ces champs ont `localized: true` dans leur schéma. Payload stocke une valeur par locale en base.

- **Expertises** : `subtitle`, `description`, `benefits[].benefit`, `process_steps[].title`, `process_steps[].description`, `faqs[].question`, `faqs[].answer`
- **Pages / Posts** : `meta.title`, `meta.description` (ajoutés par le SEO plugin `@payloadcms/plugin-seo`)

Stratégie : `payload.findByID({ locale: 'fr' })` → `payload.update({ locale: 'en', data })`

#### Pattern 2 — Champs `_en` manuels (Services)
Collection : `Services`

Les champs n'ont PAS `localized: true`. Des champs séparés `_en` ont été ajoutés manuellement dans le schéma :
- Flat : `title` / `title_en`, `description` / `description_en`
- RichText : `long_description` / `long_description_en`
- Arrays : `features[].feature` / `features[].feature_en`, `benefits[].benefit` / `benefits[].benefit_en`, `faqs[].question` / `faqs[].question_en`, `faqs[].answer` / `faqs[].answer_en`

Stratégie : `payload.findByID()` sans locale → `payload.update({ data: { title_en: '...' } })` sans locale

#### Pattern 3 — Champs non traduits (limitation connue)
- `Services.seo.metaTitle` / `seo.metaDescription` : groupe manuel sans `localized: true` ni `_en`
- `Services.process_steps[].title` / `.description` : pas de `_en` variants

Ces champs restent en FR faute de support dans le schéma.

### Structure de `TRANSLATABLE_FIELDS` dans la route

```typescript
type FieldDescriptor =
  | { kind: 'localized'; path: string }               // dot-notation, écrit via locale: 'en'
  | { kind: 'localized_richtext'; path: string }       // richText localized: true
  | { kind: 'array_localized'; array: string; fields: string[] } // items localized: true
  | { kind: 'manual_en'; source: string; target: string }        // flat _en
  | { kind: 'richtext_manual_en'; source: string; target: string } // richText _en
  | { kind: 'array_manual_en'; array: string; pairs: {source:string;target:string}[] }
```

### Fonction `translateLexical`

Parcourt récursivement le JSON Lexical. **Point critique :** Payload wrappe le contenu dans `{ root: { children: [...] } }` — la fonction détecte d'abord ce wrapper avant de descendre dans les nœuds. Les nœuds `type: 'text'` sont les seuls feuilles traduisibles. Les headings (`type: 'heading'`) sont des containers avec `children` — ils sont traversés automatiquement.

---

## ⚠️ PROBLÈME EN COURS — À résoudre en priorité

### Symptôme

Les champs `_en` de Services sont bien remplis en admin après traduction (confirmé). Mais sur le front en locale `en`, le contenu s'affiche toujours en français.

### Ce qui a déjà été tenté

Dans `src/app/(frontend)/[locale]/services/[slug]/page.tsx`, des variables locales ont été ajoutées pour sélectionner les `_en` manuellement :

```typescript
const en = locale === 'en'
const title       = (en && (s as any).title_en)        || s.title
const description = (en && (s as any).description_en)  || s.description
const richContent = (en && (s as any).long_description_en) || s.long_description
const benefits    = (s.benefits || []).map(b => (en && (b as any).benefit_en) || b.benefit).filter(Boolean)
const faqs        = (s.faqs || []).map(f => ({
  ...f,
  question: (en && (f as any).question_en) || f.question,
  answer:   (en && (f as any).answer_en)   || f.answer,
}))
```

Dans `src/Header/Component.tsx` (méga-menu), même logique pour `title_en`/`description_en`.

**Ça ne fonctionne pas.** La cause n'a pas encore été identifiée.

### Hypothèses à investiguer (dans cet ordre)

**1. Les champs `_en` sont peut-être `null` dans le doc retourné**
→ Ajouter un `console.log('title_en:', s.title_en)` dans le composant serveur et vérifier ce qui s'affiche dans les logs du `pnpm dev`. Si `null` ou `undefined`, le problème vient de la requête Payload, pas du JSX.

**2. Le `payload.find` passe `locale: 'fr' | 'en'` mais les champs `_en` ne sont pas localisés**
→ Les champs non-localisés devraient être retournés quelle que soit la locale. Mais vérifier que `payload.find({ locale: locale })` ne filtre pas les champs non-localisés dans cette version de Payload.

**3. Cache Next.js stale**
→ Tester avec `pnpm dev` (pas de cache) + hard refresh (Ctrl+Shift+R). Si ça marche en dev mais pas en prod → problème de cache statique (`generateStaticParams`).

**4. Le fallback `|| s.title` masque un `null` explicite**
→ Si `title_en` vaut `null` (pas `undefined`), `(en && null) || s.title` retourne `s.title` — le fallback est correct. Mais si `title_en` vaut `""` (string vide), même résultat. Utiliser `title_en ?? s.title` pour une sémantique différente.

**5. La query ne retourne pas les champs `_en` du tout**
→ Vérifier si `select` est utilisé quelque part qui exclurait les `_en`. Dans la page actuelle, `payload.find` est appelé sans `select` donc tous les champs devraient être retournés.

**6. Vérifier le type `Service` dans `payload-types.ts`**
→ Le type généré par Payload pour `Service` inclut-il `title_en`, `description_en`, etc. ? Si non, le cast `(s as any).title_en` fonctionnerait quand même à runtime mais ça confirmerait que les types sont désynchronisés.

### Commande utile pour regénérer les types Payload

```bash
pnpm payload generate:types
```

---

## Structure des fichiers clés

```
src/
├── app/
│   ├── (frontend)/
│   │   └── [locale]/          ← toutes les pages publiques
│   │       ├── layout.tsx     ← check maintenance, lang=locale
│   │       ├── page.tsx       ← home
│   │       ├── [slug]/        ← pages dynamiques
│   │       ├── posts/         ← blog
│   │       ├── expertises/[slug]/
│   │       ├── services/[slug]/page.tsx  ← ⚠️ fichier du problème EN
│   │       ├── realisations/[slug]/
│   │       └── search/
│   └── api/
│       └── translate/route.ts ← POST FR→EN via LibreTranslate
├── collections/
│   ├── Services.ts            ← champs _en manuels (title_en, description_en…)
│   ├── Expertises.ts          ← champs localized: true
│   ├── Pages/index.ts         ← meta.* via SEO plugin
│   └── Posts/index.ts         ← meta.* via SEO plugin
├── components/
│   ├── admin/
│   │   └── TranslateButton/index.tsx  ← bouton sidebar Payload
│   ├── LanguageSwitcher/      ← switcher FR/EN header
│   └── MaintenancePage/       ← countdown live
├── globals/
│   └── SiteSettings.ts        ← maintenance toggle, coming soon
├── Header/
│   ├── Component.tsx          ← ⚠️ méga-menu avec _en à corriger
│   └── Component.client.tsx
├── middleware.ts              ← redirect /fr/...
└── utilities/
    └── i18n.ts               ← LOCALES, DEFAULT_LOCALE
```

---

## Variables d'environnement (`.env`)

```
POSTGRES_URL / DATABASE_URI     → Neon PostgreSQL
PAYLOAD_SECRET                  → clé secrète Payload
NEXT_PUBLIC_SERVER_URL          → http://localhost:3000 (dev)
CRON_SECRET / PREVIEW_SECRET    → secrets internes
S3_BUCKET / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY / S3_ENDPOINT / S3_REGION → Cloudflare R2
NEXT_PUBLIC_UMAMI_WEBSITE_ID / NEXT_PUBLIC_UMAMI_SCRIPT_URL → Umami analytics
LIBRETRANSLATE_URL              → https://translate.nrjka.com (optionnel, c'est le défaut)
LIBRETRANSLATE_API_KEY          → si auth activée sur l'instance
```

---

## Contraintes techniques importantes

- `push: false` obligatoire sur l'adapter DB (sinon timeout 502 sur Netlify) — ne jamais changer ça
- Ne pas toucher `src/app/(payload)/` (panel admin auto-généré par Payload)
- `OrderedListFeature`/`UnorderedListFeature` (pas `ListFeature`) dans `@payloadcms/richtext-lexical@3.79.1`
- `TranslateButton` doit avoir `export default` pour être résolu par l'importMap Payload
- `revalidateTag` prend 2 args dans ce projet : `(tag, 'max')`
- Images R2 : utiliser `unoptimized` sur `<Image>` tant que le domaine R2 n'est pas dans `remotePatterns`
- La branche `main` est protégée — PRs obligatoires, jamais de push direct
- `pnpm payload generate:types` après toute modification de schéma de collection

---

## Utilisation des Skills

Avant de créer un fichier ou d'écrire du code, lis toujours le SKILL.md correspondant pour appliquer les bonnes pratiques.

### Skills personnels (dans le dossier `skills/` du projet)

- **karpathy-guidelines** → règles comportementales anti-erreurs LLM (simplicité, changements chirurgicaux, critères de succès vérifiables). À consulter SYSTÉMATIQUEMENT avant d'écrire ou modifier du code
- **security** → audit et implémentation sécurité (web, auth, secrets, base de données)
- **frontend-design** → design et intégration frontend de qualité
- **user-research** → planification et conduite de recherche utilisateur
- **research-synthesis** → synthèse de recherche (thèmes, insights, recommandations)
- **ux-copy** → rédaction UX (microcopy, messages d'erreur, CTAs, états vides)
- **design-critique** → critique structurée d'un design
- **design-handoff** → specs de handoff développeur

---

## Workflow Git

La branche `main` est protégée. Processus obligatoire :

```bash
git checkout -b feat/nom-de-la-tache
# ... modifications ...
git add fichiers-specifiques
git commit -m "feat: description claire"
git push origin feat/nom-de-la-tache
# → créer une PR vers main sur GitHub
```

Convention de nommage : `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`

---

## Règles de travail

- Lire les fichiers du projet avant de proposer des modifications
- Ne jamais modifier `src/app/(payload)/`
- Conserver les collections existantes du template (Pages, Posts, Media, Categories, Users)
- Les variables d'environnement sensibles sont dans `.env` — ne jamais les inclure dans le code
- Vérifier la cohérence des imports après chaque modification
- Après chaque modification significative, lancer `pnpm build` pour vérifier
- Déléguer à des sub-agents pour les tâches indépendantes parallélisables
