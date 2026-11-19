export function wireShareButtons(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-share]").forEach((button) => {
    const label = button.querySelector<HTMLElement>("[data-share-label]") ?? button;
    const original = label.textContent ?? "";
    button.addEventListener("click", async () => {
      const url = button.dataset.url ?? window.location.href;
      const title = button.dataset.title ?? document.title;
      try {
        if (typeof navigator.share === "function") {
          await navigator.share({ title, url });
          return;
        }
        await navigator.clipboard.writeText(url);
        label.textContent = button.dataset.copied ?? "Link copiado";
        window.setTimeout(() => {
          label.textContent = original;
        }, 2000);
      } catch (error) {
        void error;
      }
    });
  });
}
