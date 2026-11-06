import { vers } from "../vers";
import { Logo } from "./Logo";
import { Container, Ico } from "./ui";
import { lienAppel, site } from "../config";
import { COMMUNES, cheminCommune } from "../contenu";
import { montrer } from "../aCompleter";
import { useAncre } from "../ancre";

/** Téléphone : barre fixée en bas de l'écran, sous le pouce. Appeler · Être rappelé · Devis photo. */
function BarreMobile() {
  const ancre = useAncre();
  const lien =
    "flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-[13px] font-bold no-underline";
  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-white/10 bg-nuit pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.25)] lg:hidden"
    >
      <a
        href={site.telephoneLien ? lienAppel() : ancre("rappel")}
        className={`${lien} bg-ambre text-nuit`}
      >
        <Ico nom="telephone" taille={22} />
        Appeler
      </a>
      <a href={ancre("rappel")} className={`${lien} text-white`}>
        <Ico nom="rappel" taille={22} />
        Être rappelé
      </a>
      <a href={ancre("devis")} className={`${lien} text-white`}>
        <Ico nom="photo" taille={22} />
        Devis photo
      </a>
    </nav>
  );
}

export default function Footer() {
  const t = "py-1.5 text-[15px] text-white/70 no-underline hover:text-white";
  return (
    <footer className="bg-nuit text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo clair grand />
          <p className="text-[14px] leading-relaxed text-white/65">
            Remplacement et réparation de pare-brise, chez vous ou au travail, à
            Dijon et dans sa métropole. Artisan 100 % mobile.
          </p>
        </div>
        <div className="flex flex-col">
          <p className="mb-2 font-titre text-[17px] font-extrabold">
            Zone d’intervention
          </p>
          {COMMUNES.map((c) => (
            <a key={c.slug} href={vers(cheminCommune(c))} className={t}>
              Pare-brise {c.nom}
            </a>
          ))}
        </div>
        <div className="flex flex-col">
          <p className="mb-2 font-titre text-[17px] font-extrabold">Contact</p>
          {montrer(site.telephone) && (
            <a
              href={site.telephoneLien ? lienAppel() : vers("/#rappel")}
              className={t}
            >
              {site.telephone}
            </a>
          )}
          {montrer(site.email) && (
            <span className="py-1.5 text-[15px] text-white/70">
              {site.email}
            </span>
          )}
          {montrer(site.horaires.texte) && (
            <span className="py-1.5 text-[15px] text-white/70">
              {site.horaires.texte}
            </span>
          )}
          <a href={vers("/#rappel")} className={t}>
            Être rappelé
          </a>
          <a href={vers("/#devis")} className={t}>
            Devis gratuit sur photo
          </a>
        </div>
        <div className="flex flex-col">
          <p className="mb-2 font-titre text-[17px] font-extrabold">
            Informations
          </p>
          <a href={vers("/mentions-legales")} className={t}>
            Mentions légales
          </a>
          <a href={vers("/confidentialite")} className={t}>
            Confidentialité
          </a>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-[13px] text-white/55 md:flex-row md:items-center md:justify-between">
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
              className="inline-flex min-h-11 items-center opacity-85 transition-opacity hover:opacity-100"
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
