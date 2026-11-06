import { useState, type FormEvent, type ReactNode } from "react";
import { vers, DEMO } from "../vers";
import { Ico, btnAmbre, btnNuit } from "./ui";
import { site } from "../config";
import { COMMUNES } from "../contenu";
import { Texte, montrer } from "../aCompleter";

type Etat = "idle" | "envoi" | "ok" | "erreur" | "limite";

const champ =
  "w-full rounded-xl border-2 border-[#B8C7D4] bg-white px-3.5 py-3 text-base text-nuit placeholder:text-[#8796A5]";
const lbl = "flex flex-col gap-1.5 text-[14px] font-semibold text-nuit";
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
    <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-normal text-gris">
      <input
        type="checkbox"
        name="consentement"
        required
        className="mt-0.5 h-5 w-5 shrink-0 accent-bleu"
      />
      <span>
        J’accepte que ces informations soient utilisées pour me recontacter au
        sujet de ma demande (
        <a href={vers("/confidentialite")}>confidentialité</a>).
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
      className="flex flex-col gap-3 rounded-2xl border border-ligne bg-white p-8 text-nuit"
    >
      <p className="flex items-center gap-2 font-titre text-[26px] font-extrabold">
        <Ico nom="coche" className="text-[#059669]" />
        Demande envoyée
      </p>
      <p className="text-gris">{children}</p>
      {DEMO && (
        <p className="rounded-lg bg-glace px-3 py-2 text-[14px] text-bleu">
          Démonstration : cette demande n’a pas été envoyée.
        </p>
      )}
    </div>
  );
}

/** Choix en boutons (radio) : pastilles ou blocs. */
function Choix({
  legende,
  nom,
  options,
  defaut,
  bloc = false,
}: {
  legende: string;
  nom: string;
  options: [string, string][];
  defaut: string;
  bloc?: boolean;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-[14px] font-semibold">{legende}</legend>
      <div className={bloc ? "grid grid-cols-2 gap-2" : "flex flex-wrap gap-2"}>
        {options.map(([v, l]) => (
          <label
            key={v}
            className={`flex cursor-pointer items-center justify-center border-2 font-semibold transition-colors has-[:checked]:border-nuit has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ambre ${
              bloc
                ? "min-h-[52px] rounded-xl border-[#B8C7D4] bg-white text-[15px] has-[:checked]:border-bleu has-[:checked]:bg-glace"
                : "min-h-11 rounded-full border-[#B8C7D4] bg-white px-4 text-[15px] has-[:checked]:bg-nuit has-[:checked]:text-white"
            }`}
          >
            <input
              type="radio"
              name={nom}
              value={l}
              defaultChecked={v === defaut}
              className="sr-only"
            />
            {l}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Devis express : le dégât, le lieu, l'immatriculation, le code postal, une photo, et comment vous joindre. */
export function Devis({
  lieuParDefaut = "domicile",
}: {
  lieuParDefaut?: string;
}) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [erreurPhotos, setErreurPhotos] = useState("");
  const [cp, setCp] = useState("");
  const { etat, envoyer } = useEnvoi(photos);

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

  if (etat === "ok")
    return (
      <Merci>Merci ! Nous vous recontactons rapidement avec votre devis.</Merci>
    );
  return (
    <form
      id="devis"
      onSubmit={(e) => {
        void envoyer(e).then(() => setPhotos([]));
      }}
      className="relative flex scroll-mt-24 flex-col gap-5 rounded-2xl bg-white p-5 text-nuit shadow-[0_20px_50px_rgba(11,31,51,0.25)] md:p-7"
    >
      <input type="hidden" name="type" value="devis" />
      <div className="flex flex-col gap-1">
        <h2 className="text-[26px] font-extrabold leading-tight">
          Devis express
        </h2>
        <p className="text-[15px] text-gris">
          Une photo suffit
          {montrer(site.delaiReponse) && <> : réponse sous <Texte t={site.delaiReponse} /></>}.
        </p>
      </div>
      <Choix
        legende="Le dégât"
        nom="degat"
        defaut="impact"
        options={[
          ["impact", "Impact"],
          ["fissure", "Fissure"],
          ["casse", "Vitre cassée"],
        ]}
      />
      <Choix
        legende="Où intervenir ?"
        nom="lieu"
        bloc
        defaut={lieuParDefaut}
        options={[
          ["domicile", "À domicile"],
          ["travail", "Au travail"],
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
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
          <p className="flex items-start gap-2 rounded-xl bg-[#ECFDF5] px-3 py-2.5 text-[14px] font-semibold text-[#065F46]">
            <Ico nom="coche" taille={20} className="shrink-0" />
            Nous nous déplaçons dans votre commune : intervention à domicile ou
            au travail.
          </p>
        ) : (
          <p className="rounded-xl bg-glace px-3 py-2.5 text-[14px] text-nuit">
            Envoyez votre demande : nous vous disons tout de suite si nous
            pouvons venir jusqu’à vous.
          </p>
        ))}
      <label className="flex cursor-pointer flex-col gap-1.5">
        <span className="flex min-h-[58px] items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#B8C7D4] px-4 text-center text-[15px] font-semibold text-bleu hover:border-bleu">
          <Ico nom="photo" className="shrink-0" />
          {photos.length
            ? `${photos.length} photo${photos.length > 1 ? "s" : ""} ajoutée${photos.length > 1 ? "s" : ""}`
            : "Photographier le pare-brise"}
        </span>
        <span className="text-[13px] text-gris">
          Facultatif, {PHOTOS_MAX} photos au maximum
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
      <div className="grid gap-3 sm:grid-cols-2">
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
          E-mail <span className="font-normal text-gris">(facultatif)</span>
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
          Précisions <span className="font-normal text-gris">(facultatif)</span>
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
      <button
        type="submit"
        disabled={etat === "envoi"}
        className={`${btnAmbre} w-full border-0 !text-[17px] !font-extrabold disabled:opacity-60`}
      >
        {etat === "envoi" ? "Envoi…" : "Recevoir mon devis gratuit"}
      </button>
    </form>
  );
}

/** Être rappelé : nom, téléphone et moment souhaité. */
export function Rappel() {
  const { etat, envoyer } = useEnvoi();
  if (etat === "ok")
    return <Merci>Merci ! Nous vous rappelons au moment choisi.</Merci>;
  return (
    <form
      onSubmit={envoyer}
      className="relative flex flex-col gap-4 rounded-2xl border border-ligne bg-white p-5 md:p-7"
    >
      <input type="hidden" name="type" value="rappel" />
      <div className="grid gap-3 sm:grid-cols-2">
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
        className={`${btnNuit} w-full border-0 disabled:opacity-60 sm:w-auto sm:self-start`}
      >
        <Ico nom="rappel" taille={20} />
        {etat === "envoi" ? "Envoi…" : "Être rappelé"}
      </button>
    </form>
  );
}
