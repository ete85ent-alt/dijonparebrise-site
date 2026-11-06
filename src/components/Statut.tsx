import { useEffect, useState } from "react";
import { maintenantAParis, statutOuverture, type Statut } from "../ouverture";
import { site } from "../config";
import { DEMO } from "../vers";
import { Texte } from "../aCompleter";

/** Statut d'ouverture à l'heure de Paris, recalculé chaque minute ; null avant le calcul (page pré-rendue). */
export function useStatutOuverture() {
  const [s, setS] = useState<Statut | null>(null);
  useEffect(() => {
    const maj = () => {
      const { jour, minutes } = maintenantAParis();
      setS(statutOuverture(jour, minutes));
    };
    maj();
    const t = setInterval(maj, 60_000);
    return () => clearInterval(t);
  }, []);
  return s;
}

/** « Ouvert maintenant » / « Fermé · ouvre demain à 8 h ». Horaires pas encore confirmés : seulement sur la démonstration. */
export default function StatutOuverture() {
  const s = useStatutOuverture();
  if (!site.horaires.confirmes && !DEMO) return null;
  const couleur = !s ? "bg-white/40" : s.ouvert ? "bg-[#34D399]" : "bg-ambre";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold text-white"
      role="status"
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${couleur}`}
        aria-hidden="true"
      />
      {s?.texte ?? "Horaires"}
      {!site.horaires.confirmes && (
        <span className="ml-1">
          <Texte t="[horaires à confirmer]" />
        </span>
      )}
    </span>
  );
}
