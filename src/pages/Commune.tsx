import Header from "../components/Header";
import Footer from "../components/Footer";
import { Ouverture, SuiteDePage } from "../components/Sections";
import { Container, Etiquette } from "../components/ui";
import { vers } from "../vers";
import { COMMUNES, cheminCommune, type Commune } from "../contenu";

/** Page d'une commune desservie (référencement local : « pare-brise Chenôve »…). */
export default function PageCommune({ commune }: { commune: Commune }) {
  const autres = COMMUNES.filter((c) => c.slug !== commune.slug);
  return (
    <>
      <Header />
      <main>
        <Ouverture
          etiquette={`Pare-brise · ${commune.nom} (${commune.codePostal})`}
          titre={
            <>
              Votre <span className="whitespace-nowrap">pare-brise</span>{" "}
              remplacé à {commune.nom}.
            </>
          }
          texte={commune.texte}
        />
        <SuiteDePage
          apres={
            <section
              aria-label="Autres communes"
              className="border-t border-trait py-14"
            >
              <Container>
                <Etiquette>Nous intervenons aussi à</Etiquette>
                <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-1">
                  {autres.map((c) => (
                    <li key={c.slug}>
                      <a
                        href={vers(cheminCommune(c))}
                        className="inline-flex min-h-11 items-center text-[16px] text-doux hover:text-noir"
                      >
                        Pare-brise {c.nom}
                      </a>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          }
        />
      </main>
      <Footer />
    </>
  );
}
