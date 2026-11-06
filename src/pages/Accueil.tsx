import Header from "../components/Header";
import Footer from "../components/Footer";
import { Ouverture, SuiteDePage } from "../components/Sections";
import { site } from "../config";
import { COMMUNES } from "../contenu";
import { aCompleter } from "../aCompleter";

/** Données pour Google : entreprise qui se déplace (zone desservie, pas d'adresse d'accueil). */
function DonneesGoogle() {
  const donnees = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: site.nom,
    description:
      "Remplacement et réparation de pare-brise, vitres latérales et lunette arrière, à domicile ou au travail.",
    url: `${site.siteUrl}/`,
    ...(aCompleter(site.telephone) ? {} : { telephone: site.telephone }),
    areaServed: COMMUNES.map((c) => ({ "@type": "City", name: c.nom })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }}
    />
  );
}

export default function Accueil() {
  return (
    <>
      <Header />
      <main>
        <Ouverture
          etiquette="Artisan pare-brise · Dijon"
          titre={
            <>
              Votre <span className="whitespace-nowrap">pare-brise</span>,
              remplacé là où vous êtes.
            </>
          }
          texte="À domicile ou sur le parking de votre travail. Un artisan dijonnais se déplace avec tout le matériel et s’occupe de votre assurance."
        />
        <SuiteDePage />
      </main>
      <Footer />
      <DonneesGoogle />
    </>
  );
}
