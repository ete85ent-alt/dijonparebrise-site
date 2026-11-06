/*
 * Toutes les informations de Dijon Pare-Brise, au même endroit.
 * Les valeurs entre crochets [ ] sont À REMPLIR avec l'artisan : rien n'a été inventé.
 * Sur le vrai site, un texte entre crochets n'est jamais montré (voir aCompleter.tsx) ; sur la démonstration, il est surligné.
 */

export const site = {
  nom: "Dijon Pare-Brise",
  metier: "Remplacement et réparation de pare-brise à domicile",
  // Adresse du site en ligne : à confirmer (nom de domaine pas encore réservé). Même valeur dans scripts/prerendu.mjs.
  siteUrl: "https://www.dijon-pare-brise.fr",
  telephone: "[06 00 00 00 00]",
  telephoneLien: "", // ex. '+33600000000' : vide = boutons d'appel vers le formulaire « Être rappelé »
  email: "[contact@domaine.fr]",
  lienAvisGoogle: "", // lien vers les avis Google (fiche à créer)
  // Horaires : à confirmer. Tant que « confirmes » vaut false, le statut « Ouvert / Fermé » n'apparaît que sur la démonstration.
  horaires: {
    confirmes: false,
    jours: [1, 2, 3, 4, 5, 6], // 0 = dimanche … 6 = samedi
    ouverture: 8 * 60,
    fermeture: 18 * 60,
    texte: "[Lundi – samedi, 8 h – 18 h]",
  },
  offre: {
    titre: "200 € offerts",
    texte: "sur tout remplacement de pare-brise",
    conditions:
      "[Forme de l’offre et conditions à préciser : bon d’achat, remise, carte cadeau…]",
  },
  // Délais et garanties : à confirmer avec l'artisan
  delaiReponse: "[2 h ouvrées]",
  delaiRendezVous: "[48 h]",
  dureePose: "[environ 1 h 30]",
  delaiAvantRoute: "[1 h]",
  garantie: "[12 mois]",
  zone: { texte: "Dijon et sa métropole", rayon: "[Rayon : 30 km]" },
  chiffres: [
    ["[4,9] ★", "[XX] avis Google"],
    ["[XXX]", "pare-brise posés"],
    ["[X] ans", "d’expérience"],
    ["[12] mois", "de garantie sur la pose"],
  ] as [string, string][],
  mentions: {
    raisonSociale: "DIJON PARE-BRISE, SASU",
    capital: "1 000 €",
    siren: "109 984 252",
    rcs: "RCS Dijon [à confirmer]",
    // Siège social : n'apparaît que dans les mentions légales (obligatoire). Pas d'atelier : l'artisan se déplace.
    siege: "6-8 rue de Bastogne, 21850 Saint-Apollinaire",
    responsable: "Mohamed EL QAMAR, président",
    hebergeur:
      "[Hébergeur du site, ex. OVH SAS, 2 rue Kellermann, 59100 Roubaix]",
  },
};

/** Lien d'appel : le numéro s'il est connu, sinon le formulaire « Être rappelé ». */
export const lienAppel = () =>
  site.telephoneLien ? `tel:${site.telephoneLien}` : "/#rappel";
