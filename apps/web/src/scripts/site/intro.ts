const seenKey = "valtrea-intro-seen";
const lengthMs = 3900;

export function playIntro(): void {
  const root = document.documentElement;
  if (!root.classList.contains("intro")) return;

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    try {
      sessionStorage.setItem(seenKey, "1");
    } catch (error) {
      void error;
    }
    root.classList.add("intro-done");
    window.setTimeout(() => {
      root.classList.remove("intro", "intro-done");
    }, 1300);
    events.forEach((name) => window.removeEventListener(name, finish));
  };

  const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  events.forEach((name) => window.addEventListener(name, finish, { passive: true }));
  window.setTimeout(finish, lengthMs);
}
