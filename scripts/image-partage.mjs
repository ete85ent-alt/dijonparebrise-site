// Crée public/partage.jpg (1200 × 630 px) : l'image qui s'affiche quand on partage le site
// (WhatsApp, Facebook, SMS, LinkedIn…) et dans les données pour Google.
// À relancer si la photo d'ouverture ou le logo changent : node scripts/image-partage.mjs
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const f = (p) => pathToFileURL(path.join(racine, p)).href;
const police = (g) =>
  `@font-face{font-family:H;font-weight:${g};src:url(${f(`node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-${g}-normal.woff2`)})}`;

const html = `<!doctype html><meta charset="utf-8"><style>
${police(300)}${police(500)}
*{margin:0}body{width:1200px;height:630px;position:relative;overflow:hidden;background:#0E0E10;color:#fff;font-family:H,sans-serif}
img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.7}
.f{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,.35) 70%)}
.c{position:absolute;left:72px;right:72px;top:64px;bottom:64px;display:flex;flex-direction:column;justify-content:space-between}
.logo{display:flex;align-items:center;gap:18px;font-size:18px;letter-spacing:.42em;line-height:1.4}
.k{font-size:16px;letter-spacing:.22em;text-transform:uppercase;color:#C9A3B9;font-weight:500;margin-bottom:22px}
h1{font-weight:300;font-size:68px;line-height:1.02;letter-spacing:-.02em;max-width:13ch}
.o{display:flex;gap:40px;font-size:24px;font-weight:300;color:rgba(255,255,255,.85)}
</style>
<img src="${f("public/photos/ouverture-1280.webp")}"><div class="f"></div>
<div class="c">
  <div class="logo"><svg width="58" height="50" viewBox="0 0 120 104" fill="none"><path d="M10 98 L24 16 Q26 8 34 8 H86 Q94 8 96 16 L110 98 Z" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M38 50 V82 H45 C54 82 60 75.5 60 66 C60 56.5 54 50 45 50 Z M68 82 V50 H76.5 C82 50 85.5 53.5 85.5 58.5 C85.5 63.5 82 67 76.5 67 H68" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M40 90 H80" stroke="#C9A3B9" stroke-width="3.5"/></svg>
    <div><b style="font-weight:500">DIJON</b><br>PARE-BRISE</div></div>
  <div><p class="k">Artisan pare-brise · Dijon</p><h1>Votre pare-brise, remplacé là où vous êtes.</h1></div>
  <div class="o"><span>À domicile ou au travail</span><span>200 € offerts*</span><span>0 € d’avance si assuré</span></div>
</div>`;

const nav = await chromium.launch();
const page = await nav.newPage({ viewport: { width: 1200, height: 630 } });
// Page écrite dans un fichier temporaire : elle peut alors charger la photo et la police du projet
const temp = path.join(os.tmpdir(), "dpb-partage.html");
fs.writeFileSync(temp, html);
await page.goto(pathToFileURL(temp).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: path.join(racine, "public", "partage.jpg"),
  type: "jpeg",
  quality: 82,
});
await nav.close();
console.log("✓ public/partage.jpg");
