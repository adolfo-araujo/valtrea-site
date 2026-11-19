import { isSignedByCakto, parseCaktoWebhook, sameText } from "@valtrea/adapters";
import { Hono } from "hono";
import type { AppEnv } from "../app-env";
import { buildContainer } from "../container";
import { publicRead } from "../middleware/public-read";

const maxBodyBytes = 64 * 1024;

export const coffeeRoutes = new Hono<AppEnv>()
  .get("/coffees", publicRead(60), async (c) => c.json({ count: await buildContainer(c.env).countCoffees() }))
  .post("/webhooks/cakto", async (c) => {
    const secret = c.env.CAKTO_WEBHOOK_SECRET;
    if (!secret) return c.body(null, 503);

    const body = await c.req.text();
    if (body.length > maxBodyBytes) return c.body(null, 413);

    const now = new Date();
    const webhook = parseCaktoWebhook(body, now);
    if (webhook === null) {
      console.warn("Cakto webhook ignored: unexpected payload");
      return c.body(null, 400);
    }

    const signature = c.req.header("x-cakto-signature") ?? null;
    const trusted =
      sameText(webhook.secret, secret) ||
      (signature !== null &&
        (await isSignedByCakto(
          { body, timestamp: c.req.header("x-cakto-timestamp") ?? null, signature },
          secret,
          now,
        )));
    if (!trusted) {
      console.warn("Cakto webhook ignored: secret or signature did not match", { signed: signature !== null });
      return c.body(null, 401);
    }

    await buildContainer(c.env).recordCoffeePayments(webhook.payments);
    console.log("Cakto webhook recorded", { payments: webhook.payments.map((payment) => payment.kind) });
    return c.body(null, 200);
  });
