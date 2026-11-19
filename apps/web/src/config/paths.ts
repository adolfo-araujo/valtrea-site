import type { Locale } from "../i18n";

export interface SitePaths {
  home: string;
  contact: string;
  projects: string;
  products: string;
}

export const sitePaths = (locale: Locale): SitePaths =>
  locale === "pt"
    ? { home: "/", contact: "/contato", projects: "/projetos", products: "/produtos" }
    : { home: "/en/", contact: "/en/contact", projects: "/en/projects", products: "/en/products" };
