import type { Locale } from "../i18n";
export const coffeeApiUrl = "https://www.valtrea.com.br/api/coffees";
export const coffeeCountEndpoint = coffeeApiUrl;
export const coffeePriceCents = 1261;
export const caktoSdkUrl = "https://cakto-sdk.pages.dev/cakto-sdk.min.js";
export const caktoSdkClientId = "gQWefpeelyWf3z3fd9z31QZRfwTsfYiNTVTq1dB4";
export const coffeePathFor = (locale: Locale) => (locale === "pt" ? "/cafe" : "/en/coffee");
