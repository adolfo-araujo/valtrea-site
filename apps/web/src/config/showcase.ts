import { company } from "./company";

export interface ShowcaseItem {
  id: string;
  name: string;
  href: string;
  domain: string;
  pt: string;
  en: string;
  hue: number;
  icon: string;
}

const domainOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const liveProducts: ShowcaseItem[] = [
  {
    id: "finance",
    name: "Valtrea Finance",
    href: company.products.finance,
    domain: domainOf(company.products.finance),
    pt: "Controle financeiro pessoal: ganhos, gastos, orçamentos por categoria e relatório do ano.",
    en: "Personal finance: income, expenses, budgets by category and a yearly report.",
    hue: 45, icon: "dollar",
  },
  {
    id: "agora",
    name: "Valtrea Agora",
    href: company.products.agora,
    domain: domainOf(company.products.agora),
    pt: "Horários vagos de salões e barbearias perto de você, para reservar ainda hoje.",
    en: "Open slots at salons and barbershops near you, to book today.",
    hue: 210, icon: "scissors",
  },
  {
    id: "volta",
    name: "Valtrea Volta",
    href: company.products.volta,
    domain: domainOf(company.products.volta),
    pt: "Etiquetas com QR Code para objetos: quem encontra avisa o dono sem ver o telefone dele.",
    en: "QR code tags for your things: whoever finds one alerts the owner without seeing their phone number.",
    hue: 270, icon: "tag",
  },
  {
    id: "pulso",
    name: "Valtrea Pulso",
    href: company.products.pulso,
    domain: domainOf(company.products.pulso),
    pt: "Moradores propõem e apoiam melhorias para o bairro e acompanham cada pedido.",
    en: "Residents propose and back improvements for their neighborhood and follow each request.",
    hue: 330, icon: "home",
  },
];

export const demos: ShowcaseItem[] = [
  { id: "cardapio", name: "Fornalha Burger", href: "/demo/cardapio", domain: "valtrea.com.br/demo/cardapio", pt: "Cardápio digital com sacola, entrega por bairro e pedido no WhatsApp.", en: "Digital menu with bag, delivery by neighborhood and WhatsApp orders.", hue: 18, icon: "burger" },
  { id: "pet", name: "Patota Pet", href: "/demo/pet", domain: "valtrea.com.br/demo/pet", pt: "Loja de removedores de pelo de cachorro e gato, com sacola e pedido no WhatsApp.", en: "Pet hair remover store with bag and WhatsApp orders.", hue: 190, icon: "paw" },
  { id: "corrida", name: "Passada", href: "/demo/corrida", domain: "valtrea.com.br/demo/corrida", pt: "Loja de corrida com troca feminino e masculino, tamanhos e sacola.", en: "Running store with a women's and men's switch, sizes and bag.", hue: 95, icon: "run" },
  { id: "achados", name: "Caixote", href: "/demo/achados", domain: "valtrea.com.br/demo/achados", pt: "Loja de achadinhos com frete grátis e rastreio de pedido.", en: "Curated finds store with free shipping and order tracking.", hue: 28, icon: "box" },
  { id: "proposta", name: "Recanto Pet Hotel", href: "/demo/proposta", domain: "valtrea.com.br/demo/proposta", pt: "Proposta comercial em página, com garantia, SEO e fechamento.", en: "Sales proposal as a page, with guarantee, SEO and closing.", hue: 0, icon: "file" },
];

export const androidApps = [
  { id: "finance", name: "Finance" },
  { id: "agora", name: "Agora" },
  { id: "volta", name: "Volta" },
  { id: "pulso", name: "Pulso" },
  { id: "pay", name: "Pay" },
];
