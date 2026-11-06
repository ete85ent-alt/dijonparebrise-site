import { DEMO } from './vers'

/*
 * Textes encore à fournir par l'artisan : entre crochets [ ].
 * - Texte commençant par « [ » : élément entier à compléter, jamais montré sur le vrai site (montrer).
 * - Crochets au milieu d'un texte : précision à confirmer, retirée sur le vrai site, surlignée sur la démonstration (Texte).
 */
export const aCompleter = (t: string) => t.trimStart().startsWith('[')

/** Sur le vrai site, un élément à compléter n'est jamais montré ; sur la démonstration, il reste visible pour le client. */
export const montrer = (t: string) => DEMO || !aCompleter(t)

/** Texte sans les précisions entre crochets (vrai site). */
export const sansCrochets = (t: string) => t.replace(/\s*\[[^\]]*\]/g, '').replace(/\s+([.,:;)])/g, '$1').trim()

/** Affiche un texte ; sur la démonstration, les passages entre crochets sont surlignés en jaune ; sur le vrai site, retirés. */
export function Texte({ t }: { t: string }) {
  if (!DEMO) return <>{sansCrochets(t)}</>
  return <>{t.split(/(\[[^\]]*\])/).map((p, i) => (p.startsWith('[') ? <mark key={i} className="rounded bg-amber-100 px-1 text-amber-900">{p}</mark> : p))}</>
}
