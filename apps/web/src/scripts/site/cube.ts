import { prefersReducedMotion } from "../motion";

export function wireProcessCube(): void {
  const stage = document.querySelector<HTMLElement>("[data-cube]");
  if (!stage) return;
  const faces = [...stage.querySelectorAll<HTMLElement>("[data-face]")];
  const dots = [...document.querySelectorAll<HTMLButtonElement>("[data-cube-dot]")];
  const live = document.querySelector<HTMLElement>("[data-cube-live]");
  const count = faces.length;
  if (!count) return;

  const step = 360 / count;
  const still = prefersReducedMotion();
  let rotation = 0;
  let speed = 0;
  let target = 0;
  let faceWidth = 560;
  let perspective = 1600;
  let running = false;
  let dragging = false;
  let dragX = 0;
  let dragRotation = 0;
  let lastX = 0;
  let lastTime = 0;
  let flick = 0;
  let announced = -1;

  const activeIndex = () => (((Math.round(-rotation / step) % count) + count) % count);

  const draw = () => {
    const half = faceWidth / 2;
    faces.forEach((face, index) => {
      const angle = rotation + index * step;
      const cosine = Math.cos((angle * Math.PI) / 180);
      const lit = Math.max(0, Math.min(1, (cosine - 0.35) / 0.6));
      face.style.transform = `perspective(${perspective}px) translateZ(${-half}px) rotateY(${angle}deg) translateZ(${half}px)`;
      face.style.zIndex = String(Math.round(cosine * 100) + 100);
      face.style.setProperty("--lit", lit.toFixed(3));
      face.style.setProperty("--dim", (1 - Math.max(0, cosine)).toFixed(3));
      face.setAttribute("aria-hidden", cosine > 0.7 ? "false" : "true");
    });
    const active = activeIndex();
    dots.forEach((dot, index) => dot.setAttribute("aria-current", String(index === active)));
  };

  const announce = () => {
    const active = activeIndex();
    if (active === announced || !live) return;
    announced = active;
    live.textContent = faces[active]?.dataset.label ?? "";
  };

  const size = () => {
    const available = stage.parentElement?.clientWidth ?? 600;
    faceWidth = Math.round(Math.min(560, available < 640 ? available * 0.84 : available * 0.62));
    perspective = Math.max(1100, faceWidth * 3);
    stage.style.setProperty("--face-w", `${faceWidth}px`);
    let tallest = 0;
    for (const face of faces) {
      face.style.height = "auto";
      tallest = Math.max(tallest, face.offsetHeight);
      face.style.height = "";
    }
    stage.style.setProperty("--face-h", `${Math.max(tallest, available < 640 ? 280 : 300)}px`);
    draw();
  };

  const tick = () => {
    if (dragging) {
      running = false;
      return;
    }
    speed = (speed + (target - rotation) * 0.075) * 0.8;
    rotation += speed;
    if (Math.abs(target - rotation) < 0.02 && Math.abs(speed) < 0.02) {
      rotation = target;
      speed = 0;
      running = false;
      draw();
      announce();
      return;
    }
    draw();
    requestAnimationFrame(tick);
  };

  const settle = () => {
    if (still) {
      rotation = target;
      speed = 0;
      draw();
      announce();
      return;
    }
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  };

  const goTo = (index: number) => {
    const wanted = -index * step;
    const difference = ((((wanted - target) % 360) + 540) % 360) - 180;
    target += difference;
    settle();
  };

  stage.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    dragging = true;
    dragX = lastX = event.clientX;
    lastTime = event.timeStamp;
    dragRotation = rotation;
    flick = 0;
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-dragging");
  });
  stage.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    rotation = dragRotation + (event.clientX - dragX) * (step / (faceWidth * 0.9));
    const elapsed = Math.max(1, event.timeStamp - lastTime);
    flick = flick * 0.6 + ((event.clientX - lastX) / elapsed) * 0.4;
    lastX = event.clientX;
    lastTime = event.timeStamp;
    draw();
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-dragging");
    const base = Math.round(rotation / step) * step;
    const thrown = rotation + flick * 140 * (step / (faceWidth * 0.9));
    target = Math.max(base - step, Math.min(base + step, Math.round(thrown / step) * step));
    speed = 0;
    settle();
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("lostpointercapture", release);

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") target -= step;
    else if (event.key === "ArrowLeft") target += step;
    else if (event.key === "Home") target = Math.round(target / 360) * 360;
    else return;
    event.preventDefault();
    settle();
  });
  dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));

  const fromHash = () => {
    const match = /^#etapa-(\d)$/.exec(window.location.hash);
    if (!match) return;
    goTo(Number(match[1]) - 1);
    document.getElementById("processo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  window.addEventListener("hashchange", fromHash);

  size();
  void document.fonts.ready.then(size);
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(size, 150);
  });

  if (!still && "IntersectionObserver" in window && !window.location.hash.startsWith("#etapa-")) {
    rotation = 150;
    draw();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        settle();
      },
      { threshold: 0.4 },
    );
    observer.observe(stage);
  }
  fromHash();
}
