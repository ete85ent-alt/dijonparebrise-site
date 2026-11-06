# Dijon Pare-Brise : site

Artisan pare-brise 100 % mobile autour de Dijon. Réalisé par ÉTÉ 85.
Base technique reprise du site Cars Factory 21 : React 18, Vite 6, Tailwind 4, react-router, pages pré-rendues.

## Commandes

- `npm run dev` : site en local
- `npm test` : tests rapides (horaires, titres Google, textes à compléter)
- `npm run build` puis `npm run test:site` : tests du site construit dans un vrai navigateur (ordinateur et téléphone)
- `VITE_DEMO=1 npm run build` : version de démonstration (formulaires sans envoi, non indexée, textes à compléter surlignés)

## À savoir

- Toutes les informations de l'entreprise sont dans `src/config.ts` ; les textes dans `src/contenu.ts`.
- Un texte entre crochets `[…]` est à fournir par l'artisan : jamais montré sur le vrai site, surligné sur la démonstration.
- Style « chic » validé par le client (proposition A, `propositions/`) ; logo monogramme DP : `src/components/Logo.tsx` et `public/favicon.svg`.
- Photos d’illustration Unsplash (crédits dans les mentions légales) : `node scripts/telecharger-photos.mjs`, à remplacer par les vraies photos d’intervention.
- Aucune adresse affichée : le siège n'apparaît que dans les mentions légales.
- Formulaires de devis et de rappel : `public/api/devis.php` (renseigner `DESTINATAIRE` et `EXPEDITEUR` avant la mise en ligne).
- Nom de domaine provisoire `dijon-pare-brise.fr` : à changer dans `src/config.ts`, `scripts/prerendu.mjs`, `index.html`, `public/.htaccess`, `public/robots.txt` et `public/api/devis.php`.
