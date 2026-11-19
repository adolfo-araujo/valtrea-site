import { cors } from "hono/cors";

const productSiteOrigins = [
  "https://www.valtrea.com.br",
  "https://valtrea.com.br",
  "https://novo.valtrea.com.br",
  "https://valtrea-web.valtrea.workers.dev",
];

export const checkoutCors = cors({ origin: productSiteOrigins, allowMethods: ["GET", "POST"] });
