// Monitoramento dos sites e APIs da Valtrea, rodado pelo cron deste worker a cada 15 minutos.
// Sites (Vercel e Cloudflare) são vistos sempre; a API do Finance de hora em hora; as APIs no plano
// gratuito do Render a cada 6 horas, porque cada verificação acorda o servidor e gasta as horas grátis.
// Duas falhas seguidas mandam um e-mail; quando volta, outro e-mail. O estado fica na tabela status_checks (D1).
import type { Mail } from "@valtrea/core";

export type Frequencia = "15min" | "hora" | "6h";

export interface Servico {
  id: string;
  nome: string;
  url: string;
  frequencia: Frequencia;
  // APIs que dormem podem levar até 1 minuto para responder
  limiteMs: number;
}

export const SERVICOS: Servico[] = [
  { id: "site", nome: "Site Valtrea", url: "https://www.valtrea.com.br/health", frequencia: "15min", limiteMs: 15_000 },
  { id: "finance", nome: "Valtrea Finance", url: "https://finance.valtrea.com.br/", frequencia: "15min", limiteMs: 15_000 },
  { id: "finance-api", nome: "Valtrea Finance (API)", url: "https://api.valtrea.com.br/api/health", frequencia: "hora", limiteMs: 75_000 },
  { id: "agora", nome: "Valtrea Agora", url: "https://agora.valtrea.com.br/", frequencia: "15min", limiteMs: 15_000 },
  { id: "agora-api", nome: "Valtrea Agora (API)", url: "https://valtrea-agora-api.onrender.com/actuator/health", frequencia: "6h", limiteMs: 75_000 },
  { id: "pulso", nome: "Valtrea Pulso", url: "https://pulso.valtrea.com.br/", frequencia: "15min", limiteMs: 15_000 },
  { id: "pulso-api", nome: "Valtrea Pulso (API)", url: "https://valtrea-pulso-api.onrender.com/actuator/health", frequencia: "6h", limiteMs: 75_000 },
  { id: "volta", nome: "Valtrea Volta", url: "https://volta.valtrea.com.br/", frequencia: "15min", limiteMs: 15_000 },
  { id: "volta-api", nome: "Valtrea Volta (API)", url: "https://valtrea-volta-api.onrender.com/actuator/health", frequencia: "6h", limiteMs: 75_000 },
  { id: "pay-api", nome: "Valtrea Pay (API)", url: "https://valtrea-pay-api.onrender.com/actuator/health", frequencia: "6h", limiteMs: 75_000 },
];

const FALHAS_PARA_AVISAR = 2;

/** Quais serviços conferir nesta execução (o cron roda a cada 15 minutos). */
export function servicosDaVez(quando: Date, servicos: Servico[] = SERVICOS): Servico[] {
  const minuto = quando.getUTCMinutes();
  const hora = quando.getUTCHours();
  const primeiroQuarto = minuto < 15;
  return servicos.filter(
    (s) => s.frequencia === "15min" || (s.frequencia === "hora" && primeiroQuarto) || (s.frequencia === "6h" && primeiroQuarto && hora % 6 === 0),
  );
}

export interface Resultado {
  ok: boolean;
  status: number;
  ms: number;
}

export async function verificar(servico: Servico, buscar: typeof fetch = fetch): Promise<Resultado> {
  const inicio = Date.now();
  try {
    const resposta = await buscar(servico.url, {
      method: "GET",
      headers: { "user-agent": "valtrea-monitor/1.0" },
      signal: AbortSignal.timeout(servico.limiteMs),
      redirect: "follow",
    });
    return { ok: resposta.status < 400, status: resposta.status, ms: Date.now() - inicio };
  } catch {
    return { ok: false, status: 0, ms: Date.now() - inicio };
  }
}

export interface Estado {
  servico_id: string;
  ok: number;
  falhas: number;
  avisado: number;
  ultima_verificacao: number;
  ultimo_ok: number | null;
  ms: number;
  status: number;
}

export type Aviso = { tipo: "caiu" | "voltou"; servico: Servico; resultado: Resultado };

