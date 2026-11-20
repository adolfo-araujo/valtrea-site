import { describe, expect, it } from "vitest";
import { SERVICOS, emailDoAviso, proximoEstado, servicosDaVez, verificar } from "../src/monitor";

describe("monitoramento", () => {
  it("confere as APIs do Render só a cada 6 horas e a do Finance de hora em hora", () => {
    const ids = (iso: string) => servicosDaVez(new Date(iso)).map((s) => s.id);
    expect(ids("2026-11-20T00:05:00Z")).toContain("agora-api");
    expect(ids("2026-11-20T01:05:00Z")).not.toContain("agora-api");
    expect(ids("2026-11-20T01:05:00Z")).toContain("finance-api");
    expect(ids("2026-11-20T01:20:00Z")).toEqual(["site", "finance", "agora", "pulso", "volta"]);
  });

  it("avisa na segunda falha seguida e quando volta, uma vez só", () => {
    const servico = SERVICOS[0];
    let estado = null;
    const avisos: (string | null)[] = [];
    for (const ok of [false, false, false, true, true]) {
      const r = proximoEstado(estado, servico, { ok, status: ok ? 200 : 0, ms: 10 }, 1);
      estado = r.estado;
      avisos.push(r.aviso?.tipo ?? null);
    }
    expect(avisos).toEqual([null, "caiu", null, "voltou", null]);
  });

  it("trata erro de rede e status 5xx como fora do ar", async () => {
    const falha = (async () => {
      throw new Error("rede");
    }) as unknown as typeof fetch;
    const erro503 = (async () => new Response(null, { status: 503 })) as unknown as typeof fetch;
    expect((await verificar(SERVICOS[0], falha)).ok).toBe(false);
    expect((await verificar(SERVICOS[0], erro503)).ok).toBe(false);
  });

  it("monta o e-mail de aviso", () => {
    const mail = emailDoAviso({ tipo: "caiu", servico: SERVICOS[0], resultado: { ok: false, status: 502, ms: 300 } }, "contato@valtrea.com.br");
    expect(mail.subject).toBe("Fora do ar: Site Valtrea");
    expect(mail.text).toContain("respondeu 502");
  });
});
