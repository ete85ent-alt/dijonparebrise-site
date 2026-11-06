import Header from "../components/Header";
import Footer from "../components/Footer";
import { Accroche, SuiteDePage } from "../components/Sections";
import { Container } from "../components/ui";
import { vers } from "../vers";
import { COMMUNES, cheminCommune, type Commune } from "../contenu";

/** Page d'une commune desservie (référencement local : « pare-brise Chenôve »…). */
export default function PageCommune({ commune }: { commune: Commune }) {
  const autres = COMMUNES.filter((c) => c.slug !== commune.slug);
  return (
    <>
      <Header />
      <main>
        <nav
          aria-label="Fil d’Ariane"
          className="border-b border-ligne bg-fond"
        >
          <Container className="py-2.5 text-[14px] text-gris">
            <a href={vers("/")}>Accueil</a> › Pare-brise {commune.nom}
          </Container>
        </nav>
        <Accroche
          titre={
            <>
              Pare-brise à <span className="text-ambre">{commune.nom}</span> :
              remplacé chez vous ou au travail
            </>
          }
          sousTitre={commune.texte}
        />
        <SuiteDePage />
        <section
          aria-label="Autres communes"
          className="border-t border-ligne bg-white"
        >
          <Container className="flex flex-col gap-3 py-10">
            <h2 className="text-[22px] font-extrabold">
              Nous intervenons aussi à
            </h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
              {autres.map((c) => (
                <li key={c.slug}>
                  <a
                    href={vers(cheminCommune(c))}
                    className="inline-flex min-h-11 items-center font-semibold"
                  >
                    Pare-brise {c.nom} ({c.codePostal})
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
