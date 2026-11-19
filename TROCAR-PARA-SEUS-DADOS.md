# O que trocar para os seus dados

Tudo o que era do autor original (contas, chaves, domínio) foi tirado. No lugar ficaram marcadores que começam com `TROQUE-` ou o domínio provisório `novo.valtrea.com.br`. Para achar todos de uma vez, procure por `TROQUE-` e por `novo.valtrea.com.br` no projeto.

## 1. Dados da empresa (só texto, sem conta nenhuma)

| O quê | Onde | Hoje |
| --- | --- | --- |
| **Número do WhatsApp** (usado pelo "Fale com a gente", pela conversa ao lado, pelo "Chamar no WhatsApp" e pelo formulário de empresas) | `apps/web/src/config/company.ts` (`whatsapp`) | Vazio: enquanto estiver vazio, tudo abre um e-mail para contato@valtrea.com.br. Preencha só com números, com 55 e DDD, por exemplo `5521999999999` |
| Instagram, TikTok e YouTube | `apps/web/src/config/company.ts` (`instagram`, `tiktok`, `youtube`) | Instagram `adolfo.martins_` e TikTok `joaoadolfo` preenchidos; YouTube vazio (não aparece). Só o usuário, sem @ |
| **Seu nome, cargo e foto** (conversa ao lado e cartão de visita) | `apps/web/src/config/company.ts` (`person`) | Preenchido: "João Adolfo", "Fundador · Desenvolvedor full stack", sem foto (aparecem as iniciais). A foto vai em `apps/web/public/` e o caminho em `photo`, por exemplo `/brand/eu.jpg` |
| **Horário de atendimento** ("online agora" na conversa) | `apps/web/src/config/company.ts` (`hours`) | Provisório: segunda a sexta, das 9h às 18h. Fora desse horário aparece "responde a partir das 9h" |
| Produtos da vitrine, demonstrações e apps | `apps/web/src/config/showcase.ts` | Finance, Agora, Volta, Pulso, as 5 demonstrações e os apps Android "em breve" |
| **Valtrea Business** (produtos, preços, planos, porcentagens, frase do topo) | `apps/web/src/config/business.ts` | Planos com os preços da referência (R$ 47,08, R$ 134,33, 12x de R$ 50,75 ou R$ 492,35 no Pix). Produtos ainda provisórios ("Produto 1 · nome a definir") e frase do topo escrita por mim. A página tem `noindex` e não aparece no menu |
| **Página do fundador** (`/fundador`) | `apps/web/src/pages/fundador.astro` | Materiais provisórios ("Material 1 · nome a definir") e o texto "quem faz sou eu" escrito por mim como exemplo: **troque pela sua história**. Página com `noindex` |
| **Promessas da proposta de demonstração** (48h, R$ 60/ano de domínio, "menos de R$ 1.500", "no ar em até 24 horas úteis") | `apps/web/src/pages/demo/proposta.astro` | Valores iguais aos da referência: confirme se pode prometer isso antes de mostrar a página para alguém |
| E-mail, cidade, links dos produtos | `apps/web/src/config/company.ts` | contato@valtrea.com.br, Rio de Janeiro/RJ |
| Textos da página principal, da conversa e das respostas automáticas | `apps/web/src/i18n/site-pt.ts` e `site-en.ts` (as respostas ficam em `answers`: palavras-chave e texto) | Textos da Valtrea já escritos |
| Textos da página de produtos, do painel e do café | `apps/web/src/i18n/pt.ts` | Textos da Valtrea já escritos |
| Todos os textos em inglês | `apps/web/src/i18n/en.ts` | Tradução dos textos acima |
| Página de agradecimento do café | `apps/web/src/pages/obrigado.astro` | Já fala da Valtrea |
| Logo e ícones | `apps/web/public/brand/mark.png`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | V verde da Valtrea |
| Cor de destaque | `apps/web/src/styles/tokens.css` (`--brand`, `--brand-deep`, `--brand-rgb`, `--brand-tint`) | Verde Valtrea #387A1E |
| Nome no logo | `apps/web/src/components/Logo.astro` | val**trea** |

