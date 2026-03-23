# Phase 2 — Guide d'intégration des collections NRJKA

## Ce que contient ce dossier

```
collections/
├── access.ts              ← Fonctions de contrôle d'accès (RBAC)
├── Services.ts            ← Services de l'agence
├── CaseStudies.ts         ← Études de cas / portfolio
├── Products.ts            ← Produits de la boutique
├── ContactMessages.ts     ← Messages de contact (+ sync Notion)
├── Reviews.ts             ← Avis clients
├── Testimonials.ts        ← Témoignages sélectionnés
├── JobOffers.ts           ← Offres d'emploi
├── JobApplications.ts     ← Candidatures
├── Appointments.ts        ← Rendez-vous (+ sync Notion)
├── BlogComments.ts        ← Commentaires de blog
├── Resources.ts           ← Ressources téléchargeables
└── UsersRoleFields.ts     ← Champs de rôle à ajouter aux Users
```

## Prérequis

Tu dois avoir :
- Le projet cloné sur ton ordinateur (Phase 1 terminée)
- VS Code ouvert sur le dossier du projet
- Le terminal ouvert dans le dossier du projet

---

## Étape 1 : Clone le repo sur ton ordinateur

Si ce n'est pas déjà fait :

```bash
git clone https://github.com/TON-USERNAME/nrjka-digital.git
cd nrjka-digital
pnpm install
```

Pour installer pnpm si tu ne l'as pas :
```bash
npm install -g pnpm
```

---

## Étape 2 : Configure ton environnement local

```bash
cp .env.example .env
```

Ouvre le fichier `.env` et remplis les valeurs.

Va dans Vercel → ton projet → Settings → Environment Variables.
Pour chaque variable, clique sur l'icône œil pour révéler la valeur,
puis copie-la dans ton fichier `.env` local.

Les variables essentielles à copier :
```
POSTGRES_URL=...          (copie la valeur de NRJKA_POSTGRES_URL)
DATABASE_URI=...          (même valeur que POSTGRES_URL)
BLOB_READ_WRITE_TOKEN=... (copie depuis Vercel)
PAYLOAD_SECRET=...        (copie depuis Vercel)
```

---

## Étape 3 : Copie le fichier access.ts

Copie le fichier `access.ts` de ce dossier vers ton projet :

```bash
cp access.ts src/access.ts
```

> Ce fichier contient les fonctions de contrôle d'accès utilisées par
> toutes les collections. Il doit être à la racine de `src/`.

---

## Étape 4 : Copie les fichiers de collections

Copie chaque fichier de collection dans le dossier `src/collections/` :

```bash
cp Services.ts src/collections/Services.ts
cp CaseStudies.ts src/collections/CaseStudies.ts
cp Products.ts src/collections/Products.ts
cp ContactMessages.ts src/collections/ContactMessages.ts
cp Reviews.ts src/collections/Reviews.ts
cp Testimonials.ts src/collections/Testimonials.ts
cp JobOffers.ts src/collections/JobOffers.ts
cp JobApplications.ts src/collections/JobApplications.ts
cp Appointments.ts src/collections/Appointments.ts
cp BlogComments.ts src/collections/BlogComments.ts
cp Resources.ts src/collections/Resources.ts
```

---

## Étape 5 : Corrige les chemins d'import dans chaque fichier

Dans chaque fichier que tu viens de copier, la première ligne d'import dit :

```typescript
import { publicRead, editorOrAdmin, adminOnly } from './access'
```

Change-la en :

```typescript
import { publicRead, editorOrAdmin, adminOnly } from '../access'
```

(Ajoute `../` devant `access` car le fichier est dans le dossier parent)

Fais-le pour CHAQUE fichier. Les imports exacts à corriger :

| Fichier | Remplace | Par |
|---------|----------|-----|
| Services.ts | `'./access'` | `'../access'` |
| CaseStudies.ts | `'./access'` | `'../access'` |
| Products.ts | `'./access'` | `'../access'` |
| ContactMessages.ts | `'./access'` | `'../access'` |
| Reviews.ts | `'./access'` | `'../access'` |
| Testimonials.ts | `'./access'` | `'../access'` |
| JobOffers.ts | `'./access'` | `'../access'` |
| JobApplications.ts | `'./access'` | `'../access'` |
| Appointments.ts | `'./access'` | `'../access'` |
| BlogComments.ts | `'./access'` | `'../access'` |
| Resources.ts | `'./access'` | `'../access'` |

