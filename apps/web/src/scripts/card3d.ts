import { prefersReducedMotion } from "./motion";

export function wireMetalCard(): void {
  const scene = document.querySelector<HTMLElement>("[data-metal-card]");
  const card = scene?.querySelector<HTMLElement>("[data-metal-inner]");
  if (!scene || !card) return;
  const still = prefersReducedMotion();

  let flipped = false;
  let rx = 0;
  let ry = 0;
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;

  const apply = (animate: boolean) => {
    card.classList.toggle("is-animating", animate);
    const total = ry + (flipped ? 180 : 0);
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${total}deg`);
    const shine = ((((total % 360) + 360) % 360) / 360) * 100;
    card.style.setProperty("--shine", `${shine}%`);
  };

  const flip = () => {
    flipped = !flipped;
    rx = 0;
    ry = 0;
    apply(true);
  };

  scene.addEventListener("pointerdown", (event) => {
    dragging = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    baseX = rx;
    baseY = ry;
    scene.classList.add("is-held");
    scene.setPointerCapture(event.pointerId);
  });
  scene.addEventListener("pointermove", (event) => {
    if (dragging) {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      if (!moved || still) return;
      ry = baseY + dx * 0.5;
      rx = Math.max(-35, Math.min(35, baseX - dy * 0.3));
      apply(false);
      return;
    }
    if (still || event.pointerType !== "mouse") return;
    const box = scene.getBoundingClientRect();
    rx = ((event.clientY - box.top) / box.height - 0.5) * -12;
    ry = ((event.clientX - box.left) / box.width - 0.5) * 16;
    apply(false);
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    scene.classList.remove("is-held");
    if (!moved) {
      flip();
      return;
    }
    const turns = Math.round(ry / 180);
    if (turns % 2 !== 0) flipped = !flipped;
    ry = 0;
    rx = 0;
    apply(true);
  };
  scene.addEventListener("pointerup", release);
  scene.addEventListener("pointercancel", release);
  scene.addEventListener("pointerleave", () => {
    if (dragging) return;
    rx = 0;
    ry = 0;
    apply(true);
  });
  scene.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip();
    }
  });
  apply(false);
}
