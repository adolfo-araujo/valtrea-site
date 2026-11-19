import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("valtrea-intro-seen", "1"));
});

test("answers a question typed in the home page", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Sua pergunta").fill("Quanto custa um site?");
  await page.getByRole("button", { name: "Enviar pergunta" }).click();

  const log = page.locator("[data-ask-log]");
  await expect(log).toContainText("proposta por escrito");
  await expect(log.getByRole("link", { name: /Continuar/ })).toBeVisible();
});

test("opens and closes the chat box", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir conversa" }).click();

  const box = page.getByRole("dialog");
  await expect(box).toBeVisible();
  await expect(box).toContainText("Oi! Aqui é o");
  await box.getByRole("button", { name: "Fechar conversa" }).click();
  await expect(box).toBeHidden();
});

test("start project goes to the contact page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Iniciar projeto" }).first().click();
  await expect(page).toHaveURL(/\/contato$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Me conta");
});

test("service link in the menu opens the right tab", async ({ page }) => {
  await page.goto("/#s-apps");
  await expect(page.getByRole("tab", { name: "Aplicativos" })).toHaveAttribute("aria-selected", "true");
});

test("process cube turns with the arrow keys", async ({ page }) => {
  await page.goto("/");
  const cube = page.locator("[data-cube]");
  await cube.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("[data-cube-live]")).toHaveText("Etapa 2 de 4: Arquitetura");
});

test("plays the intro once per session", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/intro/);
  await page.keyboard.press("Space");
  await expect(page.locator("html")).not.toHaveClass(/intro/, { timeout: 3000 });
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/intro/);
  await context.close();
});
