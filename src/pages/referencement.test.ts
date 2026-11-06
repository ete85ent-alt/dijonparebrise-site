import { describe, expect, it } from "vitest";
import { PAGES_PRERENDUES } from "../routes";
import { sansCrochets } from "../aCompleter";

/* Google coupe les titres au-delà d'environ 60 caractères et les descriptions au-delà d'environ 155. */
describe("titres et descriptions pour Google", () => {
  for (const p of PAGES_PRERENDUES.filter((x) => !x.introuvable)) {
    it(`${p.chemin} : titre ≤ 60 caractères, description entre 70 et 160`, () => {
      expect(p.titre.length).toBeLessThanOrEqual(60);
      expect(p.description.length).toBeGreaterThanOrEqual(70);
      expect(p.description.length).toBeLessThanOrEqual(160);
      expect(p.titre).toMatch(/Dijon Pare-Brise/);
      expect(p.titre + p.description).not.toMatch(/\[/);
    });
  }

  it("aucun titre en double", () => {
    const titres = PAGES_PRERENDUES.map((p) => p.titre);
    expect(new Set(titres).size).toBe(titres.length);
  });
});

describe("textes à compléter", () => {
  it("les précisions entre crochets sont retirées proprement", () => {
    expect(sansCrochets("Pose garantie [vitrage de qualité origine ?].")).toBe(
      "Pose garantie.",
    );
    expect(sansCrochets("Garantie [12 mois]")).toBe("Garantie");
    expect(sansCrochets("Libre choix. [Formulation à faire valider.]")).toBe(
      "Libre choix.",
    );
  });
});
