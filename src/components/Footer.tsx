import { vers } from "../vers";
import { Logo } from "./Logo";
import { Container, Ico } from "./ui";
import { lienAppel, site } from "../config";
import { COMMUNES, cheminCommune } from "../contenu";
import { montrer, Texte } from "../aCompleter";
import { useAncre } from "../ancre";

/** Téléphone : barre fixée en bas de l'écran, sous le pouce. Appeler · Être rappelé · Devis. */
function BarreMobile() {
  const ancre = useAncre();
  const lien =
    "flex min-h-[60px] flex-1 items-center justify-center gap-2 text-[14px] font-medium";
  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-trait bg-white text-noir pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <a
        href={site.telephoneLien ? lienAppel() : ancre("rappel")}
        className={`${lien} bg-noir text-white`}
      >
        <Ico nom="telephone" taille={18} />
        Appeler
      </a>
      <a href={ancre("rappel")} className={lien}>
        Être rappelé
      </a>
      <a href={ancre("devis")} className={`${lien} border-l border-trait`}>
        Devis
      </a>
    </nav>
  );
}

export default function Footer() {
  const titre =
    "mb-4 text-[12px] font-medium uppercase tracking-[0.22em] text-white";
  const lien =
    "inline-flex min-h-9 items-center text-[15px] text-white/60 hover:text-white";
  return (
    <footer className="bg-noir text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr_1fr] lg:py-20">
        <div className="flex flex-col gap-6">
          <Logo clair grand />
          <p className="max-w-[34ch] text-[15px] font-light leading-relaxed text-white/60">
            Remplacement et réparation de pare-brise, chez vous ou au travail, à
            Dijon et dans sa métropole.
          </p>
        </div>
        <div>
          <p className={titre}>Zone d’intervention</p>
          <ul className="grid grid-cols-2 gap-x-4 lg:grid-cols-1 xl:grid-cols-2">
            {COMMUNES.map((c) => (
              <li key={c.slug}>
                <a href={vers(cheminCommune(c))} className={lien}>
                  {c.nom}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <p className={titre}>Contact</p>
          {montrer(site.telephone) && (
            <a
              href={site.telephoneLien ? lienAppel() : vers("/#rappel")}
              className={lien}
            >
              <Texte t={site.telephone} />
            </a>
          )}
          {montrer(site.email) && (
            <span className="py-2 text-[15px] text-white/60">
              <Texte t={site.email} />
            </span>
          )}
          {montrer(site.horaires.texte) && (
            <span className="py-2 text-[15px] text-white/60">
              <Texte t={site.horaires.texte} />
            </span>
          )}
          <a href={vers("/#rappel")} className={lien}>
            Être rappelé
          </a>
          <a href={vers("/#devis")} className={lien}>
            Devis gratuit
          </a>
        </div>
        <div className="flex flex-col">
          <p className={titre}>Informations</p>
          <a href={vers("/mentions-legales")} className={lien}>
            Mentions légales
          </a>
          <a href={vers("/confidentialite")} className={lien}>
            Confidentialité
          </a>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-[13px] text-white/45 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} DIJON PARE-BRISE · SASU au capital de{" "}
            {site.mentions.capital} · SIREN {site.mentions.siren}
          </span>
          <span className="flex items-center gap-3">
            Conception, design et réalisation
            <a
              href="https://ete-85.fr"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center opacity-80 transition-opacity hover:opacity-100"
            >
              <img
                src={vers("/credits/ete85.svg")}
                alt="ÉTÉ 85 – Digital, Data & IA"
                width={98}
                height={36}
                loading="lazy"
                className="h-9 w-auto"
              />
            </a>
          </span>
        </Container>
      </div>
      <BarreMobile />
    </footer>
  );
}
