import { useEffect, useState } from "react";
import { vers } from "../vers";
import { Logo } from "./Logo";
import StatutOuverture from "./Statut";
import { Container, Etiquette, Ico } from "./ui";
import { adresseComplete, lienAppel, site } from "../config";
import { LISTE_COMMUNES } from "../contenu";
import { montrer } from "../aCompleter";
import { useAncre } from "../ancre";

/**
 * En-tête : « Menu » à gauche, logo au centre, téléphone et devis à droite.
 * surPhoto : posé en transparence sur la grande photo d'ouverture (texte blanc) ; sinon fond blanc.
 */
export default function Header({ surPhoto = true }: { surPhoto?: boolean }) {
  const ancre = useAncre();
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const echap = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", echap);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", echap);
      document.body.style.overflow = "";
    };
  }, [menu]);

  const liens: [string, string][] = [
    ["Prestations", ancre("services")],
    ["À domicile ou au travail", ancre("domicile")],
    ["Assurance bris de glace", ancre("assurance")],
    ["Devis gratuit", ancre("devis")],
    ["Questions fréquentes", ancre("questions")],
    ["Être rappelé", ancre("rappel")],
  ];
  const couleur = surPhoto ? "text-white" : "text-noir";
  return (
    <>
      <header
        className={`${surPhoto ? "absolute inset-x-0 top-0 z-40" : "border-b border-trait bg-white"} ${couleur}`}
      >
        <Container className="grid h-[84px] grid-cols-[1fr_auto_1fr] items-center md:h-[96px]">
          <button
            type="button"
            onClick={() => setMenu(true)}
            aria-expanded={menu}
            aria-controls="menu"
            aria-label="Ouvrir le menu"
            className="flex h-11 items-center gap-3 justify-self-start text-[15px]"
          >
            <span
              aria-hidden="true"
              className="block h-[9px] w-[22px] border-y-[1.5px] border-current"
            />
            <span className="hidden md:inline">Menu</span>
          </button>
          <a href={vers("/")} aria-label="Dijon Pare-Brise, accueil">
            <Logo clair={surPhoto} />
          </a>
          <div className="flex items-center gap-7 justify-self-end text-[15px]">
            {montrer(site.telephone) && (
              <a
                href={site.telephoneLien ? lienAppel() : ancre("rappel")}
                className="hidden lg:inline"
              >
                {site.telephone}
              </a>
            )}
            <a
              href={ancre("devis")}
              className="hidden border-b border-current/60 pb-1 sm:inline"
            >
              Devis gratuit
            </a>
          </div>
        </Container>
      </header>

      {menu && (
        <div
          id="menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] overflow-y-auto bg-white text-noir"
        >
          <Container className="flex h-[84px] items-center justify-between md:h-[96px]">
            <Logo />
            <button
              type="button"
              onClick={() => setMenu(false)}
              aria-label="Fermer le menu"
              className="flex h-11 items-center gap-2 text-[15px]"
            >
              <span className="hidden md:inline">Fermer</span>
              <Ico nom="fermer" />
            </button>
          </Container>
          <Container className="grid gap-12 pb-16 pt-6 md:grid-cols-[3fr_2fr] md:pt-12">
            <nav aria-label="Menu">
              <ul className="border-t border-trait">
                {liens.map(([nom, href]) => (
                  <li key={nom} className="border-b border-trait">
                    <a
                      href={href}
                      onClick={() => setMenu(false)}
                      className="flex items-center justify-between py-5 text-[26px] font-light md:text-[34px]"
                    >
                      {nom}
                      <span aria-hidden="true" className="text-doux">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <Etiquette>Zone d’intervention</Etiquette>
                <p className="text-[17px] font-light leading-relaxed text-doux">
                  {LISTE_COMMUNES} et alentours.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Etiquette>Contact</Etiquette>
                {montrer(site.telephone) && (
                  <a
                    href={site.telephoneLien ? lienAppel() : ancre("rappel")}
                    onClick={() => setMenu(false)}
                    className="text-[20px]"
                  >
                    {site.telephone}
                  </a>
                )}
                <span className="text-[15px] text-doux">{adresseComplete}</span>
                <StatutOuverture />
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
