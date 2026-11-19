import type { Locale } from "../i18n";
import { company } from "./company";

export type LegalDoc = "privacy" | "terms" | "accessibility";

export type LegalBlock = string | { list: string[] };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalPageContent {
  title: string;
  description: string;
  eyebrow: string;
  updated: string;
  intro: string;
  toc: string;
  sections: LegalSection[];
}

export const legalOwner = {
  fullName: "João Adolfo Martins Araújo",
  kind: { pt: "pessoa física", en: "individual" },
};

export const legalUpdated = { pt: "19 de novembro de 2026", en: "November 19, 2026" };

const legalPaths: Record<Locale, Record<LegalDoc, string>> = {
  pt: { privacy: "/privacidade", terms: "/termos", accessibility: "/acessibilidade" },
  en: { privacy: "/en/privacy", terms: "/en/terms", accessibility: "/en/accessibility" },
};

export const legalPath = (locale: Locale, doc: LegalDoc) => legalPaths[locale][doc];

export const legalLabels: Record<Locale, Record<LegalDoc, string> & { title: string; privacyPolicy: string }> = {
  pt: { title: "Legal", privacy: "Privacidade", terms: "Termos de uso", accessibility: "Acessibilidade", privacyPolicy: "Política de Privacidade" },
  en: { title: "Legal", privacy: "Privacy", terms: "Terms of use", accessibility: "Accessibility", privacyPolicy: "Privacy Policy" },
};

export const legalIdentity = (locale: Locale) =>
  `${company.name} · ${legalOwner.fullName} (${legalOwner.kind[locale]}) · ${locale === "pt" ? company.city : "Rio de Janeiro, Brazil"} · ${company.email}`;

const mail = `<a href="mailto:${company.email}">${company.email}</a>`;
const link = (href: string, label: string) => `<a href="${href}">${label}</a>`;

