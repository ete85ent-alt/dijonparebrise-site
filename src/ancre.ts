import { useLocation } from "react-router-dom";
import { vers } from "./vers";

/** Pages qui contiennent le devis et le rappel : l'accueil et les pages par commune. */
export const pageAvecDevis = (chemin: string) =>
  chemin === "/" || chemin.startsWith("/pare-brise-");

/** Lien vers une section (#devis, #rappel…) : sur la page même si elle la contient, sinon sur l'accueil. */
export function useAncre() {
  const { pathname } = useLocation();
  return (id: string) => (pageAvecDevis(pathname) ? `#${id}` : vers(`/#${id}`));
}
