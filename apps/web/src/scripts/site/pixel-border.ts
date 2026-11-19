import { prefersReducedMotion } from "../motion";

interface Pixel {
  x: number;
  y: number;
  base: number;
  speed: number;
  phase: number;
  shade: number;
}

const shades = ["56, 122, 30", "46, 102, 25", "88, 160, 52", "120, 190, 80"];

export function twinklePixelBorders(): void {
  document.querySelectorAll<HTMLCanvasElement>("canvas[data-pixel-border]").forEach(start);
}

function start(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext("2d");
  const area = canvas.parentElement;
  if (!context || !area) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  let pixels: Pixel[] = [];
  let width = 0;
  let height = 0;
  let size = 10;
  let inView = false;
  let running = false;

  const build = () => {
    const box = area.getBoundingClientRect();
    width = box.width;
    height = box.height;
    size = width < 700 ? 8 : 11;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    pixels = [];
    const rows = Math.ceil(height / size);
    const columns = Math.ceil(width / size);
    for (let row = 0; row < rows; row += 1) {
      const density = Math.pow(1 - row / rows, 1.7);
      for (let column = 0; column < columns; column += 1) {
        if (Math.random() > density * 0.95) continue;
        pixels.push({
          x: column * size,
          y: row * size,
          base: 0.25 + density * 0.75,
          speed: 0.6 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          shade: Math.floor(Math.random() * shades.length),
        });
      }
    }
    draw(0);
  };

  const draw = (time: number) => {
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    for (const pixel of pixels) {
      const twinkle = 0.5 + 0.5 * Math.sin(time * 0.001 * pixel.speed + pixel.phase);
      context.fillStyle = `rgba(${shades[pixel.shade] ?? shades[0]}, ${(pixel.base * (0.25 + twinkle * 0.75)).toFixed(3)})`;
      context.fillRect(pixel.x, pixel.y, size - 1, size - 1);
    }
  };

  const step = (time: number) => {
    if (!inView) {
      running = false;
      return;
    }
    draw(time);
    requestAnimationFrame(step);
  };

  build();
  window.addEventListener("resize", build);
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? false;
    if (inView && !running) {
      running = true;
      requestAnimationFrame(step);
    }
  }).observe(area);
}
