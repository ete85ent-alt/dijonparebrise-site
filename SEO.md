# Référencement (SEO) — Dijon Pare-Brise

## Déjà en place dans le site

- Pages pré-rendues en HTML complet (Google lit le contenu sans exécuter le JavaScript).
- Titre et description Google par page, testés (≤ 60 et ≤ 160 caractères) : `src/routes.tsx`.
- Un seul titre principal (h1) qui contient le métier et la ville : « Artisan pare-brise · Dijon — Votre pare-brise, remplacé là où vous êtes. »
- Données structurées (`src/seo.ts`) : entreprise locale (AutoRepair) avec adresse, coordonnées GPS, communes desservies et prestations ; questions fréquentes (FAQPage). Les informations entre crochets ne sont jamais envoyées.
- Plan du site `sitemap.xml`, `robots.txt`, adresse canonique, page 404 réelle.
- Image de partage 1200 × 630 (`public/partage.jpg`, `node scripts/image-partage.mjs`) pour WhatsApp, Facebook, SMS, LinkedIn.
- Site rapide sur téléphone : photos en 3 tailles, police hébergée sur le site, aucun cookie.
- La démonstration GitHub Pages n'est pas indexée (normal) : seul le vrai domaine le sera.

## À faire à la mise en ligne

1. **Nom de domaine** : remplacer `dijon-pare-brise.fr` partout (voir README), mettre le site en HTTPS.
2. **Compléter `src/config.ts`** : téléphone, e-mail, horaires (`confirmes: true`), lien de la fiche Google (`lienAvisGoogle`). Ils seront ajoutés automatiquement aux données Google.
3. **Google Search Console** : ajouter le domaine, envoyer `https://www.<domaine>/sitemap.xml`, demander l'indexation de l'accueil.
4. **Bing Webmaster Tools** : importer depuis Search Console (2 minutes).

## Le plus important pour un artisan qui se déplace : la fiche Google

5. **Créer la fiche Google Business Profile** « Dijon Pare-Brise » :
   - catégorie principale « Service de réparation de pare-brise », secondaire « Service de remplacement de vitres de voiture » ;
   - entreprise **de services de proximité** : adresse masquée ou affichée au choix, et **zone desservie** = les 8 communes ;
   - téléphone, site web, horaires, description, photos d'interventions réelles (avant / après), services (remplacement, impact, vitres) ;
   - publier régulièrement (une intervention, une astuce) et activer la messagerie.
6. **Avis Google** : demander un avis à chaque client (lien court ou QR code sur la facture). Répondre à tous les avis. C'est le premier critère du classement local.
7. **Cohérence du nom, de l'adresse et du téléphone** partout (identiques au caractère près) : fiche Google, site, PagesJaunes, Facebook, annuaires.

## Ensuite (selon le temps et le budget)

8. **Annuaires** : PagesJaunes, Apple Plans (Apple Business Connect), Bing Places, Waze, Facebook / Instagram.
9. **Liens locaux** : partenaires (garages, carrossiers, assureurs, concessions), associations de commerçants de Dijon.
10. **Contenu** : quand l'artisan aura de vraies interventions, une page « Réalisations » avec photos et commune (c'est ce qui peut justifier plus tard des pages par commune).
11. **Suivi** : Search Console tous les mois (recherches, clics, position) et statistiques de la fiche Google (appels, itinéraires).
