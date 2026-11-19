import { talkFromElement } from "./chat-data";

export function wireHireForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-hire]");
  const input = form?.querySelector<HTMLInputElement>("input[type=email]");
  const error = form?.querySelector<HTMLElement>("[data-hire-error]");
  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = input.value.trim();
    if (!email || !input.checkValidity()) {
      if (error) error.hidden = false;
      input.focus();
      return;
    }
    if (error) error.hidden = true;
    talkFromElement(form, (form.dataset.message ?? "{email}").replace("{email}", email));
  });
}

export function wireContactForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;
  const field = (name: string) => form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
  const error = form.querySelector<HTMLElement>("[data-contact-error]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = field("name")?.value.trim() ?? "";
    const email = field("email")?.value.trim() ?? "";
    const project = field("project")?.value.trim() ?? "";
    if (!name || !project) {
      if (error) error.hidden = false;
      (name ? field("project") : field("name"))?.focus();
      return;
    }
    if (error) error.hidden = true;
    const emailLine = email ? (form.dataset.emailLine ?? "").replace("{email}", email) : "";
    const text = (form.dataset.message ?? "")
      .replace("{name}", name)
      .replace("{email}", emailLine)
      .replace("{project}", project);
    talkFromElement(form, text);
  });
}

export function wireTalkButtons(): void {
  document.querySelectorAll<HTMLElement>("[data-talk-button]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      talkFromElement(button, button.dataset.text ?? "");
    });
  });
}
