# Audit d'accessibilité — NRJKA

**Standard :** WCAG 2.1 AA · **Date :** 7 juillet 2026 · **Portée :** audit au niveau du code (composants, tokens de couleur, CSS global), palette par défaut *navy-terracotta* + mécanisme multi-palettes.

## Résumé

Le site est **très accessible**. La base est complète : skip-link vers `#main`, landmarks (`header`/`main`/`footer`), `lang` par langue, `:focus-visible` (anneau terracotta), `prefers-reduced-motion`, `alt` obligatoire sur les médias, navigation clavier du mégamenu (Échap + retour focus, `aria-haspopup`/`aria-controls`, hors flux quand fermé), `role="alert"` + `aria-live` sur les formulaires, honeypots masqués. Le panneau « Accessibilité » est honnête (pas de faux score).

**Le contraste des couleurs est maîtrisé, y compris là où c'est piégeux** (voir ci-dessous). Il ne reste que des points d'**amélioration mineurs**, aucun bloquant.

**Problèmes trouvés : 3** — 🔴 Critique : 0 · 🟡 Majeur : 1 · 🟢 Mineur : 2.

---

## Contraste des couleurs — CONFORME

Le terracotta de marque est clair (`#f4a261`) : inutilisable tel quel comme **texte** sur fond clair. Mais c'est **déjà géré** par un token dédié :

- `--terracotta-text` (défaut `#b45309` ≈ **5:1** sur blanc ✅), **décliné sur les 25 palettes** (valeurs assombries adaptées à chaque fond).
- La règle `.text-terracotta-dark { color: var(--terracotta-text) }` fait que l'utilitaire `text-terracotta-dark` rend la couleur **accessible**, pas le terracotta clair.
- En mode sombre, l'accent clair est restauré (lisible sur fond navy).

| Élément | Texte | Fond | Ratio | Requis | OK ? |
|---|---|---|---|---|---|
| Titres / corps (`--ink`) | #1a1f2e | #ffffff | ~17:1 | 4.5:1 | ✅ |
| Texte secondaire (`--slate`) | #64748b | #ffffff | 4.8:1 | 4.5:1 | ✅ |
| Texte « terracotta » (rendu `--terracotta-text`) | #b45309 | #ffffff | 5.0:1 | 4.5:1 | ✅ |
| Texte navy sur bouton terracotta | #1f2a44 | #f4a261 | 6.8:1 | 4.5:1 | ✅ |
| Blanc / blanc 70 % sur navy | #fff / #bcbfc7 | #1f2a44 | 14:1 / 7:1 | 4.5:1 | ✅ |
| Étoiles d'avis terracotta | #f4a261 | panneau navy | élevé | 3:1 | ✅ |

---

## Constatations restantes

### Utilisable

| # | Problème | Critère | Sévérité | Recommandation |
|---|---|---|---|---|
| 1 | `ResourceGateForm` (vrai modal, `aria-modal="true"`) ne confinait pas la tabulation — Tab pouvait sortir vers l'arrière-plan. (Le ChatWidget et le panneau a11y sont **non-modaux** : les piéger serait un anti-pattern ; leur Échap + focus initial est correct.) | 2.4.3 Ordre du focus | 🟡 Majeur | Confiner le focus dans le modal. **→ corrigé dans ce lot** (hook `useFocusTrap` sur `ResourceGateForm`). |
| 2 | Cibles tactiles : boutons « fermer »/compteurs (h-7 = 28 px, icônes h-8/9) < 44×44 px. | 2.5.5 Cible tactile | 🟢 Mineur | Agrandir la zone cliquable à ≥ 44 px (padding / `min-h`). |
| 3 | Survol de lien `hover:text-terracotta-dark` : l'état survolé retombe sur le terracotta clair (non couvert par la surcharge), ~2.4:1 le temps du survol. | 1.4.3 Contraste | 🟢 Mineur | Étendre la surcharge accessible à l'état `:hover`, ou utiliser un survol navy. |

### Perceptible / Robuste — RAS

Rien à corriger en code. Le seul point ouvert relève de l'**humain** : la **qualité des `alt`** dépend de la saisie éditoriale (le champ est obligatoire, mais un `alt` peut être peu descriptif). À soigner sur les médias réels.

---

## Priorités

1. **🟡 Piège de focus** — corrigé dans ce lot (hook `useFocusTrap` sur le modal `ResourceGateForm` ; les panneaux non-modaux restent volontairement libres).
2. **🟢 Cibles tactiles** — polish rapide (padding des boutons icônes).
3. **🟢 Survol terracotta** — polish.

## Ce qui reste hors code (côté humain)

- **Test réel au lecteur d'écran** (VoiceOver/NVDA) sur 2-3 parcours — un audit de code ne remplace pas l'écoute réelle.
- **Passage axe/Lighthouse sur la prod** pour confirmer le rendu réel.
- **`alt` descriptifs** sur les médias.

## Note de méthode

Une première version de ce rapport signalait à tort un échec de contraste critique sur le texte terracotta : la lecture des tokens (`--terracotta-dark #e89251`) ne montrait pas la surcharge `.text-terracotta-dark → --terracotta-text`. Après vérification du CSS complet, le contraste est bien conforme. Corrigé.
