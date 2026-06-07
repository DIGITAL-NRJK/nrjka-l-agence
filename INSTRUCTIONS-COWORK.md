# Instructions pour Claude — Projet NRJKA Digital

## Contexte du projet

Tu travailles sur le projet NRJKA Digital, le site d'une agence web. Le projet est un site Next.js + Payload CMS v3 (monorepo) qui doit être migré de Vercel vers Netlify. Le compte Vercel a été supprimé, le code source est intact sur le poste local et sur GitHub.

## Architecture décidée

- **Netlify** → hébergement du site Next.js + Payload CMS
- **Coolify sur VPS IONOS** (217.160.55.39) → n8n, Metabase, futur Ollama + sites clients
- **Neon PostgreSQL** → base de données (externe, managée)
- **Cloudflare R2** → stockage des médias (remplace Vercel Blob)
- **Cloudflare** → CDN, DNS, protection. Domaine principal : nrjka.com, redirection nrjka.fr → nrjka.com
- **n8n** → automatisation (webhooks Payload → Notion, cold mail, scoring leads)
- Pas de hooks Notion dans le code Payload → tout passe par n8n via webhooks

## État actuel du projet

### Ce qui est fait
- Phase 1 : Projet créé depuis le template Payload website starter
- Phase 2 : 11 collections personnalisées ajoutées (Services, CaseStudies, Products, ContactMessages, Reviews, Testimonials, JobOffers, JobApplications, Appointments, BlogComments, Resources)
- Rôles RBAC sur Users (admin, editor, contributor, visitor)
- Fichier `src/access.ts` avec helpers de contrôle d'accès
- Coolify opérationnel avec n8n et Metabase
- Cloudflare configuré avec sous-domaines (n8n.nrjka.com, metabase.nrjka.com, coolify.nrjka.com)

### Ce qu'il reste à faire (dans cet ordre)
1. **Migration Vercel → Netlify** : changer l'adapter DB, le stockage média, déployer sur Netlify
2. **Supprimer les hooks Notion** des collections ContactMessages.ts et Appointments.ts (la sync sera gérée par n8n)
3. **Configurer le domaine nrjka.com** sur Netlify via Cloudflare
4. **Phase 3 — Migration des pages** : migrer les composants React du site Base44 vers Next.js App Router + Payload API
5. **Configurer les webhooks Payload → n8n**

## Modifications techniques pour la migration Netlify

### 1. Adapter la base de données
- Remplacer `@payloadcms/db-vercel-postgres` par `@payloadcms/db-postgres`
- Utiliser `postgresAdapter` avec `push: false` en production
- Variable d'env : `DATABASE_URI` (connection string Neon, déjà dans .env)

### 2. Adapter le stockage média
- Remplacer `@payloadcms/storage-vercel-blob` par `@payloadcms/storage-s3`
- Configurer pour Cloudflare R2 (S3-compatible)
- Variables d'env : S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_ENDPOINT, S3_REGION

### 3. Supprimer les hooks Notion
- Dans `src/collections/ContactMessages.ts` : supprimer le hook `afterChange` qui appelle l'API Notion
- Dans `src/collections/Appointments.ts` : supprimer le hook `afterChange` qui appelle l'API Notion
- Ces syncs seront gérées par n8n via webhooks Payload

## Contraintes techniques importantes

- `push: false` obligatoire sur l'adapter DB en production (sinon timeout 502 sur Netlify)
- Les fonctions Netlify ont une limite de 250 MB de bundle
- Le champ `role` dans Users ne doit PAS être `required: true` (casse les scripts seed)
- Les types doivent être castés `as string` dans access.ts pour éviter les erreurs TypeScript
- Le fichier tsconfig.json doit exclure le dossier `tests`

## Utilisation des Skills

Avant de créer un fichier ou d'écrire du code, lis toujours le SKILL.md correspondant pour appliquer les bonnes pratiques.

### Skills personnels (dans le dossier `skills/` du projet)

Ces skills sont prioritaires — ils reflètent les standards et méthodes de l'agence NRJKA :

