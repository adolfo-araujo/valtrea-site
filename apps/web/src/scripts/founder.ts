import { revealAsYouScroll } from "./revela";

revealAsYouScroll();

const hook = document.querySelector<HTMLButtonElement>("[data-hook]");
const panel = document.querySelector<HTMLElement>("[data-hook-panel]");
const ways = panel?.querySelector<HTMLElement>("[data-ways]");

if (hook && panel) {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const setOpen = (open: boolean) => {
    hook.setAttribute("aria-expanded", String(open));
    if (!open) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    if (still || !ways) return;
    ways.classList.add("is-opening");
    void ways.offsetWidth;
    requestAnimationFrame(() => ways.classList.remove("is-opening"));
  };

  hook.addEventListener("click", () => setOpen(hook.getAttribute("aria-expanded") !== "true"));
  document.querySelectorAll<HTMLAnchorElement>("[data-open-hook]").forEach((link) => {
    link.addEventListener("click", () => {
      if (hook.getAttribute("aria-expanded") !== "true") setOpen(true);
    });
  });
  if (window.location.hash === "#conjunto") setOpen(true);
}