const privacyPt: LegalPageContent = {
  title: "Política de Privacidade",
  description: "Como a Valtrea trata dados pessoais: o que coletamos, para quê, com quem compartilhamos, por quanto tempo e como você exerce os seus direitos pela LGPD.",
  eyebrow: "LGPD · Lei 13.709/2018",
  updated: legalUpdated.pt,
  intro: `Esta política explica, em linguagem direta, quais dados pessoais passam pelo site ${company.domain}, pelos seus formulários, pelo apoio com café e pelo painel de estatísticas, e o que você pode fazer a respeito. Ela descreve o que o site realmente faz hoje.`,
  toc: "Nesta página",
  sections: [
    {
      id: "quem-somos",
      title: "1. Quem é o responsável",
      blocks: [
        `A Valtrea é a marca de ${legalOwner.fullName}, ${legalOwner.kind.pt}, desenvolvedor com atuação em ${company.city}. Ele é o <strong>controlador</strong> dos dados pessoais descritos aqui, ou seja, quem decide como e por que eles são tratados.`,
        `Canal para qualquer assunto de privacidade: ${mail}.`,
      ],
    },
    {
      id: "resumo",
      title: "2. Resumo",
      blocks: [
        {
          list: [
            "Não usamos cookies de publicidade nem rastreadores de terceiros (Google Analytics, Meta Pixel e parecidos).",
            "As estatísticas de visita são próprias, sem cookies, e não gravam o seu endereço IP.",
            "Os formulários de contato, orçamento, chat e inscrição não guardam nada no nosso servidor: eles montam uma mensagem que <em>você</em> decide enviar pelo WhatsApp ou por e-mail.",
            "No apoio com café, os dados do cartão vão direto para a processadora de pagamento (Cakto) e nunca passam pelo nosso servidor.",
            "Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo e-mail acima.",
          ],
        },
      ],
    },
    {
      id: "dados",
      title: "3. Quais dados tratamos, para quê e com qual base legal",
      blocks: [
        "<strong>3.1 Visita ao site (estatísticas próprias).</strong> Quando você abre uma página, registramos: a página visitada, o site de origem (referência e parâmetro <code>ref</code>), o país aproximado (informado pela rede da Cloudflare), o tipo de aparelho e o navegador, e cliques em alguns botões (por exemplo, \"abrir chat\" ou \"ver projeto\"). Para contar visitas sem cookies, criamos um código de sessão a partir do endereço IP e do navegador, misturados com uma chave que muda todo dia e é descartada. O IP em si não é gravado, e o código não permite identificar você nem ligar visitas de dias diferentes.",
        "Finalidade: saber quais páginas funcionam e melhorar o site. Base legal: legítimo interesse (LGPD, art. 7º, IX, e art. 10), com dados mínimos e sem perfil individual. Você pode se opor pelo e-mail ou bloquear o script <code>www.valtrea.com.br/t.js</code> no seu navegador; o site continua funcionando.",
        "<strong>3.2 Contato, orçamento, chat e inscrição no Business.</strong> Esses formulários pedem dados como nome, e-mail, WhatsApp, empresa, cidade, rede social e a mensagem que você escreve. Eles não enviam nada ao nosso servidor: ao tocar em enviar, abrem o WhatsApp ou o seu aplicativo de e-mail com a mensagem pronta, e você decide se manda. Recebemos os dados só quando a mensagem chega.",
        "Finalidade: responder, preparar proposta e avaliar inscrições. Base legal: procedimentos preliminares a um contrato, a seu pedido (art. 7º, V). Na inscrição do Business pedimos também a sua autorização expressa (art. 7º, I), que você pode retirar a qualquer momento.",
        "<strong>3.3 Apoio com um café (pagamento).</strong> Para processar o pagamento pedimos nome completo, e-mail, celular e CPF, e a forma de pagamento (Pix ou cartão). O CPF é exigido pela processadora de pagamento para emitir a cobrança e prevenir fraude. Os dados do cartão são digitados em campos que a Cakto transforma em um código (token) dentro do seu navegador; o número do cartão nunca chega ao nosso servidor. No nosso banco de dados guardamos somente o número do pedido, a data do pagamento e, se houver, a data do estorno.",
        "Finalidade: cobrar, confirmar o pagamento, prevenir fraude e atender pedidos de reembolso. Base legal: execução de contrato (art. 7º, V), cumprimento de obrigação legal ou regulatória (art. 7º, II) e proteção do crédito (art. 7º, X).",
        "<strong>3.4 Painel de estatísticas (login com GitHub).</strong> Quem entra no painel usa a conta do GitHub. Recebemos o identificador da conta, nome, login, e-mail e foto de perfil, e guardamos os sites que você cadastra (nome e domínio) e os links rastreados que você cria (rótulo e data da primeira abertura). Quando um link rastreado é aberto pela primeira vez, enviamos um aviso para o seu e-mail. Não temos acesso aos seus repositórios.",
        "Finalidade: dar acesso ao painel e mostrar as estatísticas dos seus sites. Base legal: execução de contrato (art. 7º, V).",
        "<strong>3.5 Se você instala o nosso script no seu site.</strong> Nesse caso, você é o controlador dos dados dos seus visitantes e a Valtrea atua como operadora, tratando esses dados só para gerar as suas estatísticas. Cabe a você informar isso na política de privacidade do seu site.",
        "<strong>3.6 Demonstrações.</strong> As lojas de exemplo em <code>/demo</code> usam marcas fictícias. O carrinho fica só no seu navegador e o \"finalizar pedido\" abre uma mensagem de WhatsApp; nada é cobrado nem gravado no nosso servidor.",
      ],
    },
    {
      id: "cookies",
      title: "4. Cookies e armazenamento no navegador",
      blocks: [
        "O site não usa cookies de rastreamento, de publicidade ou de terceiros. Usamos apenas itens estritamente necessários, que não dependem de consentimento:",
        {
          list: [
            "<code>valtrea-intro-seen</code>, <code>valtrea-chat-greeted</code> e <code>valtrea-language-place</code> (armazenamento da aba, sessionStorage): lembram se a animação de abertura já apareceu, se o chat já cumprimentou você e o ponto da página ao trocar de idioma. Somem quando a aba é fechada.",
            "<code>demo-bag:&lt;marca&gt;</code> (sessionStorage): guarda o carrinho das lojas de demonstração. Some quando a aba é fechada.",
            "<code>dl_session</code> (cookie, só no painel): mantém você conectado por até 30 dias. É HttpOnly e só funciona em conexão segura.",
            "<code>dl_oauth</code> (cookie, só no login): protege o retorno do login com o GitHub contra fraude e dura poucos minutos.",
          ],
        },
        "Na página de pagamento, a Cakto e o seu banco podem usar tecnologias próprias de antifraude e de verificação do cartão (3-D Secure), de acordo com as políticas deles.",
      ],
    },
    {
      id: "compartilhamento",
      title: "5. Com quem compartilhamos",
      blocks: [
        "Não vendemos nem alugamos dados pessoais. Compartilhamos apenas com os fornecedores necessários para o site funcionar, cada um para a finalidade indicada:",
        {
          list: [
            "<strong>Cloudflare</strong>: hospedagem do site, banco de dados e estatísticas de visita.",
            "<strong>Cakto</strong>: processamento do pagamento do café (Pix e cartão), antifraude e estornos.",
            "<strong>Google Fonts</strong>: entrega das fontes do site; ao baixar uma fonte, o Google recebe o endereço IP do seu aparelho.",
            "<strong>Meta (WhatsApp)</strong>: quando você escolhe falar pelo WhatsApp.",
            "<strong>Provedor de e-mail</strong>: quando você escreve para o nosso e-mail.",
            "<strong>Resend</strong>: envio dos avisos por e-mail do painel.",
            "<strong>GitHub</strong>: login no painel.",
          ],
        },
        "Também podemos compartilhar dados quando a lei ou uma ordem de autoridade competente exigir.",
      ],
    },
    {
      id: "transferencia",
      title: "6. Transferência internacional",
      blocks: [
        "Alguns desses fornecedores (como Cloudflare, Google, Meta, GitHub e Resend) processam dados fora do Brasil, principalmente nos Estados Unidos. Essa transferência é feita nos termos do art. 33 da LGPD, com base nas garantias e cláusulas de proteção de dados que esses fornecedores oferecem.",
      ],
    },
    {
      id: "prazos",
      title: "7. Por quanto tempo guardamos",
      blocks: [
        {
          list: [
            "Estatísticas de visita: cerca de 3 meses, depois são apagadas automaticamente.",
            "Conversas de contato e orçamento sem contratação: até 24 meses após a última mensagem.",
            "Clientes: durante o contrato e, depois, pelo prazo necessário para cumprir obrigações legais e para defesa em eventual processo.",
            "Inscrições no Business: até 24 meses, ou até você pedir a exclusão.",
            "Pagamentos do café: número do pedido e datas pelo prazo exigido pelas regras fiscais e de consumo; os demais dados ficam com a Cakto, conforme a política dela.",
            "Conta do painel: enquanto a conta existir. Ao excluir a conta, apagamos os seus sites e links.",
          ],
        },
      ],
    },
    {
      id: "seguranca",
      title: "8. Segurança",
      blocks: [
        "Usamos conexão criptografada (HTTPS) em todo o site, não gravamos IP nas estatísticas, o cartão nunca passa pelo nosso servidor e o acesso aos dados é restrito ao responsável (LGPD, art. 46). Se acontecer um incidente de segurança que possa causar risco ou dano relevante a você, comunicaremos a Autoridade Nacional de Proteção de Dados (ANPD) e as pessoas afetadas, como exige o art. 48 da LGPD.",
      ],
    },
    {
      id: "direitos",
      title: "9. Seus direitos",
      blocks: [
        "Pela LGPD (art. 18), você pode pedir a qualquer momento:",
        {
          list: [
            "confirmação de que tratamos dados seus e acesso a eles;",
            "correção de dados incompletos, inexatos ou desatualizados;",
            "anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desacordo com a lei;",
            "portabilidade dos dados a outro fornecedor;",
            "eliminação dos dados tratados com o seu consentimento e informação sobre a possibilidade de não consentir;",
            "informação sobre com quem compartilhamos os seus dados;",
            "revogação do consentimento e oposição a um tratamento feito com base em outra hipótese legal.",
          ],
        },
        `Para exercer os seus direitos, escreva para ${mail}. Podemos pedir uma confirmação simples de identidade para proteger você. Respondemos em até 15 dias. Se não ficar satisfeito, você também pode reclamar à ANPD (gov.br/anpd).`,
      ],
    },
    {
      id: "menores",
      title: "10. Crianças e adolescentes",
      blocks: [
        "O site e o painel não são direcionados a menores de 18 anos. Se descobrirmos que recebemos dados de um menor sem a autorização de um responsável, vamos apagá-los.",
      ],
    },
    {
      id: "encarregado",
      title: "11. Encarregado (DPO)",
      blocks: [
        `Como agente de tratamento de pequeno porte, a Valtrea está dispensada de indicar encarregado (Resolução CD/ANPD nº 2/2022) e mantém um canal direto para os titulares: ${mail}.`,
      ],
    },
    {
      id: "mudancas",
      title: "12. Mudanças nesta política",
      blocks: [
        "Quando mudarmos a forma de tratar dados, atualizaremos esta página e a data no topo. Mudanças importantes serão destacadas no site.",
        `Veja também os ${link(legalPaths.pt.terms, "Termos de uso")} e a ${link(legalPaths.pt.accessibility, "Declaração de acessibilidade")}.`,
      ],
    },
  ],
};

