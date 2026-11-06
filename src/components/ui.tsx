import type { ReactNode } from "react";
import { vers, BASE } from "../vers";

const btn =
  "inline-flex h-[52px] items-center justify-center gap-2.5 rounded-[4px] px-7 text-[15px] font-medium transition-colors";
export const btnBlanc = `${btn} bg-white text-noir hover:bg-gris`;
export const btnContour = `${btn} border border-white/60 text-white hover:bg-white/10`;
export const btnNoir = `${btn} bg-noir text-white hover:bg-cassis`;
export const btnLigne = `${btn} border border-noir text-noir hover:bg-noir hover:text-white`;

/** Flèche fine des boutons et liens. */
export const Fleche = () => (
  <span aria-hidden="true" className="font-light">
    →
  </span>
);

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1360px] px-5 md:px-10 xl:px-14 ${className}`}
    >
      {children}
    </div>
  );
}

/** Petit intitulé en capitales espacées au-dessus des titres. */
export function Etiquette({
  children,
  clair = false,
  className = "",
}: {
  children: ReactNode;
  clair?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-[12px] font-medium uppercase tracking-[0.22em] ${clair ? "text-cassis-clair" : "text-cassis"} ${className}`}
    >
      {children}
    </p>
  );
}

export function TitreSection({
  etiquette,
  titre,
  clair = false,
}: {
  etiquette: string;
  titre: ReactNode;
  clair?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Etiquette clair={clair}>{etiquette}</Etiquette>
      <h2
        className={`max-w-[18ch] text-[34px] leading-[1.05] md:text-[52px] ${clair ? "text-white" : ""}`}
      >
        {titre}
      </h2>
    </div>
  );
}

/* Icônes au trait fin (aucune image extérieure) */
const TRACES = {
  telephone:
    "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2",
  rappel:
    "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2M15 3a6 6 0 0 1 6 6M15 7a2 2 0 0 1 2 2",
  photo: "M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7",
  coche: "M5 12l4 4 10-10",
  fermer: "M6 6l12 12M18 6L6 18",
  plus: "M12 5v14M5 12h14",
};
export type NomIco = keyof typeof TRACES;

export function Ico({
  nom,
  taille = 22,
  className = "",
}: {
  nom: NomIco;
  taille?: number;
  className?: string;
}) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={TRACES[nom]} />
    </svg>
  );
}

export type NomPhoto = "ouverture" | "remplacement" | "impact" | "vitre" | "artisan" | "nuit";

/**
 * Photo d’illustration (Unsplash, crédits dans les mentions légales) en 3 tailles :
 * le téléphone charge la plus petite suffisante (640 ou 1280 px), l’ordinateur la plus grande.
 * À remplacer par les vraies photos d’intervention de l’artisan dès qu’elles sont disponibles.
 */
export function Photo({ nom, sizes = "100vw", className = "", prioritaire = false, assombrir = false }:
  { nom: NomPhoto; sizes?: string; className?: string; prioritaire?: boolean; assombrir?: boolean }) {
  return (
    <div className={`${/absolute/.test(className) ? "" : "relative"} overflow-hidden bg-noir ${className}`}>
      <img src={vers(`/photos/${nom}-1280.webp`)} srcSet={[640, 1280, 1920].map((l) => `${BASE}photos/${nom}-${l}.webp ${l}w`).join(", ")}
        sizes={sizes} alt="" loading={prioritaire ? "eager" : "lazy"} decoding="async" {...(prioritaire ? { fetchPriority: "high" as const } : {})}
        className={`h-full w-full object-cover ${assombrir ? "opacity-75" : ""}`} />
    </div>
  )
}
