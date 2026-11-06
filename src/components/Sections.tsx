import type { ReactNode } from "react";
import { vers, DEMO } from "../vers";
import {
  Container,
  Ico,
  PhotoAVenir,
  TitreSection,
  btnAmbre,
  btnClair,
  btnNuit,
  type NomIco,
} from "./ui";
import { Devis, Rappel } from "./Formulaires";
import { lienAppel, site } from "../config";
import {
  COMMUNES,
  ENGAGEMENTS,
  FAQ,
  PRESTATIONS,
  cheminCommune,
} from "../contenu";
import { Texte, montrer } from "../aCompleter";

const Etoile = () => <sup className="text-ambre">*</sup>;

/** Accroche + devis express (accueil et pages par commune). */
export function Accroche({
  titre,
  sousTitre,
}: {
  titre: ReactNode;
  sousTitre?: ReactNode;
}) {
  const badges = [
    "0 € d’avance avec la garantie bris de glace",
    "Démarches assurance gérées",
    ...(montrer(site.delaiRendezVous)
      ? [`Rendez-vous sous ${site.delaiRendezVous}`]
      : []),
  ];
  return (
    <section className="relative overflow-hidden bg-nuit text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-bleu/30 blur-3xl"
      />
      <Container className="relative grid gap-10 py-10 md:py-16 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="flex flex-col gap-5 lg:col-span-6 lg:pt-6">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ciel">
            Pare-brise · vitres · lunette arrière
          </p>
          <h1 className="text-[36px] font-extrabold leading-[1.04] md:text-[56px]">
            {titre}
          </h1>
          <p className="text-[17px] leading-relaxed text-[#C9D6E2] md:text-[19px]">
            {sousTitre ??
              "Un artisan qui se déplace, s’occupe des démarches avec votre assurance et vous rend un véhicule prêt à rouler."}
          </p>
          <ul className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <li
                key={b}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[14px] font-semibold"
              >
                <Ico nom="coche" taille={16} className="text-[#34D399]" />
                <Texte t={b} />
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-3 rounded-2xl border border-ambre/40 bg-ambre/10 px-4 py-3 text-[17px]">
            <Ico nom="cadeau" taille={28} className="shrink-0 text-ambre" />
            <span>
              <strong className="font-titre text-[22px] font-extrabold text-ambre">
                {site.offre.titre}
              </strong>
              <Etoile /> {site.offre.texte}
            </span>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            {montrer(site.telephone) && (
              <a
                href={site.telephoneLien ? lienAppel() : "#rappel"}
                className={btnAmbre}
              >
                <Ico nom="telephone" taille={20} />
                Appeler <Texte t={site.telephone} />
              </a>
            )}
            <a href="#rappel" className={btnClair}>
              <Ico nom="rappel" taille={20} />
              Être rappelé
            </a>
          </div>
        </div>
        <div className="lg:col-span-6">
          <Devis />
        </div>
      </Container>
    </section>
  );
}

