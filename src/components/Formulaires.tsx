import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { vers, DEMO } from "../vers";
import { Fleche, Ico, btnLigne, btnNoir } from "./ui";
import { site } from "../config";
import { COMMUNES } from "../contenu";
import { montrer } from "../aCompleter";

type Etat = "idle" | "envoi" | "ok" | "erreur" | "limite";

const champ =
  "w-full rounded-none border-0 border-b border-[#9A9AA0] bg-transparent px-0 py-2.5 text-[17px] text-noir placeholder:text-[#A3A3A8] focus:border-noir focus:outline-none";
const lbl =
  "flex flex-col gap-1 text-[12px] font-medium uppercase tracking-[0.14em] text-doux";
const PHOTOS_MAX = 3;
const TAILLE_MAX = 4 * 1024 * 1024; // 4 Mo par photo (après réduction automatique)
const CODES_DESSERVIS = new Set(COMMUNES.map((c) => c.codePostal));

/** Réduit une photo de téléphone (souvent 5 à 10 Mo) à 1600 px de large avant l'envoi. */
async function reduire(fichier: File): Promise<Blob> {
  if (
    !fichier.type.startsWith("image/") ||
    typeof createImageBitmap !== "function"
  )
    return fichier;
  try {
    const image = await createImageBitmap(fichier);
    const echelle = Math.min(1, 1600 / Math.max(image.width, image.height));
    const toile = document.createElement("canvas");
    toile.width = Math.round(image.width * echelle);
    toile.height = Math.round(image.height * echelle);
    toile.getContext("2d")!.drawImage(image, 0, 0, toile.width, toile.height);
    return await new Promise((ok) =>
      toile.toBlob((b) => ok(b ?? fichier), "image/jpeg", 0.85),
    );
  } catch {
    return fichier;
  }
}

/** Envoi commun au devis et au rappel ; sur la démonstration, rien n'est envoyé. */
function useEnvoi(photos: File[] = []) {
  const [etat, setEtat] = useState<Etat>("idle");
  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setEtat("envoi");
    try {
      const donnees = new FormData(form);
      donnees.delete("photos");
      for (const [i, p] of photos.entries()) {
        const reduite = await reduire(p);
        if (reduite.size <= TAILLE_MAX)
          donnees.append("photos[]", reduite, `photo-${i + 1}.jpg`);
      }
      if (!DEMO) {
        const res = await fetch(vers("/api/devis.php"), {
          method: "POST",
          body: donnees,
        });
        if (!res.ok) throw new Error(res.status === 429 ? "limite" : "");
      }
      setEtat("ok");
      form.reset();
    } catch (err) {
      setEtat(
        err instanceof Error && err.message === "limite" ? "limite" : "erreur",
      );
    }
  }
  return { etat, envoyer };
}

function Consentement() {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-normal text-doux">
      <input
        type="checkbox"
        name="consentement"
        required
        className="mt-0.5 h-5 w-5 shrink-0 accent-noir"
      />
      <span>
        J’accepte que ces informations soient utilisées pour me recontacter au
        sujet de ma demande (
        <a
          href={vers("/confidentialite")}
          className="underline underline-offset-2"
        >
          confidentialité
        </a>
        ).
      </span>
    </label>
  );
}

/** Piège à robots : invisible pour un humain. */
const Piege = () => (
  <div
    aria-hidden="true"
    className="absolute -left-[9999px] h-px w-px overflow-hidden"
  >
    <label>
      Site web
      <input name="site_web" tabIndex={-1} autoComplete="off" />
    </label>
  </div>
);

function Erreur({ etat }: { etat: Etat }) {
  const tel = montrer(site.telephone)
    ? ` Appelez le ${site.telephone}.`
    : " Réessayez dans un instant.";
  if (etat === "erreur")
    return (
      <p role="alert" className="text-[14px] text-[#B42318]">
        L’envoi a échoué.{tel}
      </p>
    );
  if (etat === "limite")
    return (
      <p role="alert" className="text-[14px] text-[#B42318]">
        Plusieurs demandes ont déjà été envoyées aujourd’hui.{tel}
      </p>
    );
  return null;
}

function Merci({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="flex flex-col gap-4 rounded-[4px] bg-white p-8 md:p-12"
    >
      <p className="flex items-center gap-3 text-[30px] font-light">
        <Ico nom="coche" taille={28} className="text-cassis" />
        Demande envoyée
      </p>
      <p className="text-[17px] font-light text-doux">{children}</p>
      {DEMO && (
        <p className="border-l-2 border-cassis pl-3 text-[14px] text-cassis">
          Démonstration : cette demande n’a pas été envoyée.
        </p>
      )}
    </div>
  );
}