## 1.1 Páginas novas

| Página | Endereço | Observação |
| --- | --- | --- |
| Contato (formulário que abre o WhatsApp) | `/contato` e `/en/contact` | Sem número de WhatsApp, o botão vira "Enviar por e-mail" |
| Vitrine de projetos | `/projetos` e `/en/projects` | O item "Projetos" do menu leva para cá; `/produtos` continua no rodapé |
| Valtrea Business | `/business` | `noindex`, fora do menu |
| Links (estilo Linktree) | `/links` | Link do rodapé, em "Mais" |
| Cartão de visita digital | `/cartao` | Verso com "O que eu construo", compromissos e contatos de `company.ts` (o WhatsApp aparece sozinho quando você preencher o número). As prévias dos sites usam as imagens de `apps/web/public/previews/` |
| Demonstrações | `/demo/cardapio`, `/demo/pet`, `/demo/corrida`, `/demo/achados`, `/demo/proposta` | Marcas e produtos fictícios, com aviso no topo e `noindex`. Ao finalizar, aparece o pedido para conferir e o botão abre o WhatsApp com a mensagem pronta (sem número cadastrado, o WhatsApp pede para escolher o contato) |
| Privacidade, Termos e Acessibilidade (LGPD) | `/privacidade`, `/termos`, `/acessibilidade` e `/en/privacy`, `/en/terms`, `/en/accessibility` | Todo o texto fica em `apps/web/src/config/legal.ts`. Ao mudar formulário, fornecedor ou script, atualize o texto e a data (`legalUpdated`). Detalhes em `AUDITORIA-JURIDICA.md` e `docs/lgpd/` |
| Fotos reais nas demonstrações (opcional) | `apps/web/public/demo/corrida/`, `apps/web/public/demo/pet/`, `apps/web/public/demo/cardapio/` | Cada pasta tem um `LEIA-ME.txt` com os nomes de arquivo. Colocou a foto com o nome certo, ela entra no lugar da ilustração |

### Prévias dos sites no cartão de visita

O cartão (`/cartao`) mostra a mesma imagem que aparece quando o link é mandado no WhatsApp. Elas já vêm prontas em `apps/web/public/previews/` (Finance, Agora, Volta, Pulso e o site da Valtrea copiados dos próprios apps; as 5 demonstrações feitas para este projeto). Cada demonstração também usa a sua imagem como prévia de link.

Para trocar uma prévia, substitua o arquivo `.png` com o mesmo nome (1200 × 630). O script `pnpm previews` continua disponível se quiser gerar prints de tela no lugar.

A animação de abertura da página inicial aparece uma vez por sessão. Para ver de novo, abra uma aba anônima.

## 2. Endereço do site

| O quê | Onde | Hoje |
| --- | --- | --- |
| Domínio do site | `apps/web/astro.config.ts`, `apps/web/src/layouts/Layout.astro`, `apps/web/src/components/InstallTag.astro`, `apps/web/src/config/coffee.ts`, `apps/api/wrangler.jsonc`, `apps/ingest/wrangler.jsonc`, `apps/api/src/middleware/checkout-cors.ts` | `www.valtrea.com.br` (principal; `valtrea.com.br` e `novo.valtrea.com.br` continuam respondendo) |
| Domínio cujos números aparecem na demonstração ao vivo | `apps/api/wrangler.jsonc` (`DEMO_DOMAIN`) | `novo.valtrea.com.br` |
| Endereço de testes da Cloudflare | `apps/api/src/middleware/checkout-cors.ts` | `valtrea-web.SEU-SUBDOMINIO.workers.dev` |

