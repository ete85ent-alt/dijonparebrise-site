import type { ReactNode } from "react";
import { vers } from "../vers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container } from "../components/ui";
import { site } from "../config";
import { Texte } from "../aCompleter";
import photos from "../photos.json";

function PageTexte({
  titre,
  children,
}: {
  titre: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header surPhoto={false} />
      <main>
        <Container className="flex max-w-[860px] flex-col gap-5 py-16 text-[16px] font-light leading-relaxed md:py-24 [&_h2]:mt-6 [&_h2]:text-[24px] [&_h2]:font-normal [&_strong]:font-medium">
          <h1 className="text-[40px] font-light leading-tight md:text-[60px]">
            {titre}
          </h1>
          {children}
        </Container>
      </main>
      <Footer />
    </>
  );
}

/* Pages légales : les informations encore inconnues restent entre crochets, y compris sur le vrai site (à remplir avant la mise en ligne). */
export function MentionsLegales() {
  const m = site.mentions;
  return (
    <PageTexte titre="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        {m.raisonSociale} au capital de {m.capital}
        <br />
        Siège social : {m.siege}
        <br />
        SIREN {m.siren} · <Texte t={m.rcs} />
        <br />
        Téléphone : {site.telephone} · E-mail : {site.email}
      </p>
      <p>Responsable de la publication : {m.responsable}.</p>
      <p>
        DIJON PARE-BRISE se déplace : les interventions ont lieu chez le client
        ou sur son lieu de travail.
      </p>
      <h2>Hébergement</h2>
      <p>{m.hebergeur}</p>
      <h2>Photos</h2>
      <p>
        Les photos du site sont des <strong>photos d’illustration</strong> :
        elles ne représentent pas des interventions de Dijon Pare-Brise ni les
        véhicules de ses clients. Elles proviennent d’Unsplash (licence
        Unsplash, usage commercial autorisé).
      </p>
      <ul className="list-disc pl-5 text-[15px] text-doux">
        {Object.entries(photos).map(([nom, c]) => (
          <li key={nom}>
            <a
              href={c.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Photo de {c.auteur}
            </a>{" "}
            sur Unsplash
          </li>
        ))}
      </ul>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes et le logo de ce site appartiennent à {m.raisonSociale}.
        Toute reproduction sans autorisation est interdite.
      </p>
      <h2>Crédits</h2>
      <p>
        Conception, design et réalisation : ÉTÉ 85 – Digital, Data &amp; IA
        (ete-85.fr). Police Hanken Grotesk (licence SIL Open Font License).
      </p>
    </PageTexte>
  );
}

export function Confidentialite() {
  return (
    <PageTexte titre="Confidentialité">
      <p>
        Ce site ne dépose aucun cookie publicitaire ni de mesure d’audience.
        Aucune donnée n’est vendue ni transmise à des tiers à des fins
        commerciales.
      </p>
      <h2>Formulaires de devis et de rappel</h2>
      <p>
        Les informations envoyées par les formulaires (nom, téléphone, e-mail,
        code postal, immatriculation, description du dégât, photos, moment de
        rappel souhaité) servent uniquement à répondre à votre demande. Elles
        sont transmises par e-mail à Dijon Pare-Brise et ne sont pas conservées
        sur le site.
      </p>
      <p>
        Si vous confiez l’intervention, les informations nécessaires
        (immatriculation, assureur) peuvent être transmises à votre assureur
        pour la prise en charge du sinistre bris de glace.
      </p>
      <p>
        Pour limiter les envois abusifs, le site garde une empreinte anonyme de
        votre adresse IP pendant une journée au plus ; elle ne permet pas de
        vous identifier.
      </p>
      <p>
        Responsable du traitement : {site.mentions.raisonSociale},{" "}
        {site.mentions.siege}.
      </p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l’accès, la rectification ou la suppression de vos
        données en écrivant à {site.email} ou en appelant le {site.telephone}.
        Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).
      </p>
    </PageTexte>
  );
}

export function Introuvable() {
  return (
    <PageTexte titre="Page introuvable">
      <p>Cette page n’existe pas ou a changé d’adresse.</p>
      <p>
        <a href={vers("/")} className="underline underline-offset-2">
          Retour à l’accueil
        </a>{" "}
        · ou{" "}
        <a href={vers("/#devis")} className="underline underline-offset-2">
          demandez votre devis gratuit
        </a>
        .
      </p>
    </PageTexte>
  );
}
