import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const base = process.env.SITE_URL ?? "http://localhost:4321";
const pages = [
  ["finance", "https://finance.valtrea.com.br"],
  ["agora", "https://agora.valtrea.com.br"],
  ["volta", "https://volta.valtrea.com.br"],
  ["pulso", "https://pulso.valtrea.com.br"],
  ["valtrea", `${base}/`],
  ["cardapio", `${base}/demo/cardapio`],
  ["pet", `${base}/demo/pet`],
  ["corrida", `${base}/demo/corrida`],
  ["achados", `${base}/demo/achados`],
  ["proposta", `${base}/demo/proposta`],
];

await mkdir(new URL("../public/previews/", import.meta.url), { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
await context.addInitScript(() => sessionStorage.setItem("valtrea-intro-seen", "1"));
const page = await context.newPage();

for (const [id, url] of pages) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: fileURLToPath(new URL(`../public/previews/${id}.jpg`, import.meta.url)), type: "jpeg", quality: 72 });
    console.log(`ok   ${id}`);
  } catch (error) {
    console.log(`erro ${id}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

await browser.close();
