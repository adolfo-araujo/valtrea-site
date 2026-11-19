import { findAnswer } from "./answers";
import { isOnline, openTalk, readChatData, talkLink, type ChatData } from "./chat-data";
import { prefersReducedMotion } from "../motion";

const typingMs = 900;
const autoOpenKey = "valtrea-chat-greeted";

function clock(locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function ticks(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 18 12");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "11");
  svg.setAttribute("class", "chat-ticks");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M1 6.5 4 9.5 10.5 2.5M7 9.5 13.5 2.5M5.6 8.1 7 9.5");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.6");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  return svg;
}

function bubble(data: ChatData, from: "me" | "bot", text: string, link?: { href: string; label: string }): HTMLElement {
  const item = document.createElement("li");
  item.className = `chat-bubble chat-bubble--${from}`;
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  item.append(paragraph);
  if (link) {
    const anchor = document.createElement("a");
    anchor.className = "chat-link";
    anchor.href = link.href;
    if (link.href.startsWith("https://")) {
      anchor.target = "_blank";
      anchor.rel = "noopener";
    }
    anchor.textContent = link.label;
    item.append(anchor);
  }
  const meta = document.createElement("span");
  meta.className = "chat-meta";
  meta.textContent = clock(data.locale);
  if (from === "me") meta.append(ticks());
  item.append(meta);
  return item;
}

function typingBubble(): HTMLElement {
  const item = document.createElement("li");
  item.className = "chat-bubble chat-bubble--bot chat-typing";
  item.setAttribute("aria-hidden", "true");
  item.append(document.createElement("span"), document.createElement("span"), document.createElement("span"));
  return item;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, prefersReducedMotion() ? 0 : ms));

async function botSays(log: HTMLElement, data: ChatData, setStatus: (typing: boolean) => void, text: string, link?: { href: string; label: string }) {
  const typing = typingBubble();
  log.append(typing);
  log.scrollTop = log.scrollHeight;
  setStatus(true);
  await wait(Math.min(1600, typingMs + text.length * 8));
  typing.remove();
  setStatus(false);
  log.append(bubble(data, "bot", text, link));
  log.scrollTop = log.scrollHeight;
}

async function reply(log: HTMLElement, data: ChatData, setStatus: (typing: boolean) => void, question: string): Promise<void> {
  log.append(bubble(data, "me", question));
  log.scrollTop = log.scrollHeight;
  await wait(350);
  const answer = findAnswer(question, data.answers);
  const link = { href: talkLink(data, question), label: data.continueLabel };
  await botSays(log, data, setStatus, answer ?? data.fallback, link);
}

function wireAsk(data: ChatData): void {
  const form = document.querySelector<HTMLFormElement>("[data-ask]");
  const log = document.querySelector<HTMLElement>("[data-ask-log]");
  const input = form?.querySelector<HTMLInputElement>("input");
  if (!form || !log || !input) return;
  const quiet = () => undefined;

  const ask = (question: string) => {
    const text = question.trim();
    if (!text) return;
    log.hidden = false;
    void reply(log, data, quiet, text);
    input.value = "";
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
  });
  document.querySelectorAll<HTMLButtonElement>("[data-ask-chip]").forEach((chip) => {
    chip.addEventListener("click", () => ask(chip.textContent ?? ""));
  });
}

function sendIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M12 19V5M5 12l7-7 7 7");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  return svg;
}

