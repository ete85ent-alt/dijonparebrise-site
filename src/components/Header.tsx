import { useState } from "react";
import { vers } from "../vers";
import { Logo } from "./Logo";
import StatutOuverture from "./Statut";
import { Container, Ico, btnAmbre } from "./ui";
import { lienAppel, site } from "../config";
import { montrer } from "../aCompleter";
import { useAncre } from "../ancre";

export default function Header() {
  const ancre = useAncre();
  const [menu, setMenu] = useState(false);
  const liens: [string, string][] = [
    ["Remplacement", ancre("services")],
    ["Réparation d’impact", ancre("services")],
    ["À domicile", ancre("domicile")],
    ["Assurances", ancre("assurance")],
    ["Communes", ancre("communes")],
  ];
  return (
    <>
      <div className="bg-nuit text-white">
        <Container className="flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-[13px] md:text-[14px]">
          <span className="text-white/85">
            On se déplace <strong className="text-white">chez vous</strong> ou{" "}
            <strong className="text-white">au travail</strong> ·{" "}
            {site.zone.texte}
          </span>
          <StatutOuverture />
        </Container>
      </div>
      <header className="sticky top-0 z-50 border-b border-ligne bg-white/95 backdrop-blur">
        <Container className="flex h-16 items-center gap-4 md:h-[76px]">
          <a
            href={vers("/")}
            className="shrink-0 no-underline"
            aria-label="Dijon Pare-Brise, accueil"
          >
            <Logo />
          </a>
          <nav
            aria-label="Menu principal"
            className="ml-6 hidden items-center gap-1 lg:flex"
          >
            {liens.map(([nom, href]) => (
              <a
                key={nom}
                href={href}
                className="rounded-lg px-3 py-2 text-[15px] font-semibold text-nuit no-underline hover:bg-fond"
              >
                {nom}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {montrer(site.telephone) && (
              <a
                href={site.telephoneLien ? lienAppel() : ancre("rappel")}
                className="hidden items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-[15px] font-bold text-nuit no-underline hover:bg-fond md:flex"
              >
                <Ico nom="telephone" taille={20} className="text-bleu" />
                {site.telephone}
              </a>
            )}
            <a
              href={ancre("devis")}
              className={`${btnAmbre} !min-h-11 !px-4 !py-2 max-sm:!hidden`}
            >
              Devis gratuit
            </a>
            <button
              type="button"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-controls="menu-mobile"
              aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-nuit hover:bg-fond lg:hidden"
            >
              <Ico nom={menu ? "fermer" : "menu"} />
            </button>
          </div>
        </Container>
        {menu && (
          <nav
            id="menu-mobile"
            aria-label="Menu"
            className="border-t border-ligne bg-white lg:hidden"
          >
            <Container className="flex flex-col py-2">
              {liens.map(([nom, href]) => (
                <a
                  key={nom}
                  href={href}
                  onClick={() => setMenu(false)}
                  className="border-b border-ligne py-3.5 text-[17px] font-semibold text-nuit no-underline last:border-0"
                >
                  {nom}
                </a>
              ))}
            </Container>
          </nav>
        )}
      </header>
    </>
  );
}
