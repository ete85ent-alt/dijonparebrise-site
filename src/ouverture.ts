/*
 * « Ouvert maintenant » : calculé à l'heure de Paris, d'après les horaires de src/config.ts.
 */
import { site } from "./config";

const JOURS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

export type Horaires = {
  jours: number[];
  ouverture: number;
  fermeture: number;
};
export type Statut = { ouvert: boolean; texte: string };

const heure = (m: number) =>
  `${Math.floor(m / 60)} h${m % 60 ? String(m % 60).padStart(2, "0") : ""}`;

/** jour : 0 = dimanche … 6 = samedi ; minutes depuis minuit. */
export function statutOuverture(
  jour: number,
  minutes: number,
  h: Horaires = site.horaires,
): Statut {
  const ouvrable = (j: number) => h.jours.includes(j);
  if (ouvrable(jour) && minutes >= h.ouverture && minutes < h.fermeture) {
    return {
      ouvert: true,
      texte:
        h.fermeture - minutes <= 60
          ? `Ouvert · ferme bientôt (${heure(h.fermeture)})`
          : `Ouvert maintenant · jusqu’à ${heure(h.fermeture)}`,
    };
  }
  if (ouvrable(jour) && minutes < h.ouverture)
    return {
      ouvert: false,
      texte: `Fermé · ouvre aujourd’hui à ${heure(h.ouverture)}`,
    };
  for (let d = 1; d <= 7; d++) {
    const j = (jour + d) % 7;
    if (ouvrable(j))
      return {
        ouvert: false,
        texte: `Fermé · ouvre ${d === 1 ? "demain" : JOURS[j]} à ${heure(h.ouverture)}`,
      };
  }
  return { ouvert: false, texte: "Fermé" };
}

/** Jour et minutes à Paris, quel que soit le fuseau du téléphone du visiteur. */
export function maintenantAParis(date = new Date()): {
  jour: number;
  minutes: number;
} {
  const parties = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const val = (t: string) => parties.find((p) => p.type === t)?.value ?? "";
  const jour = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    val("weekday"),
  );
  return { jour, minutes: Number(val("hour")) * 60 + Number(val("minute")) };
}
