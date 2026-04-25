export interface Rgb {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export function hexToRgb(hex: string): Rgb {
  const m = hex.trim().replace(/^#/, "");
  const expanded = m.length === 3 || m.length === 4 ? m.split("").map((c) => c + c).join("") : m;
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(expanded)) {
    throw new Error("Invalid hex color.");
  }
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  if (expanded.length === 8) {
    const a = parseInt(expanded.slice(6, 8), 16) / 255;
    return { r, g, b, a };
  }
  return { r, g, b };
}

export function rgbToHex({ r, g, b, a }: Rgb): string {
  const h = (n: number) => clamp255(n).toString(16).padStart(2, "0");
  const base = `#${h(r)}${h(g)}${h(b)}`;
  return a !== undefined && a < 1 ? base + h(Math.round(a * 255)) : base;
}

export function rgbToHsl({ r, g, b, a }: Rgb): Hsl {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rf: h = (gf - bf) / d + (gf < bf ? 6 : 0); break;
      case gf: h = (bf - rf) / d + 2; break;
      case bf: h = (rf - gf) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100), a };
}

export function hslToRgb({ h, s, l, a }: Hsl): Rgb {
  const sf = s / 100, lf = l / 100;
  const c = (1 - Math.abs(2 * lf - 1)) * sf;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lf - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a,
  };
}

export function formatRgb(rgb: Rgb): string {
  return rgb.a !== undefined && rgb.a < 1
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
    : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHsl(hsl: Hsl): string {
  return hsl.a !== undefined && hsl.a < 1
    ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})`
    : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}
