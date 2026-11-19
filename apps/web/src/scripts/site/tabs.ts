export function wireServiceTabs(): void {
  const root = document.querySelector<HTMLElement>("[data-tabs]");
  const track = root?.querySelector<HTMLElement>("[data-tabs-track]");
  const pill = root?.querySelector<HTMLElement>("[data-tabs-pill]");
  if (!root || !track || !pill) return;
  const tabs = [...track.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
  if (!tabs.length) return;

  let current = Math.max(
    0,
    tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"),
  );

  const place = (tab: HTMLElement) => {
    pill.style.width = `${tab.offsetWidth}px`;
    pill.style.height = `${tab.offsetHeight}px`;
    pill.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
  };

  const select = (index: number, focus: boolean) => {
    current = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const on = i === current;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      tab.classList.toggle("is-active", on);
    });
    panels.forEach((panel, i) => {
      panel.hidden = i !== current;
    });
    const tab = tabs[current];
    if (!tab) return;
    place(tab);
    if (track.scrollWidth > track.clientWidth) {
      track.scrollTo({ left: tab.offsetLeft - (track.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }
    if (focus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index, false));
    tab.addEventListener("mouseenter", () => place(tab));
    tab.addEventListener("keydown", (event) => {
      const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
      const next = moves[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });
  track.addEventListener("mouseleave", () => {
    const tab = tabs[current];
    if (tab) place(tab);
  });

  const fromHash = () => {
    const match = /^#s-([\w-]+)$/.exec(window.location.hash);
    if (!match) return;
    const index = tabs.findIndex((tab) => tab.dataset.id === match[1]);
    if (index < 0) return;
    select(index, false);
    document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  select(current, false);
  pill.classList.add("is-ready");
  window.addEventListener("resize", () => {
    const tab = tabs[current];
    if (tab) place(tab);
  });
  window.addEventListener("hashchange", fromHash);
  fromHash();
}
