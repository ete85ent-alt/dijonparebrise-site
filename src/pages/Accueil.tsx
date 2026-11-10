import Header from "../components/Header";
import Footer from "../components/Footer";
import { Ouverture, SuiteDePage } from "../components/Sections";
import { donneesGoogle } from "../seo";

/** Données pour Google (src/seo.ts). */
function DonneesGoogle() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesGoogle()) }} />;
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
          texte="À domicile ou sur le parking de votre travail. DIJON PARE‑BRISE se déplace avec tout le matériel et s’occupe de votre assurance."
        />
        <SuiteDePage />
      </main>
      <Footer />
      <DonneesGoogle />
    </>
  );
}
