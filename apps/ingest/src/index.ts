import { Hono } from "hono";
import type { AppEnv } from "./app-env";
import { collectRoutes } from "./routes/collect";
import { healthRoutes } from "./routes/health";

import { DisabledMailer, ResendMailer } from "@valtrea/adapters";
import { rodarMonitor } from "./monitor";

const app = new Hono<AppEnv>().route("/", healthRoutes).route("/", collectRoutes);

export default {
  fetch: app.fetch,
  // Cron a cada 15 minutos (wrangler.jsonc): monitoramento dos sites e APIs (monitor.ts)
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    const mailer = env.RESEND_API_KEY ? new ResendMailer(env.RESEND_API_KEY, env.MAIL_FROM) : new DisabledMailer();
    ctx.waitUntil(
      rodarMonitor({
        db: env.DB,
        enviar: (mail) => mailer.send(mail),
        para: env.ALERT_EMAIL,
        quando: new Date(controller.scheduledTime),
      }),
    );
  },
} satisfies ExportedHandler<Env>;
