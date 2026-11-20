# Valtrea — Site Institucional

**Evolução que transforma.**

Repositório do site institucional da **Valtrea**, dedicado à apresentação da marca, de seus produtos digitais e de suas soluções tecnológicas. O projeto reúne a experiência pública do site e serviços de apoio para autenticação, análise de visitas e integrações.

**Site oficial:** [www.valtrea.com.br](https://www.valtrea.com.br/)

## Sobre o projeto

O Valtrea Site é uma aplicação web estruturada em **monorepositório**, com frontend em **Astro**, serviços executados na **Cloudflare** e pacotes compartilhados. Essa organização separa a interface, as rotas de API, a coleta de eventos e as integrações externas, facilitando a manutenção e a evolução do sistema.

### Funcionalidades

- **Site em português e inglês:** páginas principais em `/` e `/en/`.
- **Catálogo de produtos:** páginas em `/produtos` e `/en/products`.
- **Contato:** acesso ao canal de atendimento pelo WhatsApp.
- **Links rastreados:** acompanhamento de interações com links por meio da API, conforme configuração do projeto.
- **Experiência interativa:** seção de perguntas e respostas e interface de conversa ao lado do conteúdo.
- **Painel de estatísticas:** visualização de dados de acesso, conforme a configuração dos serviços.
- **Apoio ao projeto:** fluxo de contribuição por Pix ou cartão, com página de agradecimento e integração aos serviços de pagamento configurados.
- **Autenticação com GitHub:** utilizada nas funcionalidades administrativas previstas na API.
- **Monitoramento de visitas sem cookies:** script próprio de rastreamento e serviço de ingestão de eventos.

> **Nota:** as funcionalidades administrativas, o painel e os pagamentos exigem a configuração das integrações externas. A disponibilidade de cada recurso depende do ambiente implantado.

## Tecnologias e serviços

| Categoria | Tecnologias |
| --- | --- |
| Interface web | Astro, TypeScript |
| Organização do código | pnpm workspaces e Turborepo |
| Hospedagem e API | Cloudflare e Wrangler |
| Dados e métricas | Cloudflare D1 e Analytics Engine |
| Autenticação | Integração com GitHub |
| Comunicação | Resend e WhatsApp |
| Pagamentos | Cakto; opções de Pix e cartão na experiência do site |

## Arquitetura do repositório

```text
.
├── apps/
│   ├── web/             # Site público em Astro
│   ├── api/             # API e integrações na Cloudflare
│   └── ingest/          # Recebimento de eventos de visita
├── packages/
│   ├── tracker/         # Script t.js de medição sem cookies
│   ├── core/            # Regras e lógica compartilhadas
│   ├── adapters/        # Integrações externas
│   ├── db/              # Camada de dados
│   └── shared/          # Código e tipos compartilhados
├── docs/
│   └── decisions/       # Decisões de arquitetura
├── package.json
├── pnpm-lock.yaml
├── turbo.json
└── README.md
```

**Como as partes se relacionam:** o `apps/web` apresenta a interface pública; o `apps/api` concentra rotas de serviço e integrações; `packages/tracker` disponibiliza o script de medição, enquanto `apps/ingest` recebe os eventos. Os pacotes compartilhados reduzem duplicação entre as aplicações.

## Executar localmente

### Pré-requisitos

- **Node.js 24**
- **pnpm**

Na raiz do repositório, instale as dependências e inicie o frontend:

```bash
pnpm install
pnpm --filter @valtrea/web dev
```

Acesse **http://localhost:4321**.

> O site pode ser executado localmente, mas o login com GitHub, o painel de estatísticas e os pagamentos dependem de serviços externos configurados. Consulte [`TROCAR-PARA-SEUS-DADOS.md`](./TROCAR-PARA-SEUS-DADOS.md) para os valores específicos do seu ambiente.

## Publicação na Cloudflare

Os comandos abaixo seguem o processo documentado neste projeto. Revise os identificadores e os arquivos de configuração antes de executá-los.

### 1. Preparar o banco de dados

```bash
npx wrangler d1 create valtrea
npx wrangler d1 migrations apply valtrea --remote --config apps/api/wrangler.jsonc
```

### 2. Configurar integrações e segredos

Substitua os valores de exemplo indicados em [`TROCAR-PARA-SEUS-DADOS.md`](./TROCAR-PARA-SEUS-DADOS.md) e registre as credenciais sensíveis como *secrets* da Cloudflare. Exemplo:

```bash
cd apps/api
npx wrangler secret put SESSION_SECRET
cd ../..
```

**Não envie** tokens, senhas, chaves de API ou arquivos `.env` com segredos ao GitHub.

### 3. Compilar e implantar os serviços

```bash
pnpm build

cd apps/ingest && npx wrangler deploy
cd ../api && npx wrangler deploy
cd ../web && npx wrangler deploy
```

A ordem e os nomes de serviços podem depender das configurações `wrangler` de cada aplicação. Confirme as ligações entre serviços e o banco D1 antes de implantar em produção.

## Documentação

- [`docs/decisions/`](./docs/decisions/) — decisões de arquitetura e justificativas técnicas.
- [`TROCAR-PARA-SEUS-DADOS.md`](./TROCAR-PARA-SEUS-DADOS.md) — itens a personalizar antes da implantação.

### Capturas de tela

Para complementar o portfólio, vale incluir capturas reais da **home**, da **página de produtos** e de uma **visão do painel** (sem informações privadas). Sugestão de pasta: `docs/screenshots/`. Evite adicionar imagens inexistentes ao README.

## Segurança e privacidade

A coleta de visitas foi projetada para funcionar sem cookies. Isso **não substitui** uma avaliação jurídica ou técnica sobre tratamento de dados: revise quais eventos são coletados, seu armazenamento e a política de privacidade aplicável.

O acesso administrativo e os serviços de terceiros dependem de credenciais configuradas fora do código-fonte. Antes de tornar o projeto público, confira também o **histórico de commits** para evitar exposição de segredos anteriormente versionados.

## Créditos

- Ícones de marcas: [Simple Icons](https://simpleicons.org/), disponibilizados sob CC0; as marcas pertencem aos respectivos titulares.
- Biblioteca `qrcode` utilizada na geração do QR Code de Pix de teste, conforme a documentação do projeto.
- Fotografias e elementos visuais: consulte a origem e as permissões de uso registradas no projeto.
- Algumas referências visuais foram utilizadas como inspiração; a implementação e os conteúdos próprios integram o projeto Valtrea.

---

**Valtrea** · [Site oficial](https://www.valtrea.com.br/)
