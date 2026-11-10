import { describe, expect, it } from "vitest";
import { donneesGoogle } from "./seo";
import { FAQ } from "./contenu";

describe("données structurées pour Google", () => {
  const d = donneesGoogle();
  const texte = JSON.stringify(d);
  const [entreprise, faq] = d["@graph"] as unknown as [
    Record<string, unknown>,
    { mainEntity: unknown[] },
  ];

  it("aucune information à compléter n’est envoyée à Google", () =>
    // on regarde chaque texte (les crochets des listes JSON ne comptent pas)
    JSON.parse(texte, (_cle, valeur) => {
      if (typeof valeur === "string") expect(valeur).not.toContain("[");
      return valeur;
    }));
  it("entreprise locale avec adresse, coordonnées GPS et zone desservie", () => {
    expect(entreprise["@type"]).toBe("AutoRepair");
    expect(texte).toContain("6-8 rue de Bastogne");
    expect(entreprise.geo).toBeTruthy();
    expect((entreprise.areaServed as unknown[]).length).toBe(8);
  });
  it("FAQ : toutes les questions complètes, et seulement elles", () => {
    expect(faq.mainEntity.length).toBe(
      FAQ.filter(([, , incomplete]) => !incomplete).length,
    );
  });
});
