/**
 * High-performance, zero-dependency HTML5 Canvas Confetti Engine.
 * Optimized for mobile Safari and Android Chrome with realistic physics,
 * 3D wobble, gravity, air friction, and celebratory color palettes.
 */

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  color: string;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
}

const CELEBRATION_COLORS = [
  '#f43f5e', // rose
  '#ec4899', // pink
  '#a855f7', // purple
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#eab308', // yellow
  '#06b6d4', // cyan
];

export function fireConfetti(options?: {
  count?: number;
  duration?: number;
  colors?: string[];
}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const count = options?.count ?? 150;
  const duration = options?.duration ?? 3500;
  const colors = options?.colors ?? CELEBRATION_COLORS;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = window.innerWidth;
  let height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const particles: Particle[] = [];

  // Spawn cannons from left and right bottom edges
  for (let i = 0; i < count; i++) {
    const isLeft = i % 2 === 0;
    const originX = isLeft ? width * 0.15 : width * 0.85;
    const originY = height * 0.85;

    const angle = isLeft
      ? -Math.PI / 3 + (Math.random() - 0.5) * 0.5 // Angled up-right
      : -2 * Math.PI / 3 + (Math.random() - 0.5) * 0.5; // Angled up-left

    const speed = 14 + Math.random() * 18;
    const shapes: ('rect' | 'circle' | 'star')[] = ['rect', 'rect', 'circle', 'star'];

    particles.push({
      x: originX,
      y: originY,
      w: 8 + Math.random() * 6,
      h: 5 + Math.random() * 8,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
      vy: Math.sin(angle) * speed - (5 + Math.random() * 6),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.08 + Math.random() * 0.08,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      opacity: 1,
    });
  }

  const startTime = performance.now();
  let animationFrameId: number;

  function render(now: number) {
    if (!ctx) return;
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      // Physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // gravity
      p.vx *= 0.985; // drag
      p.vy *= 0.985;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;

      // Fade out towards the end
      if (progress > 0.65) {
        p.opacity = Math.max(0, 1 - (progress - 0.65) / 0.35);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.wobble), 1);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'star') {
        drawStar(ctx, 0, 0, 5, p.w * 0.8, p.w * 0.4);
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      ctx.restore();
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(animationFrameId);
    canvas.remove();
  };
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}