/** Novo estado depois de uma verificação e, se for o caso, o aviso a mandar. */
export function proximoEstado(anterior: Estado | null, servico: Servico, r: Resultado, agora: number): { estado: Estado; aviso: Aviso | null } {
  const falhas = r.ok ? 0 : (anterior?.falhas ?? 0) + 1;
  const jaAvisado = anterior?.avisado === 1;
  let aviso: Aviso | null = null;
  let avisado = jaAvisado ? 1 : 0;
  if (!r.ok && falhas >= FALHAS_PARA_AVISAR && !jaAvisado) {
    aviso = { tipo: "caiu", servico, resultado: r };
    avisado = 1;
  }
  if (r.ok && jaAvisado) {
    aviso = { tipo: "voltou", servico, resultado: r };
    avisado = 0;
  }
  return {
    estado: {
      servico_id: servico.id,
      ok: r.ok ? 1 : 0,
      falhas,
      avisado,
      ultima_verificacao: agora,
      ultimo_ok: r.ok ? agora : (anterior?.ultimo_ok ?? null),
      ms: r.ms,
      status: r.status,
    },
    aviso,
  };
}

export function emailDoAviso(aviso: Aviso, para: string): Mail {
  const { servico, resultado } = aviso;
  const caiu = aviso.tipo === "caiu";
  const motivo = resultado.status ? `respondeu ${resultado.status}` : `não respondeu em ${Math.round(resultado.ms / 1000)} s`;
  const subject = caiu ? `Fora do ar: ${servico.nome}` : `Voltou: ${servico.nome}`;
  const text = caiu
    ? `${servico.nome} ${motivo} em duas verificações seguidas.\n\nEndereço: ${servico.url}\nVeja o painel: https://www.valtrea.com.br/status`
    : `${servico.nome} voltou a responder (${resultado.status}, em ${resultado.ms} ms).\n\nVeja o painel: https://www.valtrea.com.br/status`;
  const html = `<p>${text.replace(/\n/g, "<br>")}</p>`;
  return { to: para, subject, text, html };
}

export const CRIAR_TABELA = `CREATE TABLE IF NOT EXISTS status_checks (
  servico_id TEXT PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL DEFAULT '',
  frequencia TEXT NOT NULL DEFAULT '15min',
  ok INTEGER NOT NULL,
  falhas INTEGER NOT NULL DEFAULT 0,
  avisado INTEGER NOT NULL DEFAULT 0,
  ultima_verificacao INTEGER NOT NULL,
  ultimo_ok INTEGER,
  ms INTEGER NOT NULL DEFAULT 0,
  status INTEGER NOT NULL DEFAULT 0
)`;

/** Uma rodada do monitor: confere os serviços da vez, guarda o estado e manda os avisos. */
export async function rodarMonitor(opcoes: {
  db: D1Database;
  enviar: (mail: Mail) => Promise<void>;
  para: string;
  quando: Date;
  buscar?: typeof fetch;
}): Promise<Aviso[]> {
  const { db, enviar, para, quando, buscar } = opcoes;
  await db.prepare(CRIAR_TABELA).run();
  const daVez = servicosDaVez(quando);
  const resultados = await Promise.all(daVez.map(async (s) => ({ servico: s, resultado: await verificar(s, buscar) })));
  const avisos: Aviso[] = [];
  for (const { servico, resultado } of resultados) {
    const anterior = await db.prepare("SELECT * FROM status_checks WHERE servico_id = ?").bind(servico.id).first<Estado>();
    const { estado, aviso } = proximoEstado(anterior, servico, resultado, quando.getTime());
    await db
      .prepare(
        `INSERT INTO status_checks (servico_id, ok, falhas, avisado, ultima_verificacao, ultimo_ok, ms, status, nome, frequencia)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(servico_id) DO UPDATE SET nome = excluded.nome, frequencia = excluded.frequencia, ok = excluded.ok, falhas = excluded.falhas, avisado = excluded.avisado,
           ultima_verificacao = excluded.ultima_verificacao, ultimo_ok = excluded.ultimo_ok, ms = excluded.ms, status = excluded.status`,
      )
      .bind(estado.servico_id, estado.ok, estado.falhas, estado.avisado, estado.ultima_verificacao, estado.ultimo_ok, estado.ms, estado.status, servico.nome, servico.frequencia)
      .run();
    if (aviso) {
      avisos.push(aviso);
      try {
        await enviar(emailDoAviso(aviso, para));
      } catch (erro) {
        console.error("monitor: falha ao mandar o aviso", erro);
      }
    }
  }
  return avisos;
}
