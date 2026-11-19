import type { Answer } from "./answers";

export interface ChatData {
  answers: Answer[];
  fallback: string;
  askAgain: string;
  greeting: string[];
  continueLabel: string;
  whatsapp: string;
  email: string;
  subject: string;
  hours: { timeZone: string; days: number[]; opens: number; closes: number };
  online: string;
  offline: string;
  typing: string;
  locale: string;
  flow?: ChatFlow;
}

export interface ChatChoice {
  label: string;
  reply: string;
  free?: string;
}

export interface ChatFlow {
  notices: string[];
  kind: { question: string; options: ChatChoice[]; freeReply: string };
  goal: { question: string; options: string[]; reply: string };
  deadline: { question: string; options: ChatChoice[] };
  nameQuestion: string;
  final: string[];
  message: string;
  example: string;
  yourName: string;
  yourAnswer: string;
  placeholder: string;
  send: string;
  cta: string;
  alt: string;
  altHref: string;
  privacy: string;
  privacyHref: string;
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function isOnline(hours: ChatData["hours"], now = new Date()): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: hours.timeZone,
      weekday: "short",
      hour: "numeric",
      hourCycle: "h23",
    }).formatToParts(now);
    const day = weekdays.indexOf(parts.find((part) => part.type === "weekday")?.value ?? "");
    const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "-1");
    return hours.days.includes(day) && hour >= hours.opens && hour < hours.closes;
  } catch (error) {
    void error;
    return false;
  }
}

export function openTalk(target: string): void {
  if (target.startsWith("https://")) window.open(target, "_blank", "noopener");
  else window.location.href = target;
}

export function readChatData(): ChatData | null {
  const source = document.getElementById("site-chat-data");
  if (!source?.textContent) return null;
  try {
    return JSON.parse(source.textContent) as ChatData;
  } catch {
    return null;
  }
}

export function buildTalkLink(whatsapp: string, email: string, subject: string, text: string): string {
  if (/^\d{12,13}$/.test(whatsapp)) {
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
  }
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}

export function talkLink(data: ChatData, text: string): string {
  return buildTalkLink(data.whatsapp, data.email, data.subject, text);
}

export function talkFromElement(element: HTMLElement, text: string): void {
  const { whatsapp = "", email = "", subject = "" } = element.dataset;
  openTalk(buildTalkLink(whatsapp, email, subject, text));
}
