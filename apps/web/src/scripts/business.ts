import { revealAsYouScroll } from "./revela";
import { talkFromElement } from "./site/chat-data";

const form = document.querySelector<HTMLFormElement>("form[data-apply]");
if (form) wireApplyForm(form);

function wireApplyForm(form: HTMLFormElement): void {
  const planField = form.querySelector<HTMLSelectElement>("select[name=plan]");
  const chosen = new URLSearchParams(window.location.search).get("plano");
  const chosenPlan = chosen ? document.querySelector<HTMLElement>(`[data-plan-name][data-plan-id="${chosen}"]`) : null;
  if (planField && chosenPlan?.dataset.planName) planField.value = chosenPlan.dataset.planName;
  document.querySelectorAll<HTMLElement>("[data-pick-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      if (planField) planField.value = button.dataset.pickPlan ?? "";
    });
  });

  const phone = form.querySelector<HTMLInputElement>("input[name=phone]");
  phone?.addEventListener("input", () => {
    const digits = phone.value.replace(/\D/g, "").slice(0, 11);
    let value = digits;
    if (digits.length > 2) value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length > 7) value = `(${digits.slice(0, 2)}) ${digits.slice(2, digits.length - 4)}-${digits.slice(-4)}`;
    phone.value = value;
  });

  const boxOf = (name: string) => form.querySelector<HTMLElement>(`[data-field="${name}"]`);
  const errorOf = (name: string) =>
    name === "consent" ? form.querySelector<HTMLElement>(".b-error-consent") : boxOf(name)?.querySelector<HTMLElement>(".b-error");
  const mark = (name: string, on: boolean) => {
    boxOf(name)?.classList.toggle("is-error", on);
    const message = errorOf(name);
    if (message) message.hidden = !on;
  };
  const clear = (event: Event) => {
    const target = event.target as HTMLInputElement | null;
    if (target?.name) mark(target.name, false);
  };
  form.addEventListener("input", clear);
  form.addEventListener("change", clear);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const bad: string[] = [];
    if (value("name").length < 2) bad.push("name");
    if (value("phone").replace(/\D/g, "").length < 10) bad.push("phone");
    if (value("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) bad.push("email");
    if (!value("experience")) bad.push("experience");
    if (!value("time")) bad.push("time");
    if (value("why").length < 20) bad.push("why");
    if (!data.get("consent")) bad.push("consent");
    ["name", "phone", "email", "experience", "time", "why", "consent"].forEach((name) => mark(name, bad.includes(name)));
    const first = bad[0];
    if (first) {
      const box = boxOf(first);
      (box?.querySelector<HTMLElement>("input, textarea") ?? box)?.focus();
      return;
    }

    const lines = [
      "*Inscrição Valtrea Business*",
      "",
      `Nome: ${value("name")}`,
      `WhatsApp: ${value("phone")}`,
      ...(value("email") ? [`E-mail: ${value("email")}`] : []),
      ...(value("social") ? [`Instagram ou TikTok: ${value("social")}`] : []),
      ...(value("city") ? [`Cidade/estado: ${value("city")}`] : []),
      `Plano: ${value("plan")}`,
      `Já vendeu na internet? ${value("experience")}`,
      `Tempo por dia: ${value("time")}`,
      "",
      `Por que eu: ${value("why")}`,
    ];
    talkFromElement(form, lines.join("\n"));
    const done = form.parentElement?.querySelector<HTMLElement>("[data-apply-ok]");
    if (done) {
      form.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
    }
  });
}

revealAsYouScroll();

const bizNav = document.querySelector<HTMLElement>("[data-biz-nav]");
if (bizNav) {
  let queued = false;
  const update = () => {
    bizNav.classList.toggle("is-scrolled", window.scrollY > 12);
    queued = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

const letter = document.querySelector<HTMLElement>("[data-b-letter]");
const critter = document.querySelector<SVGSVGElement>("[data-b-critter]");
if (letter && critter) {
  const seat = () => {
    const context = document.createElement("canvas").getContext("2d");
    if (!context) return;
    const style = getComputedStyle(letter);
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metrics = context.measureText("V");
    const size = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight) || size * 0.82;
    const baseline = (lineHeight - (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)) / 2 + metrics.fontBoundingBoxAscent;
    const capTop = baseline - metrics.actualBoundingBoxAscent;
    const right = metrics.actualBoundingBoxRight;
    const width = size * 0.17;
    const height = width * (9 / 10);
    critter.style.setProperty("--critter-w", `${width}px`);
    critter.style.setProperty("--critter-top", `${capTop - height + width * 0.02}px`);
    critter.style.setProperty("--critter-left", `${right - width * 1.05}px`);
  };
  seat();
  void document.fonts.ready.then(seat);
  window.addEventListener("resize", seat);
}
