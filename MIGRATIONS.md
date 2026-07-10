# Migrations — antisèche NRJKA

Mode **hybride** : `push: true` dans `payload.config.ts` (init/dev rapides) **+** migrations pour la prod (Netlify lance `payload migrate`).

---

## 🟢 La règle d'or

> **`migrate:create` est TOUJOURS la 1ʳᵉ commande après avoir modifié le schéma — avant `pnpm dev` et avant `pnpm build`.**

Pourquoi : avec `push: true`, la Dev DB se synchronise dès que Payload démarre (`dev`, `build`, `start`).
Si tu lances `dev`/`build` en premier, la base reçoit déjà le changement → `migrate:create` répond
**« No schema changes detected »** → et là seulement il faut la manip pénible (mig-tmp).

Tant que tu respectes la règle d'or, tu ne touches **jamais** à `push` et tu n'as **jamais** besoin de mig-tmp.

---

## Boucle normale (à chaque changement de schéma)

```bash
# 0. Édite le schéma (collection / global / champ) dans src/…

# 1. AVANT tout dev/build → génère la migration (le diff est détecté)
pnpm payload migrate:create nom_du_changement

# 2. Applique + régénère les types
pnpm payload migrate          # applique la migration à la Dev DB
pnpm generate:types           # met à jour src/payload-types.ts

# 3. Vérifie et commite
pnpm build                    # typecheck complet
#   → git add src/migrations + code + payload-types.ts, puis commit
```

Prérequis `.env` : `DATABASE_URI` = branche **Dev**, `PAYLOAD_SECRET` présent
(sinon « missing secret key »).

---

## 🔴 Rattrapage : tu as déjà lancé `dev`/`build` avant `migrate:create`

La Dev DB est en avance → `migrate:create` ne voit plus de diff. Génère la migration
contre une base qui n'a **pas** encore le changement (un clone de **production**) :

```bash
# 1. Réponds N si on te propose une "blank migration".

# 2. Neon → crée une branche jetable « mig-tmp » depuis la branche PRODUCTION.
#    Copie sa connection string.

# 3. .env : DATABASE_URI = mig-tmp (temporairement)
pnpm payload migrate:create nom_du_changement   # diff détecté → écrit .ts + .json

# 4. .env : DATABASE_URI = Dev (remets). Supprime mig-tmp dans Neon.

# 5. Types + build + commit (la Dev DB a déjà le schéma via push, pas besoin de migrate)
pnpm generate:types
pnpm build
```

⚠️ La branche mig-tmp vient de **production** (pas de Dev) pour que le `up` ne contienne
que le delta voulu. Ouvre toujours le `.ts` généré avant de commiter.

---

## Prod (Netlify)

Rien à faire à la main : le build Netlify exécute `payload migrate` qui applique les
migrations non encore jouées. Il suffit que le fichier de migration + son `.json` soient commités.
