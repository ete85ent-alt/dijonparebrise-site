import { useLocation } from "react-router-dom";
import { vers } from "./vers";

/** Page qui contient le devis et le rappel : l'accueil. */
export const pageAvecDevis = (chemin: string) =>
  chemin === "/";

/** Lien vers une section (#devis, #rappel…) : sur la page même si elle la contient, sinon sur l'accueil. */
export function useAncre() {
  const { pathname } = useLocation();
  return (id: string) => (pageAvecDevis(pathname) ? `#${id}` : vers(`/#${id}`));
}
