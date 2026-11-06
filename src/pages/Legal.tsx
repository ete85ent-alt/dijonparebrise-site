import type { ReactNode } from "react";
import { vers } from "../vers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container } from "../components/ui";
import { site } from "../config";
import { Texte } from "../aCompleter";

function PageTexte({
  titre,
  children,
}: {
  titre: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        <Container className="flex max-w-[820px] flex-col gap-5 py-14 text-[16px] leading-relaxed md:py-20 [&_h2]:mt-4 [&_h2]:text-[24px] [&_h2]:font-extrabold">
          <h1 className="text-[38px] font-extrabold leading-tight md:text-[52px]">
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
        Dijon Pare-Brise est un artisan mobile : les interventions ont lieu chez
        le client ou sur son lieu de travail. Le siège social ne reçoit pas de
        clientèle.
      </p>
      <h2>Hébergement</h2>
      <p>{m.hebergeur}</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, illustrations et le logo de ce site appartiennent à{" "}
        {m.raisonSociale}. Toute reproduction sans autorisation est interdite.
      </p>
      <h2>Crédits</h2>
      <p>
        Conception, design et réalisation : ÉTÉ 85 – Digital, Data &amp; IA
        (ete-85.fr). Polices Geist et Archivo (licence SIL Open Font License).
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
        <a href={vers("/")} className="font-semibold">
          ← Retour à l’accueil
        </a>{" "}
        · ou{" "}
        <a href={vers("/#devis")} className="font-semibold">
          demandez votre devis gratuit
        </a>
        .
      </p>
    </PageTexte>
  );
}