export function Engagements() {
  const icones: NomIco[] = ["maison", "bouclier", "cadeau", "coche"];
  return (
    <section
      aria-label="Nos engagements"
      className="border-b border-ligne bg-white"
    >
      <Container className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {ENGAGEMENTS.map(([t, d], i) => (
          <div key={t} className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-glace text-bleu">
              <Ico nom={icones[i]} />
            </span>
            <div>
              <strong className="block text-[17px]">
                <Texte t={t} />
              </strong>
              <span className="text-[15px] text-gris">
                <Texte t={d} />
              </span>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

/** Chiffres et avis Google : n'apparaissent sur le vrai site qu'une fois remplis. */
export function Chiffres() {
  const chiffres = site.chiffres.filter(([v]) => montrer(v));
  if (!chiffres.length) return null;
  return (
    <section aria-label="Chiffres et avis" className="bg-fond">
      <Container className="grid grid-cols-2 gap-6 py-10 text-center lg:grid-cols-4">
        {chiffres.map(([v, l]) => (
          <div key={l}>
            <strong className="block font-titre text-[34px] font-extrabold text-nuit">
              <Texte t={v} />
            </strong>
            <span className="text-[15px] text-gris">
              <Texte t={l} />
            </span>
          </div>
        ))}
      </Container>
    </section>
  );
}

export function Formules() {
  const carte = "flex flex-col gap-5 rounded-2xl p-6 md:p-8";
  const Liste = ({ items }: { items: string[] }) => (
    <ul className="flex flex-col gap-2.5 text-[16px]">
      {items.filter(montrer).map((x) => (
        <li key={x} className="flex items-start gap-2.5">
          <Ico nom="coche" taille={20} className="mt-0.5 shrink-0 text-ambre" />
          <Texte t={x} />
        </li>
      ))}
    </ul>
  );
  return (
    <section id="domicile" className="bg-white">
      <Container className="flex flex-col gap-10 py-16 md:py-24">
        <TitreSection
          label="Intervention mobile"
          titre="Chez vous ou au travail : on vient à vous"
        />
        <div className="grid gap-5 md:grid-cols-2">
          <div className={`${carte} bg-nuit text-white`}>
            <p className="flex items-center gap-2 text-[14px] font-bold tracking-[0.14em] text-ciel">
              <Ico nom="maison" taille={20} />À DOMICILE
            </p>
            <Liste
              items={[
                `${site.offre.titre} sur le remplacement`,
                "[Déplacement offert dans notre zone]",
                "0 € d’avance avec la garantie bris de glace",
                "Démarches avec l’assurance faites pour vous",
                "Franchise éventuelle selon votre contrat",
              ]}
            />
            <a href="#devis" className={`${btnAmbre} mt-auto self-start`}>
              Je choisis le domicile
            </a>
          </div>
          <div className={`${carte} border-2 border-ligne bg-fond`}>
            <p className="flex items-center gap-2 text-[14px] font-bold tracking-[0.14em] text-bleu">
              <Ico nom="travail" taille={20} />
              AU TRAVAIL
            </p>
            <Liste
              items={[
                "Pose sur le parking de votre entreprise",
                "Vous ne perdez pas une minute de travail",
                `${site.offre.titre} sur le remplacement`,
                "0 € d’avance avec la garantie bris de glace",
              ]}
            />
            <a href="#devis" className={`${btnNuit} mt-auto self-start`}>
              Je choisis le travail
            </a>
          </div>
        </div>
        <p className="text-[14px] text-gris">
          <Etoile /> {site.offre.titre} {site.offre.texte}
          {montrer(site.offre.conditions) && (
            <>
              {" "}
              : <Texte t={site.offre.conditions} />
            </>
          )}
          .
        </p>
      </Container>
    </section>
  );
}

export function Prestations() {
  return (
    <section id="services" className="bg-fond">
      <Container className="flex flex-col gap-10 py-16 md:py-24">
        <TitreSection
          label="Prestations"
          titre="Tout le vitrage de votre véhicule"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {PRESTATIONS.map((p) => (
            <a
              key={p.id}
              href="#devis"
              className="group flex flex-col overflow-hidden rounded-2xl border border-ligne bg-white text-nuit no-underline transition-shadow hover:shadow-[0_12px_30px_rgba(11,31,51,0.12)]"
            >
              {DEMO ? (
                <PhotoAVenir
                  texte={`[Photo : ${p.titre.toLowerCase()}]`}
                  className="aspect-[16/9]"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-glace text-bleu">
                  <Ico nom={p.id} taille={64} />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="text-[21px] font-extrabold">{p.titre}</h3>
                <p className="text-[15px] leading-relaxed text-gris">
                  <Texte t={p.texte} />
                </p>
                <span className="mt-auto pt-2 text-[15px] font-bold text-bleu">
                  Demander un devis{" "}
                  <Ico
                    nom="fleche"
                    taille={18}
                    className="inline transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Deroulement() {
  const etapes = [
    "Vous envoyez une photo et votre immatriculation",
    "On commande le bon vitrage et on contacte votre assurance",
    "Vous choisissez le créneau et le lieu de l’intervention",
  ];
  return (
    <section id="communes" className="bg-white">
      <Container className="grid gap-12 py-16 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <TitreSection
            label="Comment ça se passe"
            titre="On vient à vous, avec tout le matériel"
            texte={
              <>
                Chez vous, sur votre lieu de travail ou sur un parking : la pose
                se fait sur place
                {montrer(site.dureePose) && (
                  <>
                    . Comptez <Texte t={site.dureePose} /> de pose, puis{" "}
                    <Texte t={site.delaiAvantRoute} /> avant de reprendre la
                    route
                  </>
                )}
                .
              </>
            }
          />
          <ol className="flex flex-col gap-4">
            {etapes.map((e, i) => (
              <li
                key={e}
                className="flex items-center gap-4 text-[17px] font-semibold"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ambre font-titre text-[18px] font-extrabold text-nuit">
                  {i + 1}
                </span>
                {e}
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl bg-fond p-6 md:p-8">
          <p className="flex items-center gap-2 font-titre text-[22px] font-extrabold">
            <Ico nom="lieu" className="text-bleu" />
            Zone d’intervention
          </p>
          <p className="text-[16px] text-gris">
            {site.zone.texte}
            {montrer(site.zone.rayon) && (
              <>
                {" "}
                · <Texte t={site.zone.rayon} />
              </>
            )}
            . Votre commune n’est pas dans la liste ? Demandez-nous.
          </p>
          <ul className="flex flex-wrap gap-2">
            {COMMUNES.map((c) => (
              <li key={c.slug}>
                <a
                  href={vers(cheminCommune(c))}
                  className="inline-flex min-h-11 items-center rounded-full border border-ligne bg-white px-4 text-[15px] font-semibold text-nuit no-underline hover:border-bleu"
                >
                  {c.nom}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export function Assurance() {
  const points: [string, string][] = [
    [
      "0 € d’avance",
      "Assuré bris de glace ? Nous nous faisons régler directement par votre assureur.",
    ],
    [
      "Franchise selon votre contrat",
      "Seule la franchise éventuelle prévue par votre contrat reste à votre charge.",
    ],
    [
      "Libre choix du réparateur",
      "Vous choisissez votre réparateur, agréé par votre assureur ou non.",
    ],
  ];
  return (
    <section id="assurance" className="bg-bleu text-white">
      <Container className="flex flex-col gap-10 py-16 md:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <TitreSection
            clair
            label="Assurance bris de glace"
            titre={
              <>
                Assuré bris de glace&nbsp;?{" "}
                <span className="text-ambre">Vous n’avancez rien</span>
              </>
            }
            texte="Nous déclarons le sinistre et nous nous faisons régler directement par votre assureur. Il vous suffit de votre carte verte."
          />
          <a
            href="#devis"
            className={`${btnAmbre} shrink-0 self-start lg:self-auto`}
          >
            Vérifier ma prise en charge
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {points.map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-white/10 p-5">
              <strong className="mb-1 flex items-center gap-2 text-[18px]">
                <Ico nom="bouclier" taille={22} className="text-ambre" />
                {t}
              </strong>
              <span className="text-[15px] text-white/80">{d}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Questions() {
  const faq = FAQ.filter(([, , incomplete]) => DEMO || !incomplete);
  return (
    <section id="questions" className="bg-fond">
      <Container className="flex max-w-[880px] flex-col gap-8 py-16 md:py-24">
        <TitreSection
          label="Questions fréquentes"
          titre="Vos questions, nos réponses"
        />
        <div className="flex flex-col gap-3">
          {faq.map(([q, r], i) => (
            <details
              key={q}
              open={i === 0}
              className="rounded-2xl border border-ligne bg-white"
            >
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[17px] font-bold">
                {q}
                <Ico nom="chevron" className="shrink-0 text-bleu" />
              </summary>
              <p className="px-5 pb-5 text-[16px] leading-relaxed text-gris">
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
    <section id="rappel" className="bg-white">
      <Container className="grid gap-8 py-16 md:py-24 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <TitreSection
            label="Être rappelé"
            titre="Une question ? On vous rappelle"
            texte={
              montrer(site.telephone) ? (
                <>
                  Laissez votre numéro, ou appelez directement le{" "}
                  <Texte t={site.telephone} />.
                </>
              ) : (
                "Laissez votre numéro : nous vous rappelons au moment qui vous arrange."
              )
            }
          />
        </div>
        <div className="lg:col-span-7">
          <Rappel />
        </div>
      </Container>
    </section>
  );
}

/** Bloc commun aux pages : tout ce qui suit l'accroche. */
export function SuiteDePage({ avant }: { avant?: ReactNode }) {
  return (
    <>
      <Engagements />
      <Chiffres />
      {avant}
      <Formules />
      <Prestations />
      <Deroulement />
      <Assurance />
      <Questions />
      <BlocRappel />
    </>
  );
}
