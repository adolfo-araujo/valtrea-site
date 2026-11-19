# Registro das operações de tratamento (ROPA) — Valtrea

Documento interno (LGPD, art. 37; registro simplificado da Resolução CD/ANPD nº 2/2022).
Não publicar. Atualizar sempre que o site ganhar um formulário, fornecedor ou script novo.

- **Controlador:** João Adolfo Martins Araújo (pessoa física), marca Valtrea, Rio de Janeiro/RJ
- **Canal do titular:** contato@valtrea.com.br (agente de pequeno porte, sem encarregado)
- **Última revisão:** 19/11/2026

| # | Operação | Dados | Titulares | Finalidade | Base legal | Onde fica | Compartilhado com | Retenção |
|---|----------|-------|-----------|-----------|-----------|-----------|-------------------|----------|
| 1 | Estatísticas de visita (`t.js` → ingest `/e`) | página, referência, `ref`, país, aparelho, navegador, eventos de clique, código de sessão (hash de IP+UA com sal diário descartado; IP não gravado) | visitantes | medir audiência e melhorar o site | legítimo interesse (art. 7º IX, art. 10) | Cloudflare Analytics Engine | Cloudflare (EUA) | ~3 meses (retenção do Analytics Engine) |
| 2 | Contato / orçamento (`/contato`, formulário da home, chat) | nome, e-mail, mensagem, respostas do chat | interessados | responder e preparar proposta | procedimentos preliminares (art. 7º V) | caixa de e-mail / WhatsApp do responsável (o site não grava) | Meta/WhatsApp, provedor de e-mail | até 24 meses sem contrato |
| 3 | Inscrição Valtrea Business (`/business`) | nome, WhatsApp, e-mail, rede social, cidade, plano, experiência, tempo, texto livre | candidatos | avaliar inscrição e contatar | consentimento (art. 7º I) + procedimentos preliminares (art. 7º V) | WhatsApp / e-mail do responsável | Meta/WhatsApp, provedor de e-mail | até 24 meses ou revogação |
| 4 | Apoio com café (`/cafe`) | nome, e-mail, celular, CPF, forma de pagamento; cartão tokenizado pela Cakto | apoiadores | cobrança, antifraude, reembolso | contrato (art. 7º V), obrigação legal (art. 7º II), proteção do crédito (art. 7º X) | API repassa à Cakto; D1 guarda só `order_id`, `paid_at`, `reversed_at` | Cakto, Cloudflare | prazos fiscais/consumo; demais dados na Cakto |
| 5 | Painel (`/painel`, login GitHub) | id GitHub, login, nome, e-mail, avatar; sites (nome, domínio); links rastreados (rótulo, 1ª abertura) | usuários do painel | dar acesso e mostrar estatísticas | contrato (art. 7º V) | Cloudflare D1 | GitHub, Cloudflare, Resend (aviso de link aberto) | enquanto a conta existir |
| 6 | Estatísticas de sites de terceiros (script instalado por usuários do painel) | mesmos dados da linha 1, de visitantes desses sites | visitantes de terceiros | gerar estatísticas para o cliente | Valtrea é **operadora**; base é do controlador (cliente) | Cloudflare Analytics Engine | Cloudflare | ~3 meses |
| 7 | Demos (`/demo/*`) | itens do carrinho, dados digitados no checkout de demo | visitantes | demonstrar o produto | — (nada sai do navegador além da mensagem de WhatsApp que o próprio visitante envia) | sessionStorage do navegador | Meta/WhatsApp (se o visitante enviar) | até fechar a aba |
| 8 | Fontes do site | IP do visitante | visitantes | carregar fontes | legítimo interesse (art. 7º IX) | — | Google Fonts (EUA) | conforme Google |

## Armazenamento no navegador

| Nome | Tipo | Finalidade | Duração |
|------|------|-----------|---------|
| `valtrea-intro-seen` | sessionStorage | não repetir a animação de abertura | aba |
| `valtrea-chat-greeted` | sessionStorage | não repetir o cumprimento do chat | aba |
| `valtrea-language-place` | sessionStorage | manter o ponto da página ao trocar de idioma | aba |
| `demo-bag:<marca>` | sessionStorage | carrinho das demos | aba |
| `dl_session` | cookie HttpOnly, Secure, SameSite=Lax | sessão do painel | 30 dias |
| `dl_oauth` | cookie Secure | proteção (state) do login GitHub | minutos |

Todos estritamente necessários: não exigem banner de consentimento.

## Operadores e transferência internacional (art. 33)

Cloudflare, Cakto, Google (Fonts), Meta (WhatsApp), provedor de e-mail, Resend, GitHub.
Pendente: guardar cópia dos termos/DPA de cada um (ver AUDITORIA-JURIDICA.md).
