# Educate4Dignity Frontend

React + TypeScript + Vite application for the Educate4Dignity platform (admin + public experiences).

## 1. Prerequisites
- Node.js 18+ (recommandé LTS)
- npm (fourni avec Node) ou pnpm/yarn (si vous adaptez les commandes)

## 2. Installer les dépendances
```bash
npm install
```

## 3. Démarrer en développement
Démarre Vite (hot reload sur http://localhost:3000).
```bash
npm run dev
```

## 4. Scripts principaux
| Commande | Description |
|----------|------------|
| `npm run dev` | Serveur développement + HMR |
| `npm run build` | Type check + build production dans `dist/` |
| `npm run preview` | Servir le build localement (après build) |
| `npm run lint` | Lint TypeScript/React |
| `npm run extract:spec` | Script interne d'extraction de spec (DOCX -> context) |

## 5. Build production
```bash
npm run build
```
Le build optimisé est généré dans `dist/` (ignoré par git).

## 6. Lancer l'aperçu du build
```bash
npm run preview
```

## 7. Structure (résumé)
```
src/
  components/         Composants UI réutilisables
  components/admin    Layout + widgets admin (KPI, tableaux, filtres)
  hooks/              Hooks (données dashboard, projets, auth)
  services/           Services simulés (mock) -> prêts pour API réelle
  mock/               Données locales (db.ts)
  pages/              Pages publiques et admin
  i18n/               Initialisation et clés de traduction
  data/               Specs, constantes, manifestes
public/               Assets statiques
```

## 8. Internationalisation (i18n)
Basé sur i18next + react-i18next. Ajoutez vos clés dans `src/i18n/index.ts`. Pour un nouveau domaine: créer un objet ou un namespace puis consommer via `useTranslation()`.

## 9. Styles
- TailwindCSS (utilities)
- Variables design admin: `src/components/admin/admin-tokens.css`

## 10. Lancer les tests (TODO)
Aucun framework de test configuré encore. Suggestion: Vitest + Testing Library.

## 11. Contribution (workflow Git simple)
```bash
# créer branche de feature
git checkout -b feature/ma-feature
# coder + ajouter fichiers
git add .
# commit
git commit -m "feat: description"
# push
git push -u origin feature/ma-feature
# ouvrir une Pull Request sur GitHub
```

## 12. Déploiement (idée simple)
1. Construire: `npm run build`
2. Déployer le dossier `dist/` sur un hébergeur statique (Netlify, Vercel, GitHub Pages).

## 13. Problèmes courants
| Problème | Solution |
|----------|----------|
| Port déjà utilisé | Changer le port: `npm run dev -- --port=4000` |
| Erreur de type TS | Lancer `npm run build` pour voir le détail |
| Fichier trop long pour Git (Windows) | `git config core.longpaths true` |

## 14. Licence
MIT.

---
Rapide pour démarrer: 1) `npm install` 2) `npm run dev` 3) coder ✨