- **build-premium-website** → pour la création de sites web premium (design system, animations, structure, thèmes). Contient un dossier `reference/` avec des exemples de code, composants et configurations
- **frontend-design** → pour le design et l'intégration frontend de qualité
- **security** → pour l'audit et l'implémentation de la sécurité (web, auth, secrets, base de données, desktop). Contient des guides spécialisés par domaine
- **accessibility-review** → pour l'audit d'accessibilité WCAG 2.1 AA (contraste, navigation clavier, lecteur d'écran)
- **design-critique** → pour la critique structurée d'un design (usabilité, hiérarchie visuelle, cohérence)
- **design-handoff** → pour la génération de specs de handoff développeur (layout, tokens, états, responsive, edge cases)
- **design-system** → pour l'audit, la documentation ou l'extension du design system
- **ux-copy** → pour la rédaction UX (microcopy, messages d'erreur, CTAs, états vides, onboarding)
- **user-research** → pour la planification et la conduite de recherche utilisateur
- **research-synthesis** → pour la synthèse de recherche utilisateur (thèmes, insights, recommandations)
- **karpathy-guidelines** → règles comportementales pour éviter les erreurs de code LLM courantes (simplicité, changements chirurgicaux, critères de succès vérifiables). À consulter SYSTÉMATIQUEMENT avant d'écrire ou modifier du code

### Skills système (intégrés à Claude)

- **docx / pdf / xlsx** → pour générer des documents professionnels
- **file-reading / pdf-reading** → pour lire et analyser les fichiers uploadés
- **engineering:code-review** → pour vérifier la qualité du code avant de commiter
- **engineering:testing-strategy** → pour définir les tests si nécessaire
- **engineering:documentation** → pour documenter les composants et l'architecture
- **engineering:debug** → en cas d'erreur de build ou de runtime

## Utilisation des Sub-agents

Délègue à des sub-agents quand des tâches sont indépendantes et peuvent être parallélisées :

### Exemples de tâches parallélisables
- Modifier `payload.config.ts` (adapter DB) ET supprimer les hooks Notion dans les collections → 2 tâches indépendantes
- Créer plusieurs pages Next.js en même temps (page Services + page Blog + page Contact) → chacune est indépendante
- Lire et analyser plusieurs fichiers du projet Base44 simultanément pour préparer la migration

### Exemples de tâches NON parallélisables (séquentielles)
- Modifier payload.config.ts puis vérifier que le build passe → dépendance
- Installer un package npm puis l'importer dans un fichier → dépendance
- Modifier une collection puis régénérer les types Payload → dépendance

### Règle générale
- Si deux tâches touchent des fichiers différents et n'ont pas de dépendance entre elles → sub-agent
- Si une tâche dépend du résultat d'une autre → séquentiel
- En cas de doute → séquentiel (plus sûr)

## Workflow Git — Protection de branche

La branche `main` est protégée. Ne jamais pousser directement sur `main`.

### Processus obligatoire
1. Crée une branche pour chaque tâche ou groupe de modifications cohérent :
   ```bash
   git checkout -b feat/nom-de-la-tache
   ```
2. Fais tes modifications, commite avec des messages clairs et descriptifs
3. Pousse la branche :
   ```bash
   git push origin feat/nom-de-la-tache
   ```
4. Crée une Pull Request vers `main` sur GitHub
5. Attends la validation avant de merger

### Convention de nommage des branches
- `feat/xxx` → nouvelle fonctionnalité (ex: `feat/migration-netlify`, `feat/page-services`)
- `fix/xxx` → correction de bug (ex: `fix/typescript-errors`, `fix/build-netlify`)
- `chore/xxx` → maintenance, config, dépendances (ex: `chore/remove-vercel-deps`)
- `docs/xxx` → documentation (ex: `docs/readme-update`)

### Convention de messages de commit
- `feat: description` → ajout de fonctionnalité
- `fix: description` → correction
- `chore: description` → maintenance
- `refactor: description` → restructuration sans changement fonctionnel
- `docs: description` → documentation

### Règles de protection (ruleset GitHub)
- Pas de push direct sur `main` (non-fast-forward interdit)
- Pas de suppression de la branche `main`
- Pull Request obligatoire pour merger dans `main`
- Méthodes de merge autorisées : merge, squash, rebase

## Règles de travail

- Lis les fichiers du projet pour comprendre le code existant avant de proposer des modifications
- Propose un changement à la fois, pas tout en même temps
- Ne modifie JAMAIS les fichiers toi-même — donne-moi les instructions pour que je le fasse
- Ne touche JAMAIS au dossier `src/app/(payload)/` (c'est le panel admin auto-généré)
- Conserve les collections existantes du template (Pages, Posts, Media, Categories, Users) — ne les supprime pas
- Les variables d'environnement sensibles sont dans `.env` à la racine — ne les inclus jamais dans le code
- Vérifie la cohérence des imports quand tu me proposes une modification
- Après chaque modification significative, demande-moi de lancer `pnpm build` pour vérifier que rien n'est cassé

## Git — Rôles et responsabilités

**Tu ne fais JAMAIS de `git add`, `git commit`, `git push`, `git checkout`, `git branch` toi-même.**
**Tu ne modifies JAMAIS les fichiers du projet toi-même.**

Les modifications de fichiers, commits, branches et pushs sont gérés exclusivement par moi (l'utilisateur). Ton rôle est de me guider :

1. **Me dire quel fichier modifier** (chemin complet)
2. **Me montrer le code exact à remplacer** : le bloc AVANT et le bloc APRÈS, pour que je puisse copier-coller
3. **Me donner les commandes git** à exécuter pour chaque changement :
   ```
   git add .
   git commit -m "feat: description claire du changement"
   git push origin nom-de-la-branche
   ```
4. **Après chaque merge validé sur GitHub**, me donner la commande pour revenir sur la branche principale à jour :
   ```
   git checkout main
   git pull
   ```
5. **Ne jamais passer au changement suivant** sans que j'aie confirmé que le précédent est fait
6. **Si un nouveau fichier doit être créé**, me donner le chemin et le contenu complet à y mettre

## Communication et prises de décision

Quand tu as besoin de me poser une question ou que je dois prendre une décision technique :

- **Explique le contexte** : pourquoi cette question se pose, qu'est-ce qui a amené à ce choix
- **Vulgarise les termes techniques** : je peux ne pas comprendre certaines notions. Par exemple, ne me demande pas de choisir entre "NEXT_PUBLIC_SERVER_URL uniquement" et "NEXT_PUBLIC_SERVER_URL + fallback Netlify" sans m'expliquer ce que chaque option fait concrètement, ce que je gagne et ce que je perds
- **Donne ta recommandation** : après l'explication, dis-moi clairement quelle option tu recommandes et pourquoi
- **Formule la question simplement** : utilise des termes métier (vitesse, sécurité, coût, simplicité) plutôt que du jargon technique
- **Donne des exemples concrets** : "si tu choisis A, quand un visiteur ouvre ton site il verra X. Si tu choisis B, il verra Y"

Le but est que chaque décision que je prends soit éclairée, pas que je valide quelque chose que je ne comprends pas.