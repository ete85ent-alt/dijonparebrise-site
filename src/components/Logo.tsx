/*
 * Logo validé : monogramme « DP » dans le contour d'un pare-brise, souligné de cassis,
 * suivi de « DIJON PARE-BRISE » très espacé. Les lettres D et P sont dessinées (aucune police nécessaire).
 * Même dessin pour l'icône du site : public/favicon.svg.
 */
export function Monogramme({
  couleur = "currentColor",
  taille = 36,
}: {
  couleur?: string;
  taille?: number;
}) {
  return (
    <svg
      width={taille}
      height={(taille * 104) / 120}
      viewBox="0 0 120 104"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 98 L24 16 Q26 8 34 8 H86 Q94 8 96 16 L110 98 Z"
        stroke={couleur}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M38 50 V82 H45 C54 82 60 75.5 60 66 C60 56.5 54 50 45 50 Z M68 82 V50 H76.5 C82 50 85.5 53.5 85.5 58.5 C85.5 63.5 82 67 76.5 67 H68"
        stroke={couleur}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M40 90 H80" stroke="#5E1243" strokeWidth="3.5" />
    </svg>
  );
}

export function Logo({
  clair = false,
  grand = false,
}: {
  clair?: boolean;
  grand?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-3 ${clair ? "text-white" : "text-noir"}`}
    >
      <Monogramme taille={grand ? 48 : 34} />
      <span
        className={`flex flex-col leading-[1.35] ${grand ? "text-[15px]" : "text-[12px]"}`}
      >
        <span className="font-medium tracking-[0.42em]">DIJON</span>
        <span className="font-light tracking-[0.42em]">PARE-BRISE</span>
      </span>
    </span>
  );
}
