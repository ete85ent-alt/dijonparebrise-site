/*
 * LOGO PROVISOIRE (logo texte) : le vrai logo n'est pas encore choisi.
 * Pour le remplacer : mettre le fichier dans public/logo.svg et remplacer le contenu de ce composant par
 *   <img src={vers('/logo.svg')} alt="Dijon Pare-Brise" className="h-9 w-auto" />
 */
export function Logo({
  clair = false,
  grand = false,
}: {
  clair?: boolean;
  grand?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        width={grand ? 40 : 32}
        height={grand ? 30 : 24}
        viewBox="0 0 46 34"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 30 L9 6 Q10 3 13 3 H33 Q36 3 37 6 L42 30 Z"
          stroke={clair ? "#FFFFFF" : "#0B1F33"}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M14 9 L20 9 M12 14 L17 14"
          stroke="#0EA5E9"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`whitespace-nowrap font-titre font-extrabold leading-none ${grand ? "text-[22px]" : "text-[18px] md:text-[20px]"} ${clair ? "text-white" : "text-nuit"}`}
      >
        DIJON{" "}
        <span className={clair ? "text-ciel" : "text-bleu"}>PARE-BRISE</span>
      </span>
    </span>
  );
}