/** Choix en segments (boutons radio). */
function Segments({
  legende,
  nom,
  options,
  defaut,
}: {
  legende: string;
  nom: string;
  options: string[];
  defaut: string;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-[12px] font-medium uppercase tracking-[0.14em] text-doux">
        {legende}
      </legend>
      <div
        className="grid overflow-hidden rounded-[4px] border border-trait"
        style={{
          gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((o) => (
          <label
            key={o}
            className="flex min-h-14 cursor-pointer items-center justify-center border-r border-trait px-2 text-center text-[15px] transition-colors last:border-r-0 hover:bg-gris has-[:checked]:bg-noir has-[:checked]:text-white"
          >
            <input
              type="radio"
              name={nom}
              value={o}
              defaultChecked={o === defaut}
              className="sr-only"
            />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const ETAPES = ["Le dégât", "Le véhicule", "Vos coordonnées"];

/** Devis express en 3 étapes : le dégât et le lieu, le véhicule et la photo, puis les coordonnées. */
export function Devis() {
  const [etape, setEtape] = useState(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [erreurPhotos, setErreurPhotos] = useState("");
  const [cp, setCp] = useState("");
  const { etat, envoyer } = useEnvoi(photos);
  const refs = useRef<(HTMLFieldSetElement | null)[]>([]);

  function choisirPhotos(liste: FileList | null) {
    const images = [...(liste ?? [])].filter((f) =>
      f.type.startsWith("image/"),
    );
    setErreurPhotos(
      images.length > PHOTOS_MAX
        ? `${PHOTOS_MAX} photos au maximum : les premières sont gardées.`
        : "",
    );
    setPhotos(images.slice(0, PHOTOS_MAX));
  }
  /** Étape suivante, seulement si les champs de l'étape en cours sont valides. */
  function suivante() {
    const champs = [
      ...(refs.current[etape]?.querySelectorAll<HTMLInputElement>(
        "input, select, textarea",
      ) ?? []),
    ];
    if (champs.every((c) => c.reportValidity())) setEtape((e) => e + 1);
  }

  if (etat === "ok")
    return (
      <Merci>
        Merci ! Nous revenons vers vous rapidement avec votre devis gratuit.
      </Merci>
    );
  const bloc = (n: number, children: ReactNode) => (
    <fieldset
      ref={(el) => {
        refs.current[n] = el;
      }}
      hidden={etape !== n}
      className="flex flex-col gap-7"
    >
      <legend className="mb-7 text-[28px] font-light">
        {["Quel est le dégât ?", "Votre véhicule", "Comment vous joindre ?"][n]}
      </legend>
      {children}
    </fieldset>
  );
  return (
    <form
      onSubmit={(e) => {
        void envoyer(e).then(() => {
          setPhotos([]);
          setEtape(0);
        });
      }}
      noValidate={false}
      className="relative flex flex-col rounded-[4px] bg-white p-6 md:p-12"
    >
      <input type="hidden" name="type" value="devis" />
      <div
        className="mb-3 flex justify-between text-[13px] text-doux"
        aria-live="polite"
      >
        <span className="font-medium text-noir">0{etape + 1} / 03</span>
        <span>{ETAPES[etape]}</span>
      </div>
      <div className="mb-9 h-[2px] bg-trait">
        <div
          className="h-[2px] bg-cassis transition-all duration-500"
          style={{ width: `${((etape + 1) / 3) * 100}%` }}
        />
      </div>

      {bloc(0, <>
        <Segments
          legende="Le dégât"
          nom="degat"
          defaut="Impact"
          options={["Impact", "Fissure", "Vitre cassée"]}
        />
        <Segments
          legende="Où intervenir ?"
          nom="lieu"
          defaut="À domicile"
          options={["À domicile", "Au travail"]}
        />
      </>)}
      {bloc(1, <>
        <div className="grid grid-cols-2 gap-6">
          <label className={lbl}>
            Immatriculation
            <input
              name="immatriculation"
              placeholder="AB-123-CD"
              autoCapitalize="characters"
              className={`${champ} uppercase`}
            />
          </label>
          <label className={lbl}>
            Code postal
            <input
              name="code_postal"
              required
              inputMode="numeric"
              pattern="[0-9]{5}"
              maxLength={5}
              placeholder="21000"
              autoComplete="postal-code"
              value={cp}
              onChange={(e) => setCp(e.target.value.replace(/\D/g, ""))}
              className={champ}
            />
          </label>
        </div>
        {cp.length === 5 &&
          (CODES_DESSERVIS.has(cp) ? (
            <p className="flex items-center gap-2 text-[15px] text-[#1F7A47]">
              <Ico nom="coche" taille={18} />
              Nous nous déplaçons dans votre commune.
            </p>
          ) : (
            <p className="text-[15px] text-doux">
              Envoyez votre demande : nous vous disons tout de suite si nous
              pouvons venir jusqu’à vous.
            </p>
          ))}
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[4px] border border-dashed border-[#A3A3A8] px-5 py-5 hover:border-noir">
          <span className="flex items-center gap-3 text-[15px]">
            <Ico nom="photo" />
            {photos.length
              ? `${photos.length} photo${photos.length > 1 ? "s" : ""} ajoutée${photos.length > 1 ? "s" : ""}`
              : "Photographier le pare-brise"}
          </span>
          <span className="text-[13px] text-doux">
            Facultatif · {PHOTOS_MAX} max.
          </span>
          <input
            name="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => choisirPhotos(e.target.files)}
            className="sr-only"
          />
        </label>
        {erreurPhotos && (
          <p className="text-[14px] text-[#B42318]">{erreurPhotos}</p>
        )}
      </>)}
      {bloc(2, <>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className={lbl}>
            Nom
            <input name="nom" required autoComplete="name" className={champ} />
          </label>
          <label className={lbl}>
            Téléphone
            <input
              name="telephone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              className={champ}
            />
          </label>
        </div>
        <label className={lbl}>
          <span>
            E-mail{" "}
            <span className="normal-case tracking-normal">(facultatif)</span>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={champ}
          />
        </label>
        <label className={lbl}>
          <span>
            Précisions{" "}
            <span className="normal-case tracking-normal">(facultatif)</span>
          </span>
          <textarea
            name="message"
            rows={2}
            placeholder="Modèle du véhicule, assureur, disponibilités…"
            className={`${champ} resize-y`}
          />
        </label>
        <Consentement />
        <Piege />
        <Erreur etat={etat} />
      </>)}

      <div className="mt-9 flex gap-3">
        {etape > 0 && (
          <button
            type="button"
            onClick={() => setEtape((e) => e - 1)}
            className={`${btnLigne} shrink-0`}
          >
            Retour
          </button>
        )}
        {etape < 2 ? (
          <button
            type="button"
            onClick={suivante}
            className={`${btnNoir} flex-1`}
          >
            Continuer <Fleche />
          </button>
        ) : (
          <button
            type="submit"
            disabled={etat === "envoi"}
            className={`${btnNoir} flex-1 disabled:opacity-60`}
          >
            {etat === "envoi" ? (
              "Envoi…"
            ) : (
              <>
                Recevoir mon devis gratuit <Fleche />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

/** Être rappelé : nom, téléphone et moment souhaité. */
export function Rappel() {
  const { etat, envoyer } = useEnvoi();
  if (etat === "ok")
    return <Merci>Merci ! Nous vous rappelons au moment choisi.</Merci>;
  return (
    <form onSubmit={envoyer} className="relative flex flex-col gap-7">
      <input type="hidden" name="type" value="rappel" />
      <div className="grid gap-6 sm:grid-cols-2">
        <label className={lbl}>
          Nom
          <input name="nom" required autoComplete="name" className={champ} />
        </label>
        <label className={lbl}>
          Téléphone
          <input
            name="telephone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className={champ}
          />
        </label>
      </div>
      <label className={lbl}>
        Quand vous rappeler ?
        <select
          name="creneau"
          className={champ}
          defaultValue="Dès que possible"
        >
          <option>Dès que possible</option>
          <option>Le matin</option>
          <option>Le midi</option>
          <option>L’après-midi</option>
          <option>En fin de journée</option>
        </select>
      </label>
      <Consentement />
      <Piege />
      <Erreur etat={etat} />
      <button
        type="submit"
        disabled={etat === "envoi"}
        className={`${btnLigne} self-start disabled:opacity-60`}
      >
        <Ico nom="rappel" taille={18} />
        {etat === "envoi" ? "Envoi…" : "Être rappelé"}
      </button>
    </form>
  );
}
