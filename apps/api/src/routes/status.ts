import { Hono } from "hono";
import type { AppEnv } from "../app-env";

// GET /api/status: última verificação de cada site e API, feita pelo monitor do valtrea-ingest (src/monitor.ts)
export const statusRoutes = new Hono<AppEnv>().get("/status", async (c) => {
  c.header("cache-control", "public, max-age=60");
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT servico_id AS id, nome, frequencia, ok, ultima_verificacao, ultimo_ok, ms FROM status_checks ORDER BY rowid",
    ).all();
    return c.json({ servicos: results });
  } catch {
    // tabela ainda não criada: o monitor cria na primeira rodada
    return c.json({ servicos: [] });
  }
});
