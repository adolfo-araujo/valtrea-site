const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function wireTilt(): void {
  document.querySelectorAll<HTMLElement>("[data-tilt-area]").forEach((area) => {
    const items = [...area.querySelectorAll<HTMLElement>("[data-tilt]")];
    if (!items.length || still()) return;
    let frame = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      items.forEach((item) => {
        const depth = Number(item.dataset.tilt || 1);
        item.style.setProperty("--tx", `${(x * 18 * depth).toFixed(2)}deg`);
        item.style.setProperty("--ty", `${(-y * 14 * depth).toFixed(2)}deg`);
        item.style.setProperty("--mx", `${(x * 14 * depth).toFixed(1)}px`);
        item.style.setProperty("--my", `${(y * 14 * depth).toFixed(1)}px`);
      });
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };
    area.addEventListener("pointermove", (event) => {
      const box = area.getBoundingClientRect();
      tx = (event.clientX - box.left) / box.width - 0.5;
      ty = (event.clientY - box.top) / box.height - 0.5;
      kick();
    });
    area.addEventListener("pointerleave", () => {
      tx = 0;
      ty = 0;
      kick();
    });
  });
}

export function wireCompare(): void {
  document.querySelectorAll<HTMLElement>("[data-compare]").forEach((box) => {
    const range = box.querySelector<HTMLInputElement>("input[type=range]");
    if (!range) return;
    const set = () => box.style.setProperty("--split", `${range.value}%`);
    range.addEventListener("input", set);
    set();
  });
}
