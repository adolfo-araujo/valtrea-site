export const company = {
  name: "Valtrea",
  handle: "valtrea",
  email: "contato@valtrea.com.br",
  city: "Rio de Janeiro/RJ",
  country: "Brasil",
  domain: "valtrea.com.br",
  site: "https://www.valtrea.com.br",
  whatsapp: "",
  instagram: "adolfo.martins_",
  tiktok: "joaoadolfo",
  youtube: "",
  person: {
    name: "João",
    fullName: "João Adolfo",
    role: "Fundador · Desenvolvedor full stack",
    roleEn: "Founder · Full stack developer",
    photo: "",
  },
  hours: {
    timeZone: "America/Sao_Paulo",
    days: [1, 2, 3, 4, 5],
    opens: 9,
    closes: 18,
  },
  products: {
    finance: "https://finance.valtrea.com.br",
    agora: "https://agora.valtrea.com.br",
    volta: "https://volta.valtrea.com.br",
    pulso: "https://pulso.valtrea.com.br",
  },
};

export const quoteMailto = (subject: string, body = "") =>
  `mailto:${company.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;

export const whatsappDisplay = () => {
  const digits = company.whatsapp.replace(/^55/, "");
  if (digits.length < 10) return "";
  return `(${digits.slice(0, 2)}) ${digits.slice(2, -4)}-${digits.slice(-4)}`;
};

export const hasWhatsapp = () => /^\d{12,13}$/.test(company.whatsapp);

export const talkUrl = (text: string, subject = "Contato pelo site") =>
  hasWhatsapp() ? `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}` : quoteMailto(subject, text);

export const socialUrl = (network: "instagram" | "tiktok" | "youtube") => {
  const user = company[network];
  if (!user) return "";
  if (network === "instagram") return `https://instagram.com/${user}`;
  if (network === "tiktok") return `https://tiktok.com/@${user}`;
  return `https://youtube.com/@${user}`;
};
