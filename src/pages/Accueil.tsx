import Header from "../components/Header";
import Footer from "../components/Footer";
import { Accroche, SuiteDePage } from "../components/Sections";
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
        <Accroche
          titre={
            <>
              Votre pare-brise remplacé{" "}
              <span className="text-ambre">chez vous</span> ou au travail
            </>
          }
        />
        <SuiteDePage />
      </main>
      <Footer />
      <DonneesGoogle />
    </>
  );
}
