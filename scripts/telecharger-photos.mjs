// Télécharge les photos d'illustration (Unsplash, licence gratuite y compris usage commercial) dans public/photos/,
// en 3 largeurs (640, 1280 et 1920 px) au format WebP : le téléphone charge la plus petite suffisante.
// Les crédits sont écrits dans src/photos.json et affichés dans les mentions légales.
// À relancer seulement pour changer de photos : node scripts/telecharger-photos.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sortie = path.join(racine, 'public', 'photos')
fs.mkdirSync(sortie, { recursive: true })
const LARGEURS = [640, 1280, 1920]

// nom sur le site → [identifiant de l'image, identifiant de la page Unsplash, auteur]
const PHOTOS = {
  ouverture: ['photo-1658317914060-b36dcf399343', '3KZB8G9u024', 'Taras Chernus'],
  remplacement: ['photo-1764428950296-be81c8decb97', 'qCv08TYqrA4', 'Sanaila Rasheed'],
  impact: ['photo-1555614878-149f86a9e4c7', 'HWLMYSkkiAg', 'Justin Cron'],
  vitre: ['photo-1741906060079-3edebafd5300', 'ItSAmsHxdjQ', 'Haberdoedas'],
  artisan: ['photo-1708805282706-f44730b7e527', 'CsZjHjFN3N8', 'Zac Nielson'],
  nuit: ['photo-1642019341061-f81d61659c62', 'oRJsHUlm63I', 'Platon Matakaev'],
}

const credits = {}
for (const [nom, [id, page, auteur]] of Object.entries(PHOTOS)) {
  for (const l of LARGEURS) {
    const f = path.join(sortie, `${nom}-${l}.webp`)
    if (fs.existsSync(f)) continue
    const r = await fetch(`https://images.unsplash.com/${id}?w=${l}&q=${l > 1500 ? 72 : 76}&fm=webp&fit=max`)
    if (!r.ok) throw new Error(`${nom} ${l} : ${r.status}`)
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()))
  }
  credits[nom] = { auteur, lien: `https://unsplash.com/fr/photos/${page}` }
  console.log(`✓ ${nom} · ${auteur}`)
}
fs.writeFileSync(path.join(racine, 'src', 'photos.json'), JSON.stringify(credits, null, 2) + '\n')