**Atenção:** este projeto roda inteiro na Cloudflare, e as rotas exigem que o domínio `valtrea.com.br` esteja configurado lá (`zone_name`). Hoje o DNS do domínio fica no Registro.br e os outros produtos (Finance, Agora, Volta, Pulso, Pay) estão na Vercel e na Render. Passar o DNS para a Cloudflare é possível, mas todos os registros precisam ser recriados lá antes, ou os outros sites saem do ar.

## 3. Contas e chaves (cada uma você cria na sua conta)

Os valores públicos ficam nos arquivos `wrangler.jsonc`. Os secretos nunca vão para o código: você grava com `npx wrangler secret put NOME` dentro da pasta do app.

| O quê | Onde | Tipo | Onde conseguir |
| --- | --- | --- | --- |
| ID da conta Cloudflare | `apps/api/wrangler.jsonc` (`CF_ACCOUNT_ID`) | Público | Painel da Cloudflare, na barra lateral |
| ID do banco D1 | `apps/api/wrangler.jsonc` e `apps/ingest/wrangler.jsonc` (`database_id`) | Público | Resultado de `npx wrangler d1 create valtrea` |
| Token para ler as estatísticas | `CF_ANALYTICS_TOKEN` (api) | Secreto | Cloudflare → API Tokens, com permissão de leitura do Account Analytics |
| App de login do GitHub (painel) | `apps/api/wrangler.jsonc` (`GITHUB_CLIENT_ID`) e `GITHUB_CLIENT_SECRET` | Público e secreto | GitHub → Settings → Developer settings → OAuth Apps. Callback: `https://SEU-DOMINIO/api/auth/github/callback` |
| Segredo das sessões do painel | `SESSION_SECRET` (api) | Secreto | Gere um texto aleatório longo no gerenciador de senhas |
| Sal diário das visitas | `DAILY_SALT_SEED` (ingest) | Secreto | Gere um texto aleatório longo |
| E-mail de aviso de link aberto | `apps/ingest/wrangler.jsonc` (`MAIL_FROM`) e `RESEND_API_KEY` (ingest) | Público e secreto | Resend, com o domínio valtrea.com.br verificado |
| Pagamento do café (Pix e cartão) | `apps/api/wrangler.jsonc` (`CAKTO_CLIENT_ID`, `COFFEE_OFFER_ID`), `apps/web/src/config/coffee.ts` (`caktoSdkClientId`), `CAKTO_CLIENT_SECRET` e `CAKTO_WEBHOOK_SECRET` (api) | Público e secreto | Conta na Cakto, com uma oferta criada para o café |

## 4. Café (apoio com Pix e cartão)

- O preço está em `apps/web/src/config/coffee.ts` (`coffeePriceCents = 1261`, ou seja R$ 12,61) e nos textos `free.coffee.price`, `checkout.price` e `checkout.payCard` dos dois idiomas. O valor precisa bater com a oferta criada na Cakto.
- Para receber pagamentos, a Cakto pede seus dados de cadastro e uma conta para os repasses. Com o CNPJ aberto, o recebimento fica no nome da empresa.
- A tela de pagamento pede nome, e-mail, celular e CPF (exigência do processador). Antes de ativar, o site precisa de uma política de privacidade que explique isso (LGPD). Hoje o link "Segurança" do rodapé só leva à seção da página inicial.
- Se não quiser cobrar nada agora, dá para tirar a seção do café da página inicial em `apps/web/src/components/Home.astro`.

## 5. Opcionais

- **Fontes:** o projeto carrega Bricolage Grotesque e Poppins do Google Fonts (`Layout.astro`), o que envia o endereço IP de quem visita para o Google. Os outros sites da Valtrea servem as fontes do próprio endereço; dá para fazer o mesmo aqui.
- **Testes automáticos:** `.github/workflows/ci.yml` roda no GitHub Actions, que está parado por cobrança na sua conta.
- **Painel:** é a ferramenta de estatísticas do projeto original (visitas por seção e por produto, de onde vêm, links rastreados), agora para os sites da Valtrea. Ele fica em `/painel` e não aparece no menu; o botão do topo agora pede orçamento por e-mail.
