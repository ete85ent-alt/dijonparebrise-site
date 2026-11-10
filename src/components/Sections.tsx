import type { ReactNode } from "react";
import { vers, DEMO } from "../vers";
import {
  Container,
  Etiquette,
  Fleche,
  Photo,
  TitreSection,
  btnBlanc,
  btnContour,
  btnLigne,
  type NomPhoto,
} from "./ui";
import { Devis, Rappel } from "./Formulaires";
import { adresseComplete, lienAppel, site } from "../config";
import { FAQ, LISTE_COMMUNES, PRESTATIONS } from "../contenu";
import { Texte, montrer } from "../aCompleter";

/** Grande photo d'ouverture plein écran, titre en bas à gauche, offre « 200 € offerts » à droite. */
export function Ouverture({
  etiquette,
  titre,
  texte,
}: {
  etiquette: string;
  titre: ReactNode;
  texte: string;
}) {
  return (
    <section className="relative flex min-h-[calc(100svh-60px)] lg:min-h-[100svh] flex-col justify-end overflow-hidden bg-noir text-white lg:max-h-[1000px]">
      <Photo
        nom="ouverture"
        prioritaire
        assombrir
        className="absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0)_28%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.85)_100%)]"
      />
      <Container className="relative z-10 grid gap-10 pb-12 pt-[120px] md:pb-20 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="apparition flex flex-col">
          {/* Référencement : le titre principal contient le métier et la ville (« Artisan pare-brise · Dijon »). */}
          <h1>
            <span className="mb-5 block text-[12px] font-medium uppercase tracking-[0.22em] text-cassis-clair">
              {etiquette}
            </span>
            <span className="block max-w-[13ch] text-[42px] font-light leading-[1.02] md:text-[72px] xl:text-[92px]">
              {titre}
            </span>
          </h1>
          <p className="mb-9 mt-6 max-w-[46ch] text-[17px] font-light leading-relaxed text-white/80 md:text-[19px]">
            {texte}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#devis" className={btnBlanc}>
              Demander un devis <Fleche />
            </a>
            <a href="#rappel" className={btnContour}>
              Être rappelé
            </a>
          </div>
        </div>
        <p className="flex items-baseline gap-3 border-t border-white/20 pt-5 lg:flex-col lg:items-end lg:gap-1 lg:border-0 lg:pt-0 lg:text-right">
          <span className="whitespace-nowrap text-[28px] font-light md:text-[46px]">
            {site.offre.titre}
          </span>
          <span className="text-[12px] uppercase tracking-[0.18em] text-cassis-clair">
            sur tout remplacement*
          </span>
        </p>
      </Container>
    </section>
  );
}

/** Bande de chiffres sous l'ouverture (les chiffres à compléter n'apparaissent pas sur le vrai site). */
export function Chiffres() {
  const items: [string, string][] = [
    ["0 €", "d’avance si vous êtes assuré"],
    ["100 % mobile", "chez vous ou au travail"],
    ["Devis gratuit", "sans engagement, sur photo"],
    ["Assurance", "démarches gérées pour vous"],
    ...site.chiffres.filter(([v]) => montrer(v)),
  ];
  return (
    <section aria-label="En bref" className="border-b border-trait">
      <Container className={`grid grid-cols-2 lg:grid-cols-4`}>
        {items.map(([v, l]) => (
          <div
            key={l}
            className="border-b border-trait py-6 pr-4 odd:border-r odd:pr-4 even:pl-5 md:py-8 lg:border-b-0 lg:border-r lg:pl-7 lg:first:pl-0 lg:last:border-r-0 lg:even:pl-7"
          >
            <strong className="block text-[22px] font-light md:text-[30px]">
              <Texte t={v} />
            </strong>
            <span className="text-[14px] text-doux">
              <Texte t={l} />
            </span>
          </div>
        ))}
      </Container>
    </section>
  );
}

const PHOTO_PRESTATION: Record<string, NomPhoto> = {
  parebrise: "remplacement",
  impact: "impact",
  vitre: "vitre",
};

