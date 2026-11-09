import { Route, Routes } from "react-router-dom";
import Accueil from "./pages/Accueil";
import { MentionsLegales, Confidentialite, Introuvable } from "./pages/Legal";

export function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/mentions-legales" element={<MentionsLegales />} />
      <Route path="/confidentialite" element={<Confidentialite />} />
      <Route path="*" element={<Introuvable />} />
    </Routes>
  );
}

const MARQUE = " | Dijon Pare-Brise";

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
