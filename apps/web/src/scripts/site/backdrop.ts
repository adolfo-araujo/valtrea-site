import { prefersReducedMotion } from "../motion";

const cell = 22;
const offset = 11;
const reach = 150;
const maxPixelRatio = 2;
const blockMargin = 28;

function spotAllowed(x: number, y: number): boolean {
  const hit = document.elementFromPoint(x, y);
  const zone = hit?.closest<HTMLElement>("[data-spot-zone]");
  if (!zone) return false;
  for (const block of zone.querySelectorAll<HTMLElement>("[data-spot-block]")) {
    const box = block.getBoundingClientRect();
    if (
      x > box.left - blockMargin &&
      x < box.right + blockMargin &&
      y > box.top - blockMargin &&
      y < box.bottom + blockMargin
    ) {
      return false;
    }
  }
  return true;
}

interface Streak {
  x: number;
  y: number;
  length: number;
  speed: number;
  hue: number;
}

export function startBackdrop(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("canvas[data-backdrop]");
  const context = canvas?.getContext("2d");
  if (!canvas || !context || prefersReducedMotion()) return;

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const ratio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
  let width = 0;
  let height = 0;
  let streaks: Streak[] = [];
  const target = { x: -999, y: -999 };
  const spot = { x: -999, y: -999, strength: 0 };
  let active = false;
  let lastScroll = window.scrollY;
  let velocity = 0;
  let time = 0;

  const spawn = (fresh: boolean): Streak => {
    const columns = Math.max(1, Math.floor(width / cell));
    return {
      x: Math.floor(Math.random() * columns) * cell + offset,
      y: fresh ? Math.random() * height : -140 - Math.random() * height * 0.5,
      length: 50 + Math.random() * 90,
      speed: 0.25 + Math.random() * 0.45,
      hue: Math.floor(Math.random() * 360),
    };
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const count = width < 700 ? 5 : 11;
    streaks = Array.from({ length: count }, () => spawn(true));
  };

  const drawSpot = () => {
    spot.x += (target.x - spot.x) * 0.16;
    spot.y += (target.y - spot.y) * 0.16;
    spot.strength += ((active ? 1 : 0) - spot.strength) * 0.08;
    if (spot.strength < 0.01) return;
    const startX = Math.max(0, Math.floor((spot.x - reach) / cell));
    const endX = Math.ceil((spot.x + reach) / cell);
    const startY = Math.max(0, Math.floor((spot.y - reach) / cell));
    const endY = Math.ceil((spot.y + reach) / cell);
    for (let gx = startX; gx <= endX; gx += 1) {
      for (let gy = startY; gy <= endY; gy += 1) {
        const x = gx * cell + offset;
        const y = gy * cell + offset;
        const distance = Math.hypot(x - spot.x, y - spot.y);
        if (distance > reach) continue;
        const near = 1 - distance / reach;
        const eased = near * near * spot.strength;
        const hue = (Math.atan2(y - spot.y, x - spot.x) * 57.3 + time * 0.08 + gx * 4) % 360;
        context.fillStyle = `hsla(${hue}, 85%, 55%, ${0.15 + eased * 0.8})`;
        context.beginPath();
        context.arc(x, y, 1 + eased * 2.6, 0, Math.PI * 2);
        context.fill();
      }
    }
  };

  const drawStreaks = () => {
    const stretch = Math.min(3.5, 1 + Math.abs(velocity) * 0.06);
    for (const streak of streaks) {
      streak.y += streak.speed + Math.abs(velocity) * 0.05;
      const length = streak.length * stretch;
      if (streak.y - length > height) Object.assign(streak, spawn(false));
      const gradient = context.createLinearGradient(0, streak.y - length, 0, streak.y);
      gradient.addColorStop(0, `hsla(${streak.hue}, 85%, 58%, 0)`);
      gradient.addColorStop(1, `hsla(${streak.hue}, 85%, 58%, 0.55)`);
      context.fillStyle = gradient;
      context.fillRect(streak.x - 0.5, streak.y - length, 1, length);
    }
  };

  const frame = (now: number) => {
    time = now;
    const y = window.scrollY;
    velocity += (y - lastScroll - velocity) * 0.2;
    lastScroll = y;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    drawStreaks();
    if (finePointer) drawSpot();
    requestAnimationFrame(frame);
  };

  resize();
  window.addEventListener("resize", resize);
  if (finePointer) {
    window.addEventListener(
      "pointermove",
      (event) => {
        target.x = event.clientX;
        target.y = event.clientY;
        const allowed = spotAllowed(event.clientX, event.clientY);
        if (allowed && !active && spot.strength < 0.05) {
          spot.x = target.x;
          spot.y = target.y;
        }
        active = allowed;
      },
      { passive: true },
    );
    document.documentElement.addEventListener("pointerleave", () => {
      active = false;
    });
  }
  requestAnimationFrame(frame);
}
