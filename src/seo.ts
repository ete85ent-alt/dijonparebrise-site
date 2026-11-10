/*
 * Données structurées pour Google (schema.org, format JSON-LD), lues dans le code de la page d'accueil.
 * - l'entreprise : nom, adresse, coordonnées GPS, zone desservie, prestations (fiche locale, Google Maps) ;
 * - les questions fréquentes affichées sur la page (FAQ).
 * Les informations encore entre crochets ne sont jamais envoyées à Google.
 */
import { site } from "./config";
import { COMMUNES, FAQ, PRESTATIONS } from "./contenu";
import { aCompleter, sansCrochets } from "./aCompleter";

const JOURS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const heure = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function donneesGoogle() {
  const url = `${site.siteUrl}/`;
  const h = site.horaires;
  const entreprise = {
    "@type": "AutoRepair",
    "@id": `${url}#entreprise`,
    name: site.nom,
    legalName: "DIJON PARE-BRISE",
    description:
      "Remplacement et réparation de pare-brise, vitres latérales et lunette arrière, à domicile ou sur le lieu de travail, à Dijon et dans sa métropole.",
    url,
    logo: `${site.siteUrl}/favicon.svg`,
    image: `${site.siteUrl}/partage.jpg`,
    ...(aCompleter(site.telephone) ? {} : { telephone: site.telephone }),
    ...(aCompleter(site.email) ? {} : { email: site.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.adresse.rue,
      postalCode: site.adresse.codePostal,
      addressLocality: site.adresse.ville,
      addressRegion: "Côte-d’Or",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.adresse.lat,
      longitude: site.adresse.lon,
    },
    areaServed: COMMUNES.map((c) => ({ "@type": "City", name: c.nom })),
    ...(h.confirmes
      ? {
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: h.jours.map((j) => JOURS[j]),
              opens: heure(h.ouverture),
              closes: heure(h.fermeture),
            },
          ],
        }
      : {}),
    ...(site.lienAvisGoogle ? { sameAs: [site.lienAvisGoogle] } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Prestations",
      itemListElement: PRESTATIONS.map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: p.titre,
          description: sansCrochets(p.texte),
        },
      })),
    },
  };
  const faq = {
    "@type": "FAQPage",
    "@id": `${url}#questions`,
    mainEntity: FAQ.filter(([, , incomplete]) => !incomplete).map(([q, r]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: sansCrochets(r) },
    })),
  };
  return { "@context": "https://schema.org", "@graph": [entreprise, faq] };
}
