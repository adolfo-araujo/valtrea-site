const storageKey = "valtrea-language-place";

interface Place {
  path: string;
  index: number;
  fraction: number;
}

function blocks(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>("main > *")].filter((element) => element.offsetHeight > 0);
}

function currentPlace(path: string): Place {
  const list = blocks();
  const y = window.scrollY;
  let index = 0;
  list.forEach((element, position) => {
    if (element.offsetTop <= y + 1) index = position;
  });
  const block = list[index];
  const fraction = block ? Math.min(1, Math.max(0, (y - block.offsetTop) / Math.max(1, block.offsetHeight))) : 0;
  return { path, index, fraction };
}

function restore(place: Place): void {
  const apply = () => {
    const block = blocks()[place.index];
    if (!block) return;
    window.scrollTo({ top: block.offsetTop + place.fraction * block.offsetHeight, behavior: "instant" });
  };
  apply();
  requestAnimationFrame(apply);
  void document.fonts.ready.then(apply);
  window.addEventListener("load", apply, { once: true });
}

export function keepPlaceOnLanguageSwitch(): void {
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      sessionStorage.removeItem(storageKey);
      const place = JSON.parse(saved) as Place;
      if (place.path === location.pathname && !location.hash) {
        history.scrollRestoration = "manual";
        restore(place);
      }
    }
  } catch {
    return;
  }

  document.querySelectorAll<HTMLAnchorElement>("a[data-lang-switch]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      const target = new URL(link.href, location.href);
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(currentPlace(target.pathname)));
        sessionStorage.setItem("valtrea-intro-seen", "1");
      } catch {
        return;
      }
    });
  });
}
