/* Textes du site : prestations, questions fréquentes et communes desservies.
   Entre crochets : à confirmer avec l'artisan (voir src/aCompleter.tsx). */
import { aCompleter } from './aCompleter'
import { site } from './config'

export type Icone = 'parebrise' | 'impact' | 'vitre'

export const PRESTATIONS: { id: Icone; titre: string; texte: string }[] = [
  { id: 'parebrise', titre: 'Remplacement de pare-brise', texte: 'Vitrage adapté à votre modèle, pose et collage dans les règles, chez vous ou au travail.' },
  { id: 'impact', titre: 'Réparation d’impact', texte: 'On vérifie toujours d’abord si l’impact se répare : c’est moins cher et plus rapide [durée : environ 30 minutes ?].' },
  { id: 'vitre', titre: 'Vitres latérales et lunette arrière', texte: 'Vitre brisée ou lunette arrière : remplacement rapide, véhicule de nouveau fermé et sécurisé.' },
]

export const ENGAGEMENTS: [string, string][] = [
  ['On vient à vous', 'Chez vous, au travail ou sur un parking.'],
  ['Démarches assurance', 'Déclaration et prise en charge gérées pour vous.'],
  [site.offre.titre, 'Sur tout remplacement de pare-brise [conditions à préciser].'],
  [`Garantie ${site.garantie}`, 'Pose garantie [vitrage de qualité origine ?].'],
]

/** [question, réponse, incomplète ?] : une réponse incomplète n'apparaît que sur la démonstration. */
export const FAQ: [string, string, boolean?][] = [
  ['Réparer l’impact ou changer le pare-brise ?',
    'Un impact plus petit qu’une pièce de 2 €, hors du champ de vision du conducteur, peut souvent être réparé. Une fissure ou un impact plus large impose le remplacement : envoyez une photo, on vous le dit tout de suite.'],
  ['Combien de temps dure l’intervention ?',
    `Comptez ${site.dureePose} de pose, puis ${site.delaiAvantRoute} avant de reprendre la route, le temps que la colle sèche.`,
    aCompleter(site.dureePose) || aCompleter(site.delaiAvantRoute)],
  ['Faut-il avancer de l’argent ?',
    'Si votre contrat comprend la garantie bris de glace, vous n’avancez rien : nous déclarons le sinistre et nous nous faisons régler directement par votre assureur. Seule la franchise éventuelle reste à votre charge, selon votre contrat.'],
  ['Mon assureur m’impose-t-il un réparateur ?',
    'Non : vous êtes libre de choisir votre réparateur, agréé par votre assureur ou non. [Formulation à faire valider.]'],
  ['Un pare-brise fissuré passe-t-il le contrôle technique ?',
    'Un pare-brise endommagé dans le champ de vision du conducteur peut entraîner une contre-visite. Mieux vaut le faire réparer ou remplacer avant le contrôle.'],
  ['Où intervenez-vous ?',
    `À votre domicile, sur votre lieu de travail ou sur un parking, à Dijon et dans sa métropole ${site.zone.rayon}. Nous n’avons pas d’atelier : nous venons à vous avec tout le matériel.`],
  ['Que faut-il préparer ?',
    'Votre carte verte (ou le nom de votre assureur), l’immatriculation du véhicule et, si possible, une photo du dégât. Prévoyez un endroit où garer la voiture pendant la pose.'],
]

/** Communes desservies (citées dans le texte du site, et codes postaux reconnus par le devis). */
export const COMMUNES: { nom: string; codePostal: string }[] = [
  { nom: 'Dijon', codePostal: '21000' },
  { nom: 'Chenôve', codePostal: '21300' },
  { nom: 'Talant', codePostal: '21240' },
  { nom: 'Quetigny', codePostal: '21800' },
  { nom: 'Longvic', codePostal: '21600' },
  { nom: 'Fontaine-lès-Dijon', codePostal: '21121' },
  { nom: 'Saint-Apollinaire', codePostal: '21850' },
  { nom: 'Chevigny-Saint-Sauveur', codePostal: '21800' },
]

/** « Dijon, Chenôve, … , Saint-Apollinaire, Chevigny-Saint-Sauveur » */
export const LISTE_COMMUNES = COMMUNES.map((x) => x.nom).join(', ')