export function Prestations() {
  return (
    <section id="services" className="py-20 md:py-32">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <TitreSection
            etiquette="Prestations"
            titre="Tout le vitrage de votre véhicule."
          />
          <a href="#devis" className="border-b border-noir pb-1 text-[15px]">
            Demander un devis
          </a>
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {PRESTATIONS.map((p) => (
            <a
              key={p.id}
              href="#devis"
              className="tuile group w-[78vw] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <Photo
                nom={PHOTO_PRESTATION[p.id]}
                sizes="(min-width: 768px) 33vw, 80vw"
                className="aspect-[4/5] rounded-[4px]"
              />
              <h3 className="mb-2 mt-5 text-[22px] md:text-[24px]">
                {p.titre}
              </h3>
              <p className="mb-4 text-[16px] font-light leading-relaxed text-doux">
                <Texte t={p.texte} />
              </p>
              <span className="text-[15px] font-medium">
                Demander un devis <Fleche />
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Photo d'un côté, service à domicile de l'autre, sur fond noir. */
export function Service() {
  const choix: [string, string][] = [
    [
      "À domicile",
      `Devant chez vous, au moment qui vous convient. ${site.offre.titre} sur le remplacement*.`,
    ],
    [
      "Au travail",
      "Sur le parking de votre entreprise, pendant que vous travaillez.",
    ],
    [
      "Assurance",
      "Déclaration et prise en charge gérées pour vous, sans avance de frais si vous êtes assuré.",
    ],
  ];
  return (
    <section
      id="domicile"
      className="grid bg-noir text-white lg:min-h-[720px] lg:grid-cols-2"
    >
      <Photo
        nom="artisan"
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="h-[360px] md:h-[480px] lg:h-auto"
      />
      <div className="flex flex-col justify-center px-5 py-16 md:px-16 md:py-20 xl:px-24">
        <TitreSection
          clair
          etiquette="Service à domicile"
          titre="Nous venons à vous. Votre journée ne change pas."
        />
        <dl className="mt-10 border-t border-white/20">
          {choix.map(([t, d]) => (
            <div
              key={t}
              className="grid gap-1 border-b border-white/20 py-6 md:grid-cols-[140px_1fr] md:gap-6"
            >
              <dt className="text-[17px] font-medium">{t}</dt>
              <dd className="font-light leading-relaxed text-white/70">{d}</dd>
            </div>
          ))}
        </dl>
        <a href="#devis" className={`${btnBlanc} mt-10 self-start`}>
          Choisir mon créneau <Fleche />
        </a>
        <p className="mt-8 text-[13px] text-white/50">
          * {site.offre.titre} {site.offre.texte}
          {montrer(site.offre.conditions) && (
            <>
              {" "}
              : <Texte t={site.offre.conditions} />
            </>
          )}
          .
        </p>
      </div>
    </section>
  );
}

export function Assurance() {
  const points: [string, string][] = [
    [
      "Déclaration faite pour vous",
      "Nous déclarons le sinistre auprès de votre assureur.",
    ],
    [
      "Règlement en direct",
      "Votre assureur nous règle directement. Seule la franchise éventuelle prévue par votre contrat reste à votre charge.",
    ],
    [
      "Libre choix du réparateur",
      "Vous choisissez votre réparateur, agréé par votre assureur ou non.",
    ],
  ];
  return (
    <section id="assurance" className="py-20 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-24">
        <div>
          <p className="text-[120px] font-light leading-[0.85] tracking-[-0.05em] md:text-[200px]">
            0 €
          </p>
          <p className="mt-5 text-[13px] font-medium uppercase tracking-[0.22em] text-cassis">
            d’avance avec votre assurance
          </p>
        </div>
        <div>
          <TitreSection
            etiquette="Bris de glace"
            titre="Assuré ? Nous nous occupons de tout avec votre assureur."
          />
          <ol className="mt-10 border-t border-trait">
            {points.map(([t, d], i) => (
              <li
                key={t}
                className="grid grid-cols-[44px_1fr] border-b border-trait py-6"
              >
                <span className="pt-0.5 text-[14px] text-doux">0{i + 1}</span>
                <span>
                  <strong className="mb-1 block text-[18px] font-medium">
                    {t}
                  </strong>
                  <span className="font-light text-doux">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          <a href="#devis" className={`${btnLigne} mt-10`}>
            Vérifier ma prise en charge <Fleche />
          </a>
        </div>
      </Container>
    </section>
  );
}

/** Comment ça se passe + communes desservies. */
export function Deroulement() {
  const etapes: [string, string][] = [
    ["Une photo", "Vous envoyez le dégât et votre immatriculation."],
    [
      "Votre assurance",
      "Nous commandons le bon vitrage et contactons votre assureur.",
    ],
    [
      "Votre créneau",
      "Nous intervenons là où vous êtes, avec tout le matériel.",
    ],
  ];
  return (
    <section id="communes" className="border-t border-trait py-20 md:py-32">
      <Container className="grid gap-14 lg:grid-cols-2 lg:gap-24">
        <div>
          <TitreSection
            etiquette="Comment ça se passe"
            titre="Trois étapes, aucune démarche."
          />
          <ol className="mt-10 border-t border-trait">
            {etapes.map(([t, d], i) => (
              <li
                key={t}
                className="grid grid-cols-[44px_1fr] border-b border-trait py-6"
              >
                <span className="pt-0.5 text-[14px] text-doux">0{i + 1}</span>
                <span>
                  <strong className="mb-1 block text-[18px] font-medium">
                    {t}
                  </strong>
                  <span className="font-light text-doux">{d}</span>
                </span>
              </li>
            ))}
          </ol>
          {montrer(site.dureePose) && (
            <p className="mt-6 font-light text-doux">
              Comptez <Texte t={site.dureePose} /> de pose, puis{" "}
              <Texte t={site.delaiAvantRoute} /> avant de reprendre la route.
            </p>
          )}
        </div>
        <div>
          <Etiquette>Zone d’intervention</Etiquette>
          <p className="mt-4 text-[22px] font-light md:text-[28px]">
            {site.zone.texte}
            {montrer(site.zone.rayon) && (
              <>
                {" "}
                · <Texte t={site.zone.rayon} />
              </>
            )}
          </p>
          <p className="mt-8 border-t border-trait pt-8 text-[18px] font-light leading-relaxed">
            Nous intervenons à {LISTE_COMMUNES} et alentours.
          </p>
          <p className="mt-4 font-light text-doux">
            Basés au {adresseComplete}, nous nous déplaçons chez vous ou au
            travail. Votre commune n’est pas citée ? Demandez-nous.
          </p>
        </div>
      </Container>
    </section>
  );
}

export function BlocDevis() {
  return (
    <section id="devis" className="bg-gris py-20 md:py-32">
      <Container className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-24">
        <div>
          <TitreSection etiquette="Devis express" titre="Une photo suffit." />
          <p className="mt-6 max-w-[40ch] text-[18px] font-light leading-relaxed text-doux">
            Trois questions, une photo du pare-brise, et nous revenons vers vous
            avec un devis gratuit et sans engagement
            {montrer(site.delaiReponse) && (
              <>
                {" "}
                sous <Texte t={site.delaiReponse} />
              </>
            )}
            .
          </p>
        </div>
        <Devis />
      </Container>
    </section>
  );
}

export function Questions() {
  const faq = FAQ.filter(([, , incomplete]) => DEMO || !incomplete);
  return (
    <section id="questions" className="py-20 md:py-32">
      <Container className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-24">
        <TitreSection
          etiquette="Questions fréquentes"
          titre="Vos questions, nos réponses."
        />
        <div className="border-t border-trait">
          {faq.map(([q, r]) => (
            <details key={q} className="border-b border-trait">
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-[18px]">
                {q}
                <span
                  aria-hidden="true"
                  className="plus text-[24px] font-light leading-none transition-transform"
                >
                  +
                </span>
              </summary>
              <p className="pb-6 pr-10 font-light leading-relaxed text-doux">
                <Texte t={r} />
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function BlocRappel() {
  return (
    <section id="rappel" className="border-t border-trait py-20 md:py-32">
      <Container className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-24">
        <div>
          <TitreSection
            etiquette="Être rappelé"
            titre="Une question ? Nous vous rappelons."
          />
          {montrer(site.telephone) && (
            <p className="mt-6 text-[18px] font-light text-doux">
              Ou appelez directement le{" "}
              <a
                href={site.telephoneLien ? lienAppel() : "#rappel"}
                className="text-noir"
              >
                <Texte t={site.telephone} />
              </a>
              .
            </p>
          )}
        </div>
        <Rappel />
      </Container>
    </section>
  );
}

/** Grande photo de fin avec un dernier appel à l'action. */
export function Fin() {
  return (
    <section className="relative flex min-h-[520px] items-center overflow-hidden bg-noir text-white md:min-h-[640px]">
      <Photo nom="nuit" assombrir className="absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.75),rgba(0,0,0,0.2))]"
      />
      <Container className="relative z-10 py-20">
        <Etiquette clair>{site.zone.texte}</Etiquette>
        <h2 className="mb-10 mt-5 max-w-[14ch] text-[40px] font-light leading-[1.03] md:text-[68px]">
          Reprenez la route, l’esprit tranquille.
        </h2>
        <a href="#devis" className={btnBlanc}>
          Demander un devis <Fleche />
        </a>
      </Container>
    </section>
  );
}

/** Tout ce qui suit l'ouverture, commun à l'accueil et aux pages par commune. */
export function SuiteDePage({ apres }: { apres?: ReactNode }) {
  return (
    <>
      <Chiffres />
      <Prestations />
      <Service />
      <Assurance />
      <BlocDevis />
      <Deroulement />
      <Questions />
      <BlocRappel />
      {apres}
      <Fin />
    </>
  );
}