---

## Étape 6 : Ajoute les rôles à la collection Users

Le template a déjà un fichier Users. Tu dois le modifier, PAS le remplacer.

1. Ouvre `src/collections/Users/index.ts` (ou `Users.ts`)
2. Trouve le tableau `fields: [...]`
3. Ajoute ces champs AU DÉBUT du tableau, avant les champs existants :

```typescript
{
  name: 'role',
  type: 'select',
  required: true,
  defaultValue: 'visitor',
  label: 'Rôle',
  options: [
    { label: 'Super Admin', value: 'admin' },
    { label: 'Éditeur', value: 'editor' },
    { label: 'Contributeur', value: 'contributor' },
    { label: 'Visiteur', value: 'visitor' },
  ],
  access: {
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  admin: { position: 'sidebar' },
},
{
  name: 'firstName',
  type: 'text',
  label: 'Prénom',
},
{
  name: 'lastName',
  type: 'text',
  label: 'Nom',
},
{
  name: 'phone',
  type: 'text',
  label: 'Téléphone',
},
```

---

## Étape 7 : Enregistre les collections dans payload.config.ts

Ouvre le fichier `src/payload.config.ts`.

1. Ajoute les imports en haut du fichier (après les imports existants) :

```typescript
import { Services } from './collections/Services'
import { CaseStudies } from './collections/CaseStudies'
import { Products } from './collections/Products'
import { ContactMessages } from './collections/ContactMessages'
import { Reviews } from './collections/Reviews'
import { Testimonials } from './collections/Testimonials'
import { JobOffers } from './collections/JobOffers'
import { JobApplications } from './collections/JobApplications'
import { Appointments } from './collections/Appointments'
import { BlogComments } from './collections/BlogComments'
import { Resources } from './collections/Resources'
```

2. Trouve le tableau `collections: [...]` dans la config.
   Il contient déjà des collections comme `Users`, `Media`, `Pages`, `Posts`.
   Ajoute les nouvelles collections À LA SUITE des existantes :

```typescript
collections: [
  // ... collections existantes du template (Users, Pages, Posts, Media) ...

  // Tes collections personnalisées NRJKA :
  Services,
  CaseStudies,
  Products,
  ContactMessages,
  Reviews,
  Testimonials,
  JobOffers,
  JobApplications,
  Appointments,
  BlogComments,
  Resources,
],
```

---

## Étape 8 : Teste en local

```bash
pnpm dev
```

Si tu vois des erreurs, vérifie :
- Que les chemins d'import sont corrects (étape 5)
- Que tu n'as pas de virgule manquante dans payload.config.ts
- Que le fichier access.ts est bien dans src/

Ouvre http://localhost:3000/admin — tu devrais voir dans la sidebar :
- Les sections "Contenu", "E-commerce", "CRM", "RH"
- Toutes tes nouvelles collections

---

## Étape 9 : Déploie

```bash
git add .
git commit -m "feat: ajout des 11 collections NRJKA + rôles utilisateurs"
git push
```

Vercel redéploie automatiquement. La base de données sera mise à jour.

---

## Étape 10 : Attribue-toi le rôle Admin

Après le déploiement :
1. Va sur ton-site.vercel.app/admin
2. Connecte-toi
3. Va dans Users → clique sur ton profil
4. Change le rôle en "Super Admin"
5. Enregistre

---

## Résumé de ce que tu as maintenant

| Collection | Dans l'admin | Accès public | Accès éditeur | Accès admin |
|------------|-------------|--------------|---------------|-------------|
| Services | Contenu | Lecture | Lecture + Écriture | Tout |
| Études de cas | Contenu | Lecture | Lecture + Écriture | Tout |
| Témoignages | Contenu | Lecture | Lecture + Écriture | Tout |
| Commentaires | Contenu | Lecture + Créer | Lecture + Écriture | Tout |
| Ressources | Contenu | Lecture | Lecture + Écriture | Tout |
| Produits | E-commerce | Lecture | Lecture + Écriture | Tout |
| Messages | CRM | Créer seulement | Lecture + Écriture | Tout |
| Avis | CRM | Lecture + Créer | Lecture + Écriture | Tout |
| Rendez-vous | CRM | Créer seulement | Lecture + Écriture | Tout |
| Offres emploi | RH | Lecture | Lecture + Écriture | Tout |
| Candidatures | RH | Créer seulement | Lecture + Écriture | Tout |
