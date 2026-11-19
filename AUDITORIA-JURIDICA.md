# Auditoria Jurídica — Site Valtrea (valtrea-site)

**Data:** 19/11/2026 · **Gerado com:** skill blindagem-juridica (versão 66c8cef) · **Modo:** corrigir

> ⚖️ Este relatório é uma auditoria técnica e **não constitui parecer jurídico**. Ele reduz
> riscos, mas não garante ausência de questionamentos. Termos de uso, política de privacidade e
> os pontos marcados como alto risco devem ser revisados por advogado(a).

## Placar

| # | Item | Antes | Depois | Observação |
|---|------|-------|--------|-----------|
| 1 | Política de privacidade | ❌ | ✅ | `/privacidade` e `/en/privacy`, feitas a partir do código real |
| 2 | Termos de uso | ❌ | ✅ | `/termos` e `/en/terms` (site, café, painel, condutas proibidas, foro) |
| 3 | Aviso de cookies | ⚠️ | ✅ | Só itens estritamente necessários; listados na política. Banner dispensado |
| 4 | Política de reembolso | ❌ | ✅ | Arrependimento de 7 dias (CDC art. 49) nos termos e no checkout do café |
| 5 | Formulários (LGPD) | ⚠️ | ✅ | Aviso + link em contato, home, chat, Business, café, painel e demos |
| 6 | Só dados necessários | ⚠️ | ⚠️ | CPF exigido pela Cakto, justificado no formulário e na política |
| 7 | Scripts de rastreamento | ⚠️ | ⚠️ | Analytics próprio sem cookies (OK). Google Fonts remoto ainda envia IP ao Google |
| 8 | Acessibilidade geral | ⚠️ | ✅ | Declaração em `/acessibilidade`; `lang`, skip link e reduced motion já existiam |
| 9 | Alt nas imagens | ✅ | ✅ | Sem achados |
| 10 | Contraste | ❌ | ⚠️ | Corrigido no site principal; restam selos das demos (congeladas) |
| 11 | Navegação por teclado | ⚠️ | ✅ | Foco visível no chat; painel já tinha borda + sombra no foco |
| 12 | Avaliações e depoimentos | ✅ | ✅ | Sem depoimentos falsos |
| 13 | Promessas e publicidade | ⚠️ | ✅ | Painel do fundador marcado como "Exemplo ilustrativo"; "frete grátis" só em marca fictícia |
| 14 | Direitos autorais | ⚠️ | ⚠️ | 20 imagens: confirmar origem (ver abaixo) |
| 15 | Dados da empresa | ❌ | ⚠️ | Nome, cidade e e-mail no rodapé de todas as páginas; falta CPF/CNPJ e endereço para a venda do café |
| 16 | Conformidade LGPD | ❌ | ✅ | Canal do titular, ROPA e plano de incidentes criados |
| 17 | Outros riscos | ⚠️ | ⚠️ | Preços de exemplo no `/business` (ver abaixo) |

Legenda: ✅ Conforme · ⚠️ Parcial · ❌ Não conforme · ➖ Não se aplica

**Riscos restantes mais importantes:**
1. 🟠 **Venda do café sem CPF/CNPJ e endereço visíveis** (Decreto 7.962/2013, art. 2º, I e II). Por decisão anterior, CPF e endereço não são publicados. Enquanto o café estiver ativo, o risco existe. Saídas: abrir MEI e publicar o CNPJ com um endereço comercial ou caixa postal, ou desativar o café até lá.
2. 🟡 **Google Fonts carregado do Google** (envia o IP do visitante a um terceiro nos EUA). Está declarado na política, mas o ideal é hospedar as fontes no próprio site (não foi possível baixar os arquivos neste ambiente).
3. 🟡 **Contraste nos selos das demos** (pet, cardápio, proposta, corrida), que você aprovou e pediu para não mexer.

## O que foi corrigido

