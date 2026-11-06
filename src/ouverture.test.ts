import { describe, expect, it } from "vitest";
import { maintenantAParis, statutOuverture } from "./ouverture";

// Horaires d'essai : du lundi au samedi, 8 h – 18 h
const h = { jours: [1, 2, 3, 4, 5, 6], ouverture: 8 * 60, fermeture: 18 * 60 };

describe("ouvert maintenant ?", () => {
  it("mardi 10 h : ouvert", () =>
    expect(statutOuverture(2, 10 * 60, h)).toEqual({
      ouvert: true,
      texte: "Ouvert maintenant · jusqu’à 18 h",
    }));
  it("samedi 17 h 30 : ferme bientôt", () =>
    expect(statutOuverture(6, 17 * 60 + 30, h).texte).toBe(
      "Ouvert · ferme bientôt (18 h)",
    ));
  it("mercredi 7 h : ouvre aujourd’hui", () =>
    expect(statutOuverture(3, 7 * 60, h).texte).toBe(
      "Fermé · ouvre aujourd’hui à 8 h",
    ));
  it("vendredi 18 h : ouvre demain", () =>
    expect(statutOuverture(5, 18 * 60, h).texte).toBe(
      "Fermé · ouvre demain à 8 h",
    ));
  it("samedi soir : ouvre lundi", () =>
    expect(statutOuverture(6, 20 * 60, h).texte).toBe(
      "Fermé · ouvre lundi à 8 h",
    ));
  it("dimanche : ouvre demain", () =>
    expect(statutOuverture(0, 12 * 60, h).texte).toBe(
      "Fermé · ouvre demain à 8 h",
    ));
  it("demi-heures affichées", () =>
    expect(
      statutOuverture(1, 7 * 60, { ...h, ouverture: 8 * 60 + 30 }).texte,
    ).toBe("Fermé · ouvre aujourd’hui à 8 h30"));
  it("heure de Paris, même depuis un autre fuseau", () => {
    // mardi 29/09/2026 07:30 UTC = 09:30 à Paris (heure d'été)
    expect(maintenantAParis(new Date("2026-09-29T07:30:00Z"))).toEqual({
      jour: 2,
      minutes: 9 * 60 + 30,
    });
  });
});
