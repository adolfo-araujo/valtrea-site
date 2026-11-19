import { prefersReducedMotion } from "../motion";

const maxBlobs = 32;
const blobCount = 7;
const dropsPerBlob = 3;

interface Blob {
  x: number;
  r: number;
  speed: number;
  phase: number;
  drift: number;
}

interface Drop {
  parent: number;
  angle: number;
  spin: number;
  size: number;
  speed: number;
  phase: number;
}

const vertexSource = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec4 u_blobs[${maxBlobs}];
uniform int u_count;
uniform vec2 u_size;
uniform float u_line;
void main() {
  vec2 p = vec2(gl_FragCoord.x, u_size.y - gl_FragCoord.y);
  float field = 0.;
  vec2 grad = vec2(0.);
  for (int i = 0; i < ${maxBlobs}; i++) {
    if (i >= u_count) break;
    vec4 b = u_blobs[i];
    vec2 d = p - b.xy;
    float d2 = dot(d, d) + 1.;
    if (d2 > b.w) continue;
    float w = 1. - d2 / b.w;
    float base = b.z / d2;
    field += base * w * w;
    grad += -2. * base * w * (w / d2 + 2. / b.w) * d;
  }
  if (field < 0.45) { gl_FragColor = vec4(0.); return; }
  float g = max(length(grad), 1e-6);
  float edge = (field - 1.) / g;
  float vertical = grad.y * grad.y / (g * g);
  float side = 1. - vertical;
  float inner = clamp(1. - abs(edge - u_line * .4) / u_line, 0., 1.) * step(-.5, edge);
  float outer = clamp(1. - abs(edge + u_line * .4) / u_line, 0., 1.) * step(edge, .5);
  inner = inner * inner * (3. - 2. * inner);
  outer = outer * outer * (3. - 2. * outer);
  float core = clamp((field - 1.25) / 2.4, 0., 1.);
  float light = inner * vertical * .95 + core * .22 + clamp(edge + .5, 0., 1.) * .04;
  float dark = outer * side * .55;
  float alpha = min(1., light + dark);
  float tone = light / max(light + dark, 1e-4);
  gl_FragColor = vec4(vec3(tone) * alpha, alpha);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
  return shader;
}

export function flowLavaBehindServices(): void {
  document.querySelectorAll<HTMLCanvasElement>("canvas[data-lava]").forEach(startLava);
}

function startLava(canvas: HTMLCanvasElement): void {
  const section = canvas.parentElement;
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!section || !gl) return;

  let program: WebGLProgram;
  try {
    const built = gl.createProgram();
    if (!built) return;
    gl.attachShader(built, compile(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(built, compile(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(built);
    if (!gl.getProgramParameter(built, gl.LINK_STATUS)) return;
    program = built;
  } catch {
    return;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const blobsLocation = gl.getUniformLocation(program, "u_blobs");
  const countLocation = gl.getUniformLocation(program, "u_count");
  const sizeLocation = gl.getUniformLocation(program, "u_size");
  const lineLocation = gl.getUniformLocation(program, "u_line");
  const data = new Float32Array(maxBlobs * 4);

  const coarse = matchMedia("(pointer: coarse)").matches;
  const ratio = coarse ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
  const blobs: Blob[] = Array.from({ length: blobCount }, (_, index) => ({
    x: 0.08 + 0.84 * ((index * 0.37) % 1),
    r: 0.07 + 0.05 * ((index * 0.53) % 1),
    speed: 0.05 + 0.04 * ((index * 0.71) % 1),
    phase: index * 1.3,
    drift: 0.03 + 0.03 * ((index * 0.29) % 1),
  }));
  const drops: Drop[] = [];
  blobs.forEach((_, index) => {
    for (let j = 0; j < dropsPerBlob; j++) {
      drops.push({
        parent: index,
        angle: j * 2.09 + index,
        spin: (j % 2 ? 1 : -1) * (0.08 + 0.05 * ((index + j) % 3)),
        size: 0.26 + 0.12 * (((index * 3 + j) * 0.61) % 1),
        speed: 0.07 + 0.06 * (((index + j * 2) * 0.43) % 1),
        phase: index * 2.1 + j * 1.7,
      });
    }
  });

  let width = 0;
  let height = 0;
  let time = 0;
  let last = 0;
  let frame = 0;
  let visible = false;

  const resize = () => {
    const box = section.getBoundingClientRect();
    width = Math.max(1, Math.ceil(box.width * ratio));
    height = Math.max(1, Math.ceil(box.height * ratio));
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  };

  const draw = () => {
    const spots = blobs.map((blob) => {
      const y = 0.5 + 0.36 * Math.sin(time * blob.speed * Math.PI * 2 + blob.phase);
      const x = blob.x + blob.drift * Math.sin(time * 0.13 + blob.phase * 2);
      const radius = blob.r * Math.max(width, height * 0.6) * (1 + 0.12 * Math.sin(time * 0.4 + blob.phase));
      return { x: x * width, y: y * height, radius };
    });
    let count = 0;
    const push = (x: number, y: number, radius: number, cut: number) => {
      if (count >= maxBlobs) return;
      data[count * 4] = x;
      data[count * 4 + 1] = y;
      data[count * 4 + 2] = radius * radius;
      data[count * 4 + 3] = radius * radius * cut;
      count++;
    };
    for (const spot of spots) push(spot.x, spot.y, spot.radius, 20);
    for (const drop of drops) {
      const parent = spots[drop.parent];
      if (!parent) continue;
      let loose = 0.5 + 0.5 * Math.sin(time * drop.speed * Math.PI * 2 + drop.phase);
      loose = loose * loose * loose;
      const angle = drop.angle + time * drop.spin;
      const distance = parent.radius * (0.62 + 1.3 * loose);
      push(
        parent.x + Math.cos(angle) * distance,
        parent.y + Math.sin(angle) * distance * 0.9,
        parent.radius * drop.size * (1 - 0.18 * loose),
        22,
      );
    }
    gl.uniform4fv(blobsLocation, data);
    gl.uniform1i(countLocation, count);
    gl.uniform2f(sizeLocation, width, height);
    gl.uniform1f(lineLocation, 1.3 * ratio);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = (now: number) => {
    time += Math.min(0.05, (now - last) / 1000);
    last = now;
    draw();
    frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
  };
  const start = () => {
    if (frame || !visible || document.hidden) return;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  };

  resize();
  time = 3;
  draw();
  new ResizeObserver(() => {
    resize();
    draw();
  }).observe(section);
  if (prefersReducedMotion()) return;
  document.addEventListener("visibilitychange", start);
  new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    start();
  }).observe(section);
}