### 1, 2, 4 e 8. Documentos
- **Problema:** o site coletava dados (contato, café com CPF, painel com login GitHub, analytics) sem política de privacidade, termos ou regras de reembolso — LGPD arts. 6º VI e 9º; CDC arts. 6º III e 49; Decreto 7.962/2013 art. 5º; LBI art. 63.
- **Correção:** todo o conteúdo fica em `apps/web/src/config/legal.ts` (pt e en), renderizado por `apps/web/src/components/site/LegalPage.astro`, com 6 páginas novas em `apps/web/src/pages/`: `privacidade`, `termos`, `acessibilidade`, `en/privacy`, `en/terms` e `en/accessibility`.

### 3 e 7. Cookies e rastreamento
- Confirmado no código: nenhum cookie de terceiros. O analytics (`t.js` → `apps/ingest`) é sem cookies, guarda um hash de sessão com sal diário e não grava o IP (`packages/adapters/src/analytics-engine/event-data-point.ts`).
- Os únicos itens no navegador são estritamente necessários, então um banner de consentimento não é obrigatório:
  - `sessionStorage`: intro, chat, idioma e carrinho das demos;
  - cookies `dl_session` e `dl_oauth`, só no painel.
- Todos estão listados na seção 4 da política.

### 5. Avisos nos formulários
- `components/site/ContactPage.astro`: link para a política.
- `components/site/SiteHome.astro`: aviso e link no formulário "contrate".
- Chat (`scripts/site/chat.ts`, `scripts/site/chat-data.ts`, `components/site/ChatWidget.astro`): aviso e link ao final da conversa.
- `pages/business.astro`: o consentimento agora cita a política e diz que pode ser retirado (art. 8º §5º). O checkbox continua desmarcado e obrigatório.
- `components/CoffeeCheckout.astro`: "Ao pagar…" com links para os termos e a política, mais o aviso de arrependimento de 7 dias.
- `components/Dashboard.astro`: aviso no login do painel.
- `components/demo/DemoFrame.astro`: aviso no checkout das demos.

### 10 e 11. Contraste e teclado
- `styles/tokens.css`: `--text-mute` passou de `#8a8b94` (3,08:1) para `#6b6c76` (≥ 4,5:1).
- `components/site/ChatWidget.astro`: o selo do chat passou de `#ff3b30` (3,55:1) para `#d92d20` (4,83:1). Também ganhou contorno de foco (`:focus-within`) na barra de mensagem e no formulário do chat.

### 15. Identificação
- Rodapés com nome, cidade, e-mail e links legais:
  - `components/site/SiteFooter.astro` (completo e compacto);
  - `components/Footer.astro` (produtos);
  - `components/demo/DemoFrame.astro` (todas as demos);
  - `pages/business.astro`, `pages/fundador.astro`, `pages/links.astro` e `pages/cartao.astro` (só links pequenos no rodapé, sem mudar o layout aprovado).

### 16. Governança
- Canal do titular em `contato@valtrea.com.br`, com resposta em até 15 dias, como agente de pequeno porte sem encarregado (Res. CD/ANPD 2/2022).
- `docs/lgpd/registro-de-operacoes.md`: registro das operações (ROPA, interno).
- `docs/lgpd/plano-de-resposta-a-incidentes.md`: plano de incidentes, com comunicação em 3 dias úteis (Res. CD/ANPD 15/2024).

## Documentos criados

| Documento | Arquivo | URL/rota | Linkado em |
|-----------|---------|----------|-----------|
| Política de Privacidade | `config/legal.ts` + `pages/privacidade.astro` | `/privacidade`, `/en/privacy` | todos os rodapés, contato, home, chat, Business, café, painel, demos |
| Termos de Uso (inclui reembolso do café) | `config/legal.ts` + `pages/termos.astro` | `/termos`, `/en/terms` | rodapés, café, painel |
| Declaração de Acessibilidade | `config/legal.ts` + `pages/acessibilidade.astro` | `/acessibilidade`, `/en/accessibility` | rodapé do site e das demos |
| ROPA (interno) | `docs/lgpd/registro-de-operacoes.md` | — | — |
| Plano de incidentes (interno) | `docs/lgpd/plano-de-resposta-a-incidentes.md` | — | — |

## O que depende de você

