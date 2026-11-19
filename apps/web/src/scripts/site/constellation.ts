import { prefersReducedMotion } from "../motion";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
}

const maxPixelRatio = 2;

export function driftConstellations(): void {
  document.querySelectorAll<HTMLCanvasElement>("canvas[data-constellation]").forEach(start);
}

function start(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext("2d");
  const area = canvas.parentElement;
  if (!context || !area) return;

  const ratio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
  const link = Number(canvas.dataset.link ?? 130);
  let width = 0;
  let height = 0;
  let points: Point[] = [];
  const pointer = { x: -9999, y: -9999 };
  let inView = false;
  let running = false;

  const build = () => {
    const box = area.getBoundingClientRect();
    width = box.width;
    height = box.height;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const mobile = width < 700;
    const count = Math.min(mobile ? 42 : 120, Math.round((width * height) / (mobile ? 11000 : 9000)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      ox: 0,
      oy: 0,
    }));
    draw();
  };

  const draw = () => {
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < points.length; i += 1) {
      const a = points[i];
      if (!a) continue;
      for (let j = i + 1; j < points.length; j += 1) {
        const b = points[j];
        if (!b) continue;
        const distance = Math.hypot(a.x + a.ox - b.x - b.ox, a.y + a.oy - b.y - b.oy);
        if (distance > link) continue;
        context.strokeStyle = `rgba(17, 17, 22, ${(1 - distance / link) * 0.22})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(a.x + a.ox, a.y + a.oy);
        context.lineTo(b.x + b.ox, b.y + b.oy);
        context.stroke();
      }
    }
    context.fillStyle = "rgba(17, 17, 22, 0.55)";
    for (const point of points) {
      context.beginPath();
      context.arc(point.x + point.ox, point.y + point.oy, 1.7, 0, Math.PI * 2);
      context.fill();
    }
  };

  const step = () => {
    if (!inView) {
      running = false;
      return;
    }
    for (const point of points) {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < -10) point.x = width + 10;
      if (point.x > width + 10) point.x = -10;
      if (point.y < -10) point.y = height + 10;
      if (point.y > height + 10) point.y = -10;
      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      let tx = 0;
      let ty = 0;
      if (distance < 130 && distance > 0.1) {
        const push = (1 - distance / 130) * 42;
        tx = (dx / distance) * push;
        ty = (dy / distance) * push;
      }
      point.ox += (tx - point.ox) * 0.12;
      point.oy += (ty - point.oy) * 0.12;
    }
    draw();
    requestAnimationFrame(step);
  };

  build();
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 150);
  });
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

  area.addEventListener("pointermove", (event) => {
    const box = canvas.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
  });
  area.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });
  new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false;
    if (inView && !running) {
      running = true;
      requestAnimationFrame(step);
    }
  }).observe(area);
}