const privacyEn: LegalPageContent = {
  title: "Privacy Policy",
  description: "How Valtrea handles personal data: what we collect, why, who we share it with, how long we keep it and how to exercise your rights under Brazil's LGPD.",
  eyebrow: "LGPD · Law 13,709/2018",
  updated: legalUpdated.en,
  intro: `This policy explains in plain language which personal data goes through ${company.domain}, its forms, the coffee support checkout and the analytics dashboard, and what you can do about it. It describes what the site actually does today. The Portuguese version prevails in case of doubt.`,
  toc: "On this page",
  sections: [
    {
      id: "who",
      title: "1. Who is responsible",
      blocks: [
        `Valtrea is the brand of ${legalOwner.fullName}, an ${legalOwner.kind.en} and developer based in Rio de Janeiro, Brazil. He is the <strong>controller</strong> of the personal data described here.`,
        `Contact for any privacy matter: ${mail}.`,
      ],
    },
    {
      id: "summary",
      title: "2. Summary",
      blocks: [
        {
          list: [
            "No advertising cookies and no third-party trackers (Google Analytics, Meta Pixel and the like).",
            "Visit statistics are our own, cookieless, and do not store your IP address.",
            "Contact, quote, chat and application forms store nothing on our server: they build a message that <em>you</em> choose to send by WhatsApp or e-mail.",
            "For coffee support, card details go straight to the payment processor (Cakto) and never touch our server.",
            "You can ask for access, correction or deletion of your data at any time at the e-mail above.",
          ],
        },
      ],
    },
    {
      id: "data",
      title: "3. What we process, why and on which legal basis",
      blocks: [
        "<strong>3.1 Visiting the site (own analytics).</strong> When you open a page we record the page, where you came from (referrer and <code>ref</code> parameter), approximate country (provided by Cloudflare's network), device type and browser, and clicks on some buttons. To count visits without cookies we derive a session code from your IP address and browser mixed with a key that changes every day and is thrown away. The IP itself is not stored, and the code cannot identify you or link visits across days.",
        "Purpose: learn which pages work and improve the site. Legal basis: legitimate interest (LGPD art. 7, IX and art. 10). You can object by e-mail or block <code>www.valtrea.com.br/t.js</code> in your browser; the site keeps working.",
        "<strong>3.2 Contact, quote, chat and Business application.</strong> These forms ask for things like name, e-mail, WhatsApp, company, city, social profile and your message. Nothing is sent to our server: pressing send opens WhatsApp or your e-mail app with the message ready, and you decide whether to send it.",
        "Purpose: reply, prepare a proposal and review applications. Legal basis: steps prior to a contract at your request (art. 7, V); for Business applications we also ask for your explicit consent (art. 7, I), which you can withdraw at any time.",
        "<strong>3.3 Coffee support (payment).</strong> We ask for full name, e-mail, phone and CPF (Brazilian tax ID, required by the payment processor) and the payment method. Card details are tokenized by Cakto inside your browser and never reach our server. Our database keeps only the order number, payment date and refund date, if any.",
        "Purpose: charge, confirm payment, prevent fraud and handle refunds. Legal basis: performance of a contract (art. 7, V), legal obligation (art. 7, II) and credit protection (art. 7, X).",
        "<strong>3.4 Analytics dashboard (GitHub sign-in).</strong> We receive your GitHub account id, name, login, e-mail and avatar, and keep the sites you add (name and domain) and the tracked links you create (label and first-open date). When a tracked link is first opened we e-mail you. We have no access to your repositories. Legal basis: performance of a contract (art. 7, V).",
        "<strong>3.5 If you install our script on your site,</strong> you are the controller of your visitors' data and Valtrea acts as your processor, only to produce your statistics. Please mention it in your own privacy policy.",
        "<strong>3.6 Demos.</strong> The sample stores under <code>/demo</code> use fictional brands. The cart lives only in your browser and checkout opens a WhatsApp message; nothing is charged or stored on our server.",
      ],
    },
    {
      id: "cookies",
      title: "4. Cookies and browser storage",
      blocks: [
        "No tracking, advertising or third-party cookies. Only strictly necessary items, which do not require consent:",
        {
          list: [
            "<code>valtrea-intro-seen</code>, <code>valtrea-chat-greeted</code>, <code>valtrea-language-place</code> (tab storage): remember the intro animation, the chat greeting and your scroll position when switching language. Cleared when the tab closes.",
            "<code>demo-bag:&lt;brand&gt;</code> (tab storage): the demo stores' cart. Cleared when the tab closes.",
            "<code>dl_session</code> (cookie, dashboard only): keeps you signed in for up to 30 days. HttpOnly, secure connections only.",
            "<code>dl_oauth</code> (cookie, sign-in only): protects the GitHub sign-in round trip and lasts a few minutes.",
          ],
        },
        "On the payment page, Cakto and your bank may use their own anti-fraud and card verification (3-D Secure) technologies under their own policies.",
      ],
    },
    {
      id: "sharing",
      title: "5. Who we share data with",
      blocks: [
        "We never sell or rent personal data. We share it only with the providers needed to run the site: Cloudflare (hosting, database, analytics), Cakto (payments), Google Fonts (web fonts; Google receives your device's IP address), Meta/WhatsApp (when you choose it), our e-mail provider, Resend (dashboard e-mails) and GitHub (sign-in). We may also disclose data when required by law or by a competent authority.",
      ],
    },
    {
      id: "transfer",
      title: "6. International transfer",
      blocks: [
        "Some of these providers (such as Cloudflare, Google, Meta, GitHub and Resend) process data outside Brazil, mainly in the United States, under LGPD art. 33 and the data protection safeguards and clauses those providers offer.",
      ],
    },
    {
      id: "retention",
      title: "7. How long we keep data",
      blocks: [
        {
          list: [
            "Visit statistics: about 3 months, then deleted automatically.",
            "Contact and quote conversations without a contract: up to 24 months after the last message.",
            "Clients: for the contract and then as long as needed for legal obligations and defense in legal proceedings.",
            "Business applications: up to 24 months or until you ask for deletion.",
            "Coffee payments: order number and dates for as long as tax and consumer rules require; other data stays with Cakto under its policy.",
            "Dashboard account: while the account exists. Deleting the account deletes your sites and links.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "8. Security",
      blocks: [
        "HTTPS everywhere, no IP stored in analytics, card numbers never touch our server and access is restricted (LGPD art. 46). If a security incident may cause you relevant risk or harm, we will notify Brazil's data protection authority (ANPD) and the people affected, as required by art. 48.",
      ],
    },
    {
      id: "rights",
      title: "9. Your rights",
      blocks: [
        `Under LGPD art. 18 you can ask for confirmation and access, correction, anonymization, blocking or deletion, portability, information about sharing, and you can withdraw consent or object to processing. Write to ${mail}; we may ask for a simple identity check and we reply within 15 days. You can also complain to the ANPD (gov.br/anpd).`,
      ],
    },
    {
      id: "minors",
      title: "10. Children and teenagers",
      blocks: ["The site and dashboard are not directed at anyone under 18. If we learn we received a minor's data without a guardian's authorization, we will delete it."],
    },
    {
      id: "dpo",
      title: "11. Data protection officer",
      blocks: [`As a small-scale processing agent, Valtrea is exempt from appointing a DPO (ANPD Resolution 2/2022) and keeps a direct channel for data subjects: ${mail}.`],
    },
    {
      id: "changes",
      title: "12. Changes",
      blocks: [
        "When we change how we handle data we will update this page and the date at the top.",
        `See also the ${link(legalPaths.en.terms, "Terms of use")} and the ${link(legalPaths.en.accessibility, "Accessibility statement")}.`,
      ],
    },
  ],
};

const termsPt: LegalPageContent = {
  title: "Termos de Uso",
  description: "Regras de uso do site Valtrea, do apoio com café e do painel de estatísticas, incluindo direito de arrependimento e reembolso.",
  eyebrow: "Termos e condições",
  updated: legalUpdated.pt,
  intro: `Estes termos valem para quem usa o site ${company.domain} e seus serviços. Ao usar o site, você concorda com eles. Eles não tiram nenhum direito que a lei garante a você como consumidor.`,
  toc: "Nesta página",
  sections: [
    {
      id: "quem-somos",
      title: "1. Quem somos",
      blocks: [
        `A Valtrea é a marca de ${legalOwner.fullName}, ${legalOwner.kind.pt}, desenvolvedor com atuação em ${company.city}. Contato: ${mail}.`,
      ],
    },
    {
      id: "site",
      title: "2. O que é o site",
      blocks: [
        "O site apresenta os serviços de desenvolvimento da Valtrea (sites, landing pages, sistemas e aplicativos), projetos e produtos próprios.",
        {
          list: [
            "As demonstrações em <code>/demo</code> usam marcas fictícias e servem só para mostrar o tipo de trabalho. Nada é vendido nelas.",
            "Painéis, números e gráficos marcados como \"exemplo ilustrativo\" não são resultados reais e não são promessa de resultado.",
            "As informações de prazos e escopo são uma referência geral. Cada projeto tem escopo, prazo e valor definidos em proposta escrita, aceita pelas duas partes antes de começar.",
          ],
        },
        "<strong>Condutas proibidas.</strong> Não é permitido tentar invadir, sobrecarregar ou burlar a segurança do site, da API ou do painel; usar robôs para enviar formulários em massa; enviar conteúdo ilegal, ofensivo ou de terceiros sem autorização; ou se passar por outra pessoa.",
      ],
    },
    {
      id: "cafe",
      title: "3. Apoio com um café",
      blocks: [
        "O café é um pagamento voluntário de R$ 12,61 para apoiar a manutenção dos produtos Valtrea, que são gratuitos e sem anúncios. Ele não dá acesso a produto ou serviço exclusivo.",
        "O pagamento é feito por Pix ou cartão e processado pela Cakto. Antes de pagar, você vê o valor final, sem taxas adicionais. A confirmação aparece na tela assim que o pagamento é aprovado.",
        `<strong>Arrependimento e reembolso.</strong> Você pode desistir em até 7 dias a contar do pagamento, sem precisar explicar o motivo (Código de Defesa do Consumidor, art. 49). Basta escrever para ${mail} com o e-mail usado na compra. O valor é devolvido integralmente, pelo mesmo meio: no Pix, na conta de origem; no cartão, por estorno, que aparece na fatura conforme o ciclo do seu banco. Também atendemos pedidos de reembolso de cobranças em duplicidade ou por erro a qualquer tempo.`,
        "Respondemos às mensagens de atendimento em até 5 dias.",
      ],
    },
    {
      id: "painel",
      title: "4. Painel de estatísticas",
      blocks: [
        "O painel é gratuito e o acesso é feito com a sua conta do GitHub. Ao usá-lo, você se compromete a:",
        {
          list: [
            "cadastrar apenas sites que você administra ou tem autorização para medir;",
            "informar aos visitantes do seu site, na sua política de privacidade, que usa as estatísticas da Valtrea (você é o controlador desses dados e a Valtrea é a operadora);",
            "não usar o serviço para enviar dados pessoais sensíveis, identificar visitantes ou contornar as proteções de privacidade do script.",
          ],
        },
        `Podemos suspender contas que violem estes termos ou a lei. Você pode encerrar a sua conta a qualquer momento pedindo a exclusão em ${mail}. Por ser gratuito, o painel pode ter interrupções e mudanças; avisaremos com antecedência razoável antes de encerrá-lo.`,
      ],
    },
    {
      id: "propriedade",
      title: "5. Propriedade intelectual",
      blocks: [
        "Textos, layout, código, ilustrações e a marca Valtrea pertencem ao responsável pela Valtrea, exceto quando indicado. Marcas e logotipos de terceiros citados no site (por exemplo, de tecnologias e ferramentas) pertencem aos seus donos e aparecem só para identificá-los. Não copie o conteúdo do site para uso comercial sem autorização.",
      ],
    },
    {
      id: "links",
      title: "6. Links de terceiros",
      blocks: ["O site leva a serviços de terceiros, como WhatsApp, redes sociais e a página de pagamento. Esses serviços têm termos e políticas próprios."],
    },
    {
      id: "responsabilidade",
      title: "7. Responsabilidade",
      blocks: [
        "Trabalhamos para manter o site no ar, correto e seguro, mas ele pode ter interrupções por manutenção ou falhas de fornecedores. Nada nestes termos limita a responsabilidade que a lei atribui ao fornecedor perante o consumidor.",
      ],
    },
    {
      id: "privacidade",
      title: "8. Privacidade",
      blocks: [`O tratamento de dados pessoais está descrito na ${link(legalPaths.pt.privacy, "Política de Privacidade")}.`],
    },
    {
      id: "lei",
      title: "9. Lei aplicável e foro",
      blocks: [
        "Estes termos seguem a lei brasileira. Se você for consumidor, pode propor ação no foro do seu domicílio (CDC, art. 101, I). Antes disso, procure-nos: a maioria das questões se resolve por e-mail.",
        "Podemos atualizar estes termos; a data no topo indica a versão em vigor. Mudanças não afetam pagamentos já feitos.",
      ],
    },
  ],
};

const termsEn: LegalPageContent = {
  title: "Terms of Use",
  description: "Rules for using the Valtrea website, coffee support and analytics dashboard, including cancellation and refunds.",
  eyebrow: "Terms and conditions",
  updated: legalUpdated.en,
  intro: `These terms apply to anyone using ${company.domain} and its services. By using the site you agree to them. They do not remove any right the law gives you as a consumer. The Portuguese version prevails in case of doubt.`,
  toc: "On this page",
  sections: [
    {
      id: "who",
      title: "1. Who we are",
      blocks: [`Valtrea is the brand of ${legalOwner.fullName}, an ${legalOwner.kind.en} and developer based in Rio de Janeiro, Brazil. Contact: ${mail}.`],
    },
    {
      id: "site",
      title: "2. About the site",
      blocks: [
        {
          list: [
            "Demos under <code>/demo</code> use fictional brands and only show the kind of work we do. Nothing is sold there.",
            "Dashboards and figures marked \"illustrative example\" are not real results and not a promise of results.",
            "Timelines and scope on the site are general references. Each project's scope, deadline and price are set in a written proposal accepted by both sides.",
          ],
        },
        "<strong>Prohibited conduct.</strong> Do not try to break into, overload or bypass the security of the site, API or dashboard; use bots to mass-submit forms; send illegal or offensive content; or impersonate anyone.",
      ],
    },
    {
      id: "coffee",
      title: "3. Coffee support",
      blocks: [
        "The coffee is a voluntary R$ 12.61 payment to help keep Valtrea products free and ad-free. It does not unlock any exclusive product or service. Payments are processed by Cakto via Pix or card; you see the final amount before paying.",
        `<strong>Cancellation and refunds.</strong> You may cancel within 7 days of payment without giving a reason (Brazilian Consumer Code, art. 49) by e-mailing ${mail}. We refund the full amount through the same method. Duplicate or mistaken charges are refunded at any time. We reply within 5 days.`,
      ],
    },
    {
      id: "dashboard",
      title: "4. Analytics dashboard",
      blocks: [
        "The dashboard is free and uses GitHub sign-in. Only add sites you manage or are authorized to measure, tell your visitors in your privacy policy that you use Valtrea analytics, and do not use it to identify visitors or send sensitive data. We may suspend accounts that break these terms or the law. You can close your account at any time by e-mail.",
      ],
    },
    {
      id: "ip",
      title: "5. Intellectual property",
      blocks: ["Texts, layout, code, illustrations and the Valtrea brand belong to Valtrea's owner unless stated otherwise. Third-party trademarks shown on the site belong to their owners and appear only to identify them."],
    },
    {
      id: "liability",
      title: "6. Liability",
      blocks: ["We work to keep the site available and correct, but it may be interrupted by maintenance or provider outages. Nothing here limits liability that consumer law imposes."],
    },
    {
      id: "law",
      title: "7. Governing law",
      blocks: [
        `These terms follow Brazilian law. Consumers may sue in the courts of their own domicile (CDC art. 101, I). Personal data is covered by the ${link(legalPaths.en.privacy, "Privacy Policy")}.`,
      ],
    },
  ],
};

const accessibilityPt: LegalPageContent = {
  title: "Declaração de Acessibilidade",
  description: "O compromisso da Valtrea com um site que todo mundo consegue usar, o que já fizemos e como relatar uma barreira.",
  eyebrow: "Lei Brasileira de Inclusão · WCAG 2.2",
  updated: legalUpdated.pt,
  intro: "Queremos que qualquer pessoa consiga usar este site, inclusive quem navega pelo teclado, usa leitor de tela, ampliação ou prefere menos movimento. Seguimos a Lei Brasileira de Inclusão (Lei 13.146/2015, art. 63) e usamos como meta o nível AA das diretrizes WCAG 2.2.",
  toc: "Nesta página",
  sections: [
    {
      id: "feito",
      title: "1. O que já fazemos",
      blocks: [
        {
          list: [
            "Idioma da página declarado (português ou inglês) e link \"Pular para o conteúdo\" no topo.",
            "Navegação completa pelo teclado, com indicação visível de foco.",
            "Textos alternativos em imagens que têm conteúdo; imagens decorativas são ignoradas pelo leitor de tela.",
            "Campos de formulário com rótulo e mensagens de erro anunciadas.",
            "Respeito à preferência \"reduzir movimento\" do sistema: animações e efeitos são desligados ou simplificados.",
            "Zoom liberado e layout que se adapta a telas pequenas.",
          ],
        },
      ],
    },
    {
      id: "limites",
      title: "2. Limitações conhecidas",
      blocks: [
        {
          list: [
            "Algumas lojas de demonstração em <code>/demo</code> têm selos e etiquetas decorativos com contraste abaixo do recomendado. Estamos revisando.",
            "Efeitos visuais em 3D e animações de fundo são decorativos e não trazem informação que não esteja também no texto.",
            "O site não foi testado formalmente com usuários com deficiência; a revisão foi técnica.",
          ],
        },
      ],
    },
    {
      id: "relatar",
      title: "3. Encontrou uma barreira?",
      blocks: [
        `Escreva para ${mail} contando a página e o que aconteceu. Respondemos em até 5 dias úteis e, se não for possível corrigir logo, enviamos o conteúdo em outro formato.`,
      ],
    },
  ],
};

const accessibilityEn: LegalPageContent = {
  title: "Accessibility Statement",
  description: "Valtrea's commitment to a site everyone can use, what we already do and how to report a barrier.",
  eyebrow: "Brazilian Inclusion Law · WCAG 2.2",
  updated: legalUpdated.en,
  intro: "We want anyone to be able to use this site, including keyboard, screen reader and magnification users and people who prefer less motion. We follow Brazil's Inclusion Law (Law 13,146/2015, art. 63) and aim for WCAG 2.2 level AA.",
  toc: "On this page",
  sections: [
    {
      id: "done",
      title: "1. What we already do",
      blocks: [
        {
          list: [
            "Page language declared and a \"Skip to content\" link.",
            "Full keyboard navigation with visible focus.",
            "Alternative text on meaningful images; decorative images are hidden from screen readers.",
            "Labeled form fields and announced error messages.",
            "Respect for the system \"reduce motion\" setting.",
            "Zoom allowed and a layout that adapts to small screens.",
          ],
        },
      ],
    },
    {
      id: "limits",
      title: "2. Known limitations",
      blocks: [
        {
          list: [
            "Some demo stores under <code>/demo</code> have decorative badges with lower-than-recommended contrast. We are reviewing them.",
            "3D effects and background animations are decorative and carry no information missing from the text.",
            "The site has not been formally tested with disabled users; the review was technical.",
          ],
        },
      ],
    },
    {
      id: "report",
      title: "3. Found a barrier?",
      blocks: [`E-mail ${mail} with the page and what happened. We reply within 5 business days and, if we cannot fix it quickly, send the content in another format.`],
    },
  ],
};

const legalContent: Record<Locale, Record<LegalDoc, LegalPageContent>> = {
  pt: { privacy: privacyPt, terms: termsPt, accessibility: accessibilityPt },
  en: { privacy: privacyEn, terms: termsEn, accessibility: accessibilityEn },
};

export const legalContentFor = (locale: Locale, doc: LegalDoc) => legalContent[locale][doc];