- [ ] 🟠 Antes de ativar o café: decidir entre abrir MEI e publicar CNPJ e endereço comercial/caixa postal (adicione em `config/company.ts` e no `legalIdentity` de `config/legal.ts`), ou manter o café desligado.
- [ ] 🟠 Em `/business` aparecem produtos e planos com preço e nome "a definir". Pelo CDC (art. 30), preço anunciado obriga. Troque pelos valores reais ou marque como exemplo antes de publicar.
- [ ] 🟡 Hospedar as fontes (Bricolage Grotesque, Poppins, Archivo, Inter…) dentro do site, ou aceitar o Google Fonts, que já está declarado na política.
- [ ] 🟡 Confirmar a origem das imagens:
  - `public/fundador/*.webp`: suas fotos? Precisa ter os direitos.
  - `public/previews/*.png`: prints dos seus próprios sites.
  - `public/brand/*`: logo próprio.
- [ ] 🟡 Guardar os termos/DPA de Cloudflare, Cakto, Resend e GitHub (prova do art. 33).
- [ ] 🔵 Opcional: corrigir o contraste dos selos das demos (`.p-slot`, `.c-badge--hot`, `.x-sr-badge`, `.r-bag b`, `.r-btn`, `.r-faq summary::after`). As cores sugeridas estão no resultado do scanner.
- [ ] 🔵 Criar no painel um botão "excluir minha conta". Hoje a exclusão é pedida por e-mail, o que é aceito, mas um botão é melhor.
- [ ] Revisão por advogado(a) da política, dos termos e do ponto do Decreto 7.962.

### Marcadores pendentes `[[PREENCHER]]`
Nenhum.

### Itens que exigem decisão (não alterados)
| Arquivo | Conteúdo | Por que é risco | Opções |
|---------|----------|-----------------|--------|
| `config/business.ts` | Produtos e planos com preço e "nome a definir" | Oferta com preço vincula (CDC art. 30) | Preencher com os reais / marcar "exemplo" / tirar o preço |
| demos (`pages/demo/*`) | Contraste de selos | WCAG 1.4.3 | Manter (marca fictícia) / aplicar as cores sugeridas |

### Falsos positivos do scanner (verificados)
- **cartao-sem-tokenizacao:** o cartão é tokenizado pelo SDK da Cakto (`createToken`) no navegador.
- **publico-infantil:** o sinal vem do próprio texto da política ("menores de 18").
- **foco-removido-css:** no chat, o foco agora aparece no contêiner (`:focus-within`); no painel, há borda e sombra.
- **termos sem identificação:** sem CNPJ por decisão do responsável (ver risco 1).

## Perfil e respostas (usado na próxima execução)

- **Tipo de negócio:** institucional de serviços de desenvolvimento, com produtos gratuitos, apoio pago (café), painel de analytics gratuito e demos fictícias.
- **Stack:** Astro 7 (apps/web), Hono em Cloudflare Workers (apps/api, apps/ingest), D1, Analytics Engine.
- **Responsável:** João Adolfo Martins Araújo, pessoa física, Rio de Janeiro/RJ, contato@valtrea.com.br. Sem CNPJ. **Não publicar CPF nem endereço** (decisão do responsável).
- **Encarregado/canal:** agente de pequeno porte, sem encarregado, canal contato@valtrea.com.br.
- **Público:** B2C e B2B no Brasil; sem menores; versão em inglês informativa.
- **Prazos:**
  - arrependimento do café: 7 dias;
  - resposta ao titular: 15 dias;
  - atendimento: 5 dias;
  - contatos sem contrato: 24 meses;
  - analytics: cerca de 3 meses.
- **Mapa de dados:** ver `docs/lgpd/registro-de-operacoes.md`.
- **Rastreadores:**
  - analytics próprio sem cookies (legítimo interesse);
  - Google Fonts (legítimo interesse, declarado);
  - nenhum de publicidade.
- **Decisões do usuário:**
  - demos, cartão e links aprovados e congelados (só links legais pequenos no rodapé);
  - painel do fundador com selo "Exemplo ilustrativo".

## Como manter
- Rode a skill de novo sempre que adicionar formulários, scripts de terceiros, fornecedores novos ou páginas de venda.
- Atualize `legalUpdated` em `config/legal.ts` sempre que mudar o tratamento de dados.
- Revise este relatório a cada 12 meses.
