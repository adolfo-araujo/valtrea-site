# Valtrea · site

Site da Valtrea (sites, sistemas web e produtos digitais), com a mesma estrutura do projeto
[Devlytics](https://github.com/gabrueldev/devlytics), de Gabriel Rodrigues, distribuído sob a licença MIT.
O aviso de direitos autorais original está mantido em [LICENSE](LICENSE), como a licença exige.

## O que tem aqui

| Pasta | O que é |
| --- | --- |
| `apps/web` | O site (Astro): página principal (`/` e `/en/`) com perguntas respondidas na hora, conversa ao lado e "Fale com a gente" pelo WhatsApp; página de produtos (`/produtos` e `/en/products`) no estilo do projeto original; painel de estatísticas; café (Pix e cartão) e agradecimento |
| `apps/api` | API na Cloudflare: login com GitHub, painel, links rastreados e pagamento do café pela Cakto |
| `apps/ingest` | Recebe as visitas medidas pelo script `t.js` |
| `packages/tracker` | O script `t.js`, que mede as visitas sem cookies |
| `packages/core`, `adapters`, `db`, `shared` | Regras, integrações (Cloudflare D1, Analytics Engine, Resend, Cakto, GitHub) e banco |
| `docs/decisions` | Decisões de arquitetura do projeto original |

Antes de publicar, troque os dados marcados em [TROCAR-PARA-SEUS-DADOS.md](TROCAR-PARA-SEUS-DADOS.md).

## Rodar no computador

Precisa de Node 24 e pnpm.

```bash
pnpm install
pnpm --filter @valtrea/web dev
```

O site abre em http://localhost:4321. O painel e o café só funcionam depois de configurar a Cloudflare, o GitHub e a Cakto.

## Publicar na Cloudflare

1. Crie o banco e aplique as migrações:

   ```bash
   npx wrangler d1 create valtrea
   npx wrangler d1 migrations apply valtrea --remote --config apps/api/wrangler.jsonc
   ```

2. Troque os dados listados em [TROCAR-PARA-SEUS-DADOS.md](TROCAR-PARA-SEUS-DADOS.md) e grave os segredos (exemplo: `cd apps/api && npx wrangler secret put SESSION_SECRET`).

3. Gere e publique cada parte:

   ```bash
   pnpm build
   cd apps/ingest && npx wrangler deploy
   cd ../api && npx wrangler deploy
   cd ../web && npx wrangler deploy
   ```

## Créditos

- Ícones de marcas (HTML5, CSS, JavaScript, TypeScript, React, Node.js, Java, Kotlin, PostgreSQL, Vercel, WhatsApp, Instagram, TikTok, YouTube): [Simple Icons](https://simpleicons.org), licença CC0. As marcas pertencem aos seus donos.
- Layout e comportamento de algumas seções inspirados em sites de referência; código, textos, ilustrações e marcas das demonstrações são próprios da Valtrea.
- QR Code do Pix de teste: biblioteca `uqr`.
- Fotos de objetos da página `/fundador` (MacBook, iPhone, AirPods, café): enviadas pelo dono do site, que responde pelo uso delas.
