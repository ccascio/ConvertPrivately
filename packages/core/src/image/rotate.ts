import { toBlob } from "../types.js";
import type { ConvertInput } from "../types.js";

export type RotationAngle = 0 | 90 | 180 | 270;
export type FlipAxis = "none" | "horizontal" | "vertical" | "both";

export interface RotateImageOptions {
  /** Clockwise rotation in degrees. Default: 0 */
  rotation?: RotationAngle;
  /** Flip axis. Default: "none" */
  flip?: FlipAxis;
  /** Output format. Default: "image/png" */
  format?: "image/png" | "image/jpeg" | "image/webp";
  /** Quality 0–1 for JPEG/WebP. Default: 0.92 */
  quality?: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export async function rotateImage(
  input: ConvertInput,
  opts: RotateImageOptions = {},
): Promise<Blob> {
  const blob = await toBlob(input);
  const url = URL.createObjectURL(blob);
  let img: HTMLImageElement;
  try {
    img = await loadImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }

  const rotation = opts.rotation ?? 0;
  const flip = opts.flip ?? "none";
  const format = opts.format ?? "image/png";
  const quality = opts.quality ?? 0.92;

  const isSwapped = rotation === 90 || rotation === 270;
  const w = isSwapped ? img.naturalHeight : img.naturalWidth;
  const h = isSwapped ? img.naturalWidth : img.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.translate(w / 2, h / 2);
  ctx.rotate((rotation * Math.PI) / 180);

  const sx = flip === "horizontal" || flip === "both" ? -1 : 1;
  const sy = flip === "vertical" || flip === "both" ? -1 : 1;
  ctx.scale(sx, sy);

  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob failed"))),
      format,
      format === "image/png" ? undefined : quality,
    );
  });
}
