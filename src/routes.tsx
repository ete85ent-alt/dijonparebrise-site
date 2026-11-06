import { Route, Routes } from "react-router-dom";
import Accueil from "./pages/Accueil";
import PageCommune from "./pages/Commune";
import { MentionsLegales, Confidentialite, Introuvable } from "./pages/Legal";
import { COMMUNES, cheminCommune } from "./contenu";

export function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      {COMMUNES.map((c) => (
        <Route
          key={c.slug}
          path={cheminCommune(c)}
          element={<PageCommune commune={c} />}
        />
      ))}
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/confidentialite" element={<Confidentialite />} />
      <Route path="*" element={<Introuvable />} />
    </Routes>
  );
}

const MARQUE = " | Dijon Pare-Brise";
/** Titre Google d'une commune : la version longue si elle tient en 60 caractères. */
const titreCommune = (nom: string) =>
  [`Pare-brise ${nom} à domicile${MARQUE}`, `Pare-brise ${nom}${MARQUE}`].find(
    (t) => t.length <= 60,
  )!;

/** Pages écrites en HTML complet à la construction (référencement), avec leur titre et leur description Google. */
export const PAGES_PRERENDUES: {
  chemin: string;
  fichier: string;
  priorite: string;
  titre: string;
  description: string;
  introuvable?: boolean;
}[] = [
  {
    chemin: "/",
    fichier: "index.html",
    priorite: "1.0",
    titre: `Pare-brise à domicile à Dijon${MARQUE}`,
    description:
      "Remplacement et réparation de pare-brise chez vous ou au travail, à Dijon et dans sa métropole. 200 € offerts, 0 € d’avance avec l’assurance. Devis gratuit.",
  },
  ...COMMUNES.map((c) => ({
    chemin: cheminCommune(c),
    fichier: `${cheminCommune(c).slice(1)}.html`,
    priorite: "0.8",
    titre: titreCommune(c.nom),
    description: `Pare-brise à ${c.nom} (${c.codePostal}) : remplacement et réparation chez vous ou au travail. 200 € offerts, démarches assurance gérées.`,
  })),
  {
    chemin: "/mentions-legales",
    fichier: "mentions-legales.html",
    priorite: "0.2",
    titre: `Mentions légales${MARQUE}`,
    description:
      "Mentions légales du site de Dijon Pare-Brise, artisan qui remplace et répare les pare-brise à domicile autour de Dijon (Côte-d’Or).",
  },
  {
    chemin: "/confidentialite",
    fichier: "confidentialite.html",
    priorite: "0.2",
    titre: `Confidentialité${MARQUE}`,
    description:
      "Comment Dijon Pare-Brise utilise les informations envoyées par les formulaires de devis et de rappel, et comment exercer vos droits.",
  },
  {
    chemin: "/page-introuvable",
    fichier: "404.html",
    priorite: "0",
    titre: `Page introuvable${MARQUE}`,
    description: "Cette page n’existe pas.",
    introuvable: true,
  },
];
