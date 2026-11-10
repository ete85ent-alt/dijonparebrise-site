import { test, expect } from "@playwright/test";

const PAGES = [
  "/",
  "/mentions-legales",
  "/confidentialite",
];

for (const chemin of PAGES) {
  test(`page ${chemin} : s’affiche sans erreur`, async ({ page, isMobile }) => {
    const erreurs: string[] = [];
    page.on("pageerror", (e) => erreurs.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") erreurs.push(m.text());
    });
    const reponse = await page.goto(chemin);
    expect(reponse?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(erreurs).toEqual([]);
    // rien ne dépasse à droite de l'écran, même sur un petit téléphone (360 px)
    for (const l of isMobile ? [360, 412] : [1280]) {
      await page.setViewportSize({ width: l, height: 800 });
      const contenu = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(contenu, `largeur ${l} px`).toBeLessThanOrEqual(l);
    }
  });
}

test("aucun texte « [à compléter] » montré aux visiteurs du vrai site", async ({
  page,
}) => {
  for (const chemin of PAGES.filter(
    (c) => !["/mentions-legales", "/confidentialite"].includes(c),
  )) {
    await page.goto(chemin);
    await page
      .locator("details")
      .evaluateAll((d) =>
        d.forEach((x) => ((x as HTMLDetailsElement).open = true)),
      );
    expect(await page.locator("body").innerText(), chemin).not.toMatch(
      /\[[^\]]{2,}\]/,
    );
  }
});

test("adresse affichée, et le déplacement chez le client toujours mis en avant", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator("footer").getByText(/6-8 rue de Bastogne/),
  ).toBeVisible();
  await expect(
    page.getByText(
      /Basés au 6-8 rue de Bastogne, 21850 Saint-Apollinaire, nous nous déplaçons chez vous ou au travail/,
    ),
  ).toBeVisible();
  await expect(
    page.getByText(/DIJON PARE.BRISE se déplace avec tout le matériel/),
  ).toBeVisible();
  expect(await page.locator("body").innerText()).not.toMatch(
    /artisan dijonnais/,
  );
  await page.goto("/mentions-legales");
  await expect(
    page.getByText(/Siège social : 6-8 rue de Bastogne/),
  ).toBeVisible();
});

test("photos : la plus petite taille suffisante est chargée sur téléphone", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const photo = page.locator("section").first().locator("img");
  await expect(photo).toHaveAttribute("fetchpriority", "high");
  const src = await photo.evaluate((i: HTMLImageElement) => i.currentSrc);
  expect(src).toMatch(
    isMobile ? /ouverture-(640|1280)\.webp/ : /ouverture-(1280|1920)\.webp/,
  );
});

test("devis express en 3 étapes : dégât, véhicule et photo, coordonnées", async ({
  page,
}) => {
  let corps = "";
  await page.route("**/api/devis.php", async (route) => {
    corps = route.request().postDataBuffer()?.toString("latin1") ?? "";
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto("/");
  const devis = page.locator("#devis");
  await devis.getByText("Fissure", { exact: true }).click();
  await devis.getByText("Au travail", { exact: true }).click();
  await devis.getByRole("button", { name: "Continuer" }).click();

  // étape 2 : le code postal est obligatoire
  await devis.getByRole("button", { name: "Continuer" }).click();
  await expect(devis.getByLabel("Code postal")).toBeVisible();
  await devis.getByLabel("Immatriculation").fill("ab-123-cd");
  await devis.getByLabel("Code postal").fill("21300");
  await expect(
    devis.getByText("Nous nous déplaçons dans votre commune"),
  ).toBeVisible();
  await devis.locator("input[type=file]").setInputFiles({
    name: "pare-brise.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    ),
  });
  await expect(devis.getByText("1 photo ajoutée")).toBeVisible();
  await devis.getByRole("button", { name: "Continuer" }).click();

  // étape 3 : les champs déjà remplis sont gardés si l'on revient en arrière
  await devis.getByRole("button", { name: "Retour" }).click();
  await expect(devis.getByLabel("Code postal")).toHaveValue("21300");
  await devis.getByRole("button", { name: "Continuer" }).click();
  await devis.getByLabel("Nom").fill("Client Essai");
  await devis.getByLabel("Téléphone").fill("0600000000");
  await devis.getByRole("checkbox").check();
  await devis
    .getByRole("button", { name: "Recevoir mon devis gratuit" })
    .click();
  await expect(page.getByText("Demande envoyée")).toBeVisible();
  for (const attendu of [
    "Fissure",
    "Au travail",
    "21300",
    'name="type"',
    "photo-1.jpg",
  ])
    expect(corps).toContain(attendu);
});

test("être rappelé : formulaire envoyé", async ({ page }) => {
  await page.route("**/api/devis.php", (route) =>
    route.fulfill({ status: 200, json: { ok: true } }),
  );
  await page.goto("/#rappel");
  const rappel = page.locator("#rappel");
  await rappel.getByLabel("Nom").fill("Client Essai");
  await rappel.getByLabel("Téléphone").fill("0600000000");
  await rappel.getByLabel("Quand vous rappeler ?").selectOption("Le matin");
  await rappel.getByRole("checkbox").check();
  await rappel.getByRole("button", { name: "Être rappelé" }).click();
  await expect(rappel.getByText("Demande envoyée")).toBeVisible();
});

test("menu plein écran : s’ouvre, se ferme avec Échap", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(
    menu.getByRole("link", { name: /Assurance bris de glace/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("téléphone : barre d’actions en bas", async ({ page, isMobile }) => {
  test.skip(!isMobile, "téléphone seulement");
  await page.goto("/");
  const barre = page.getByRole("navigation", { name: "Actions rapides" });
  await expect(barre).toBeVisible();
  await expect(barre.getByRole("link", { name: "Devis" })).toHaveAttribute(
    "href",
    "#devis",
  );
});

test("adresse inconnue : vraie page 404", async ({ page }) => {
  const reponse = await page.goto("/cette-page-nexiste-pas");
  expect(reponse?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page introuvable" }),
  ).toBeVisible();
});

test("plan du site : plus de pages par commune, communes citées sur l’accueil", async ({ page, request }) => {
  const plan = await (await request.get("/sitemap.xml")).text();
  expect(plan).not.toContain("/pare-brise-");
  expect((await request.get("/pare-brise-chenove")).status()).toBe(404);
  await page.goto("/");
  await expect(page.locator("#communes").getByText(/Nous intervenons à Dijon, Chenôve, .*Chevigny-Saint-Sauveur et alentours/)).toBeVisible();
});

test("référencement : titre principal, données Google et image de partage", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText(/pare-brise.*Dijon/i);
  const donnees = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  const types = donnees["@graph"].map((x: { "@type": string }) => x["@type"]);
  expect(types).toEqual(["AutoRepair", "FAQPage"]);
  const image = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(image).toMatch(/\/partage\.jpg$/);
  const fichier = await request.get("/partage.jpg");
  expect(fichier.status()).toBe(200);
  expect(fichier.headers()["content-type"]).toContain("image/jpeg");
});