function wireChatBox(data: ChatData): void {
  const flow = data.flow;
  const wrap = document.querySelector<HTMLElement>("[data-chat-fab-wrap]");
  const fab = document.querySelector<HTMLButtonElement>("[data-chat-fab]");
  const badge = document.querySelector<HTMLElement>("[data-chat-badge]");
  const preview = document.querySelector<HTMLElement>("[data-chat-preview]");
  const box = document.querySelector<HTMLElement>("[data-chat-box]");
  const log = box?.querySelector<HTMLElement>("[data-chat-log]");
  const foot = box?.querySelector<HTMLElement>("[data-chat-foot]");
  const closeButton = box?.querySelector<HTMLButtonElement>("[data-chat-close]");
  if (!flow || !wrap || !fab || !box || !log || !foot || !closeButton) return;

  const status = box.querySelector<HTMLElement>("[data-chat-status]");
  const dot = box.querySelector<HTMLElement>("[data-chat-dot]");
  const online = isOnline(data.hours);
  if (status) status.textContent = online ? data.online : data.offline;
  dot?.classList.toggle("is-away", !online);

  const answers = { tipo: "", objetivo: "", prazo: "", nome: "" };
  const timers: ReturnType<typeof setTimeout>[] = [];
  let started = false;
  let open = false;

  const pause = (ms: number) =>
    new Promise<void>((resolve) => {
      timers.push(setTimeout(resolve, prefersReducedMotion() ? 0 : ms));
    });
  const toEnd = () => {
    log.scrollTop = log.scrollHeight;
  };
  new ResizeObserver(toEnd).observe(foot);
  const clearFoot = () => foot.replaceChildren();

  const say = (text: string, from: "bot" | "me") => {
    const message = document.createElement("p");
    message.className = `cb-msg cb-msg--${from}`;
    message.textContent = text;
    log.append(message);
    toEnd();
  };

  const botSays = async (text: string) => {
    const typing = document.createElement("p");
    typing.className = "cb-msg cb-msg--bot cb-typing";
    typing.setAttribute("aria-label", data.typing);
    typing.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
    log.append(typing);
    toEnd();
    await pause(Math.min(1700, 500 + text.length * 18));
    typing.remove();
    say(text, "bot");
    await pause(350);
  };

  const choose = (labels: string[]) =>
    new Promise<string>((resolve) => {
      clearFoot();
      const opener = document.createElement("button");
      opener.type = "button";
      opener.className = "cb-input cb-input--fake";
      const hint = document.createElement("span");
      hint.textContent = flow.placeholder;
      const arrow = document.createElement("i");
      arrow.setAttribute("aria-hidden", "true");
      arrow.append(sendIcon());
      opener.append(hint, arrow);
      const chips = document.createElement("div");
      chips.className = "cb-chips";
      for (const label of labels) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "cb-chip";
        chip.textContent = label;
        chip.addEventListener("click", () => {
          clearFoot();
          say(label, "me");
          resolve(label);
        });
        chips.append(chip);
      }
      opener.addEventListener("click", () => {
        clearFoot();
        foot.append(chips);
        chips.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
      });
      foot.append(opener);
    });

  const ask = (placeholder: string) =>
    new Promise<string>((resolve) => {
      clearFoot();
      const form = document.createElement("form");
      form.className = "cb-input";
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 200;
      input.required = true;
      input.placeholder = placeholder;
      input.setAttribute("aria-label", flow.yourAnswer);
      const button = document.createElement("button");
      button.type = "submit";
      button.setAttribute("aria-label", flow.send);
      button.append(sendIcon());
      form.append(input, button);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = input.value.trim();
        if (!value) return;
        clearFoot();
        say(value, "me");
        resolve(value);
      });
      foot.append(form);
      if (!matchMedia("(pointer: coarse)").matches) input.focus({ preventScroll: true });
    });

  const fill = (text: string) => text.replace(/\{(\w+)\}/g, (_, key: string) => answers[key as keyof typeof answers] || "—");

  const finish = () => {
    clearFoot();
    const message = fill(flow.message);
    const cta = document.createElement("a");
    cta.className = "cb-cta";
    cta.href = data.whatsapp
      ? `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    cta.target = "_blank";
    cta.rel = "noopener";
    cta.textContent = flow.cta;
    const alt = document.createElement("a");
    alt.className = "cb-alt";
    alt.href = flow.altHref;
    alt.textContent = flow.alt;
    const privacy = document.createElement("a");
    privacy.className = "cb-privacy";
    privacy.href = flow.privacyHref;
    privacy.textContent = flow.privacy;
    foot.append(cta, alt, privacy);
  };

  const script = async () => {
    await botSays(flow.kind.question);
    const kind = await choose(flow.kind.options.map((option) => option.label));
    const picked = flow.kind.options.find((option) => option.label === kind);
    if (picked?.free) {
      await botSays(picked.free);
      answers.tipo = await ask(flow.example);
      await botSays(flow.kind.freeReply);
    } else {
      answers.tipo = kind;
      await botSays(picked?.reply ?? flow.kind.freeReply);
    }
    await botSays(flow.goal.question);
    answers.objetivo = await choose(flow.goal.options);
    await botSays(flow.goal.reply);
    await botSays(flow.deadline.question);
    answers.prazo = await choose(flow.deadline.options.map((option) => option.label));
    const deadline = flow.deadline.options.find((option) => option.label === answers.prazo);
    if (deadline) await botSays(deadline.reply);
    await botSays(flow.nameQuestion);
    answers.nome = await ask(flow.yourName);
    for (const line of flow.final) await botSays(fill(line));
    finish();
  };

  const show = () => {
    open = true;
    box.hidden = false;
    void box.offsetWidth;
    box.classList.add("is-open");
    wrap.classList.add("is-open");
    wrap.classList.remove("has-badge", "has-preview");
    fab.setAttribute("aria-expanded", "true");
    document.body.classList.add("chat-is-open");
    try {
      sessionStorage.setItem(autoOpenKey, "1");
    } catch {
      void 0;
    }
    if (started) return;
    started = true;
    timers.forEach(clearTimeout);
    timers.length = 0;
    for (const notice of flow.notices) say(notice, "bot");
    void pause(500).then(script);
  };

  const hide = () => {
    open = false;
    box.classList.remove("is-open");
    wrap.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
    document.body.classList.remove("chat-is-open");
    setTimeout(() => {
      if (!open) box.hidden = true;
    }, 300);
    fab.focus({ preventScroll: true });
  };

  fab.addEventListener("click", () => (open ? hide() : show()));
  preview?.addEventListener("click", show);
  closeButton.addEventListener("click", hide);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) hide();
  });

  let seen = false;
  try {
    seen = sessionStorage.getItem(autoOpenKey) === "1";
  } catch {
    seen = false;
  }

  const notify = (count: number) => {
    if (started || !badge) return;
    badge.textContent = String(count);
    wrap.classList.add("has-badge");
    badge.classList.remove("is-pop");
    void badge.offsetWidth;
    badge.classList.add("is-pop");
    if (preview) preview.textContent = flow.notices[count - 1] ?? "";
    wrap.classList.add("has-preview");
  };

  const arrive = () => {
    if (wrap.classList.contains("is-on")) return;
    wrap.classList.add("is-on");
    if (seen) return;
    timers.push(setTimeout(() => notify(1), 1200));
    timers.push(setTimeout(() => notify(2), 3400));
    timers.push(setTimeout(() => wrap.classList.remove("has-preview"), 11000));
  };

  let queued = false;
  const check = () => {
    queued = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0 || window.scrollY / scrollable >= 0.45) {
      arrive();
      window.removeEventListener("scroll", onScroll);
    }
  };
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(check);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  check();
}

function wireTalkBar(data: ChatData): void {
  const bar = document.querySelector<HTMLFormElement>("[data-talk]");
  const input = bar?.querySelector<HTMLInputElement>("input");
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const footer = document.querySelector<HTMLElement>("footer");
  if (!bar || !input) return;

  bar.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim() || data.greeting[0] || "";
    openTalk(talkLink(data, text));
    input.value = "";
  });

  let pastHero = !hero;
  let atFooter = false;
  const update = () => bar.classList.toggle("is-shown", pastHero && !atFooter);

  if ("IntersectionObserver" in window) {
    if (hero) {
      new IntersectionObserver(([entry]) => {
        pastHero = !entry?.isIntersecting;
        update();
      }).observe(hero);
    }
    if (footer) {
      new IntersectionObserver(([entry]) => {
        atFooter = Boolean(entry?.isIntersecting);
        update();
      }).observe(footer);
    }
  } else {
    pastHero = true;
  }
  update();
}

export function startSiteChat(): void {
  const data = readChatData();
  if (!data) return;
  wireAsk(data);
  wireChatBox(data);
  wireTalkBar(data);
}
