import type { ReactNode } from "react";
import type { Icone } from "../contenu";

export const btnAmbre =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ambre px-5 py-3 text-[16px] font-bold text-nuit no-underline transition-colors hover:bg-[#FFB940]";
export const btnClair =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-5 py-3 text-[16px] font-semibold text-white no-underline transition-colors hover:border-white hover:bg-white/10";
export const btnNuit =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-nuit px-5 py-3 text-[16px] font-semibold text-white no-underline transition-colors hover:bg-bleu";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-4 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function TitreSection({
  label,
  titre,
  texte,
  clair = false,
}: {
  label?: string;
  titre: ReactNode;
  texte?: ReactNode;
  clair?: boolean;
}) {
  return (
    <div className="flex max-w-[760px] flex-col gap-3">
      {label && (
        <p
          className={`text-[13px] font-semibold uppercase tracking-[0.16em] ${clair ? "text-ambre" : "text-bleu"}`}
        >
          {label}
        </p>
      )}
      <h2
        className={`text-[30px] font-extrabold leading-[1.08] md:text-[42px] ${clair ? "text-white" : ""}`}
      >
        {titre}
      </h2>
      {texte && (
        <p
          className={`text-[17px] leading-relaxed ${clair ? "text-white/75" : "text-gris"}`}
        >
          {texte}
        </p>
      )}
    </div>
  );
}

/* Icônes au trait (aucune image extérieure) */
const TRACES: Record<
  | Icone
  | "telephone"
  | "horloge"
  | "lieu"
  | "photo"
  | "coche"
  | "fleche"
  | "maison"
  | "travail"
  | "bouclier"
  | "cadeau"
  | "rappel"
  | "devis"
  | "menu"
  | "fermer"
  | "chevron",
  string
> = {
  parebrise:
    "M3 19l3-12c.3-1.2 1.3-2 2.5-2h7c1.2 0 2.2.8 2.5 2l3 12zM8 9h3M7 12.5h2.5",
  impact:
    "M12 12m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3",
  vitre: "M4 18V9l5-4h11v13zM4 13h16M13 5v13",
  telephone:
    "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2",
  horloge: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  lieu: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
  photo: "M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7",
  coche: "M5 12l4 4 10-10",
  fleche: "M5 12h14M13 6l6 6-6 6",
  maison: "M3 11l9-7 9 7v9H3zM9 20v-6h6v6",
  travail: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  bouclier:
    "M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  cadeau:
    "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1zM12 7c1.5-3 5-3 5-1s-3 1-5 1z",
  rappel:
    "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2M15 3a6 6 0 0 1 6 6M15 7a2 2 0 0 1 2 2",
  devis: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4",
  menu: "M4 7h16M4 12h16M4 17h16",
  fermer: "M6 6l12 12M18 6L6 18",
  chevron: "M6 9l6 6 6-6",
};

export type NomIco = keyof typeof TRACES;

export function Ico({
  nom,
  taille = 24,
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${nom === "chevron" ? "chevron transition-transform " : ""}${className}`}
    >
      <path d={TRACES[nom]} />
    </svg>
  );
}

/** Emplacement de photo en attente des vraies photos de l'artisan (visible sur la démonstration seulement). */
export function PhotoAVenir({
  texte,
  className = "",
}: {
  texte: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-[repeating-linear-gradient(135deg,rgba(11,31,51,0.05)_0_12px,transparent_12px_24px)] bg-glace text-gris ${className}`}
    >
      <span className="flex items-center gap-2 px-4 text-center text-[14px]">
        <Ico nom="photo" taille={20} />
        {texte}
      </span>
    </div>
  );
}
